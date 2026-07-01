/**
 * Authentication routes - Login, Signup, 2FA, etc.
 * Implements secure authentication practices
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { runAsync, getAsync, allAsync } = require('../db/database');
const { validateEmail, sanitizeText, validateText } = require('../middleware/validation');
const crypto = require('crypto');

/**
 * Generate a 6-digit 2FA code
 */
function generate2FACode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send 2FA code via email (placeholder)
 * In production, integrate with email service (SendGrid, AWS SES, etc.)
 */
async function send2FACode(email, code) {
  // TODO: Implement actual email sending
  console.log(`[EMAIL] 2FA code for ${email}: ${code}`);
  // For demo purposes, we could store this in session/memory
  return true;
}

/**
 * POST /api/auth/signup
 * Create a new user account
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, accountType, password, enable2FA } = req.body;

    // Validation
    if (!validateEmail(email) || !validateText(name, 100) || !password) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input data'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    const validAccountTypes = ['Student', 'Parent', 'Teacher', 'School Representative'];
    if (!validAccountTypes.includes(accountType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid account type'
      });
    }

    // Check if user exists
    const existingUser = await getAsync('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await runAsync(
      `INSERT INTO users (email, password_hash, full_name, account_type, enable_2fa)
       VALUES (?, ?, ?, ?, ?)`,
      [email, passwordHash, sanitizeText(name), accountType, enable2FA ? 1 : 0]
    );

    // Log audit
    await runAsync(
      `INSERT INTO audit_logs (action, details, ip_address)
       VALUES (?, ?, ?)`,
      ['user_signup', `User: ${email}, Account Type: ${accountType}`, req.ip]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.id, email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: { id: result.id, email, name }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production' 
        ? 'Error creating account' 
        : error.message
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and request 2FA if enabled
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!validateEmail(email) || !password) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Find user
    const user = await getAsync('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // If 2FA is enabled, send code and return temp token
    if (user.enable_2fa) {
      const code = generate2FACode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await runAsync(
        `INSERT INTO two_fa_codes (user_id, code, expires_at)
         VALUES (?, ?, ?)`,
        [user.id, code, expiresAt]
      );

      // Send 2FA code
      await send2FACode(email, code);

      // Generate temporary token (expires in 15 minutes)
      const tempToken = jwt.sign(
        { userId: user.id, email, temporary: true },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '15m' }
      );

      await runAsync(
        `INSERT INTO audit_logs (action, details, ip_address)
         VALUES (?, ?, ?)`,
        ['login_2fa_initiated', `User: ${email}`, req.ip]
      );

      return res.status(200).json({
        success: true,
        requiresTwoFA: true,
        tempToken,
        message: 'Check your email for 2FA code'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    await runAsync(
      `INSERT INTO audit_logs (action, details, ip_address)
       VALUES (?, ?, ?)`,
      ['user_login', `User: ${email}`, req.ip]
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user.id, email, name: user.full_name }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production'
        ? 'Error logging in'
        : error.message
    });
  }
});

/**
 * POST /api/auth/verify-2fa
 * Verify 2FA code and return auth token
 */
router.post('/verify-2fa', async (req, res) => {
  try {
    const { code, tempToken } = req.body;

    if (!code || !tempToken) {
      return res.status(400).json({
        success: false,
        message: 'Missing code or token'
      });
    }

    // Verify temporary token
    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired temporary token'
      });
    }

    // Get user
    const user = await getAsync('SELECT id, email FROM users WHERE id = ?', [decoded.userId]);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check 2FA code
    const twoFARecord = await getAsync(
      `SELECT * FROM two_fa_codes 
       WHERE user_id = ? AND code = ? AND expires_at > datetime('now')
       ORDER BY created_at DESC LIMIT 1`,
      [user.id, code]
    );

    if (!twoFARecord) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired 2FA code'
      });
    }

    // Delete used code
    await runAsync('DELETE FROM two_fa_codes WHERE id = ?', [twoFARecord.id]);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    await runAsync(
      `INSERT INTO audit_logs (action, details, ip_address)
       VALUES (?, ?, ?)`,
      ['2fa_verified', `User: ${user.email}`, req.ip]
    );

    res.status(200).json({
      success: true,
      message: '2FA verified successfully',
      token,
      user: { id: user.id, email: user.email }
    });

  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production'
        ? 'Error verifying code'
        : error.message
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (invalidate token)
 */
router.post('/logout', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.decode(token);

      if (decoded) {
        runAsync(
          `INSERT INTO audit_logs (action, details, ip_address)
           VALUES (?, ?, ?)`,
          ['user_logout', `User ID: ${decoded.userId}`, req.ip]
        );
      }
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: 'Logged out'
    });
  }
});

/**
 * GET /api/auth/verify
 * Verify if token is valid (for protected routes)
 */
router.get('/verify', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No authorization header'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    res.status(200).json({
      success: true,
      message: 'Token is valid',
      user: { userId: decoded.userId, email: decoded.email }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
});

/**
 * POST /api/auth/forgot-password
 * Request a password reset email
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Find user (don't reveal if email exists)
    const user = await getAsync('SELECT id, email FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(200).json({ success: true, message: 'If the email exists, a reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token
    await runAsync(
      `INSERT INTO password_resets (user_id, token, expires_at)
       VALUES (?, ?, ?)`,
      [user.id, resetToken, expiresAt]
    );

    // Log audit
    await runAsync(
      `INSERT INTO audit_logs (action, details, ip_address)
       VALUES (?, ?, ?)`,
      ['password_reset_requested', `User: ${email}`, req.ip]
    );

    // In production, send this via email service
    const resetLink = `${req.protocol}://${req.get('host')}/reset-password.html?token=${resetToken}`;
    console.log(`[EMAIL] Password reset for ${email}: ${resetLink}`);

    res.status(200).json({
      success: true,
      message: 'If the email exists, a reset link has been sent.',
      // In development, return the link for testing
      ...(process.env.NODE_ENV !== 'production' && { resetLink })
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing request'
    });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password using token
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    // Find valid reset token
    const resetRecord = await getAsync(
      `SELECT * FROM password_resets
       WHERE token = ? AND used = 0 AND expires_at > datetime('now')`,
      [token]
    );

    if (!resetRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Update password
    await runAsync('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [passwordHash, resetRecord.user_id]);

    // Mark token as used
    await runAsync('UPDATE password_resets SET used = 1 WHERE id = ?', [resetRecord.id]);

    // Log audit
    await runAsync(
      `INSERT INTO audit_logs (action, details, ip_address)
       VALUES (?, ?, ?)`,
      ['password_reset_completed', `User ID: ${resetRecord.user_id}`, req.ip]
    );

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password'
    });
  }
});

/**
 * POST /api/auth/change-password
 * Change password (requires current password)
 */
router.post('/change-password', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
    }

    // Verify current password
    const user = await getAsync('SELECT * FROM users WHERE id = ?', [decoded.userId]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    // Hash and save new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    await runAsync('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [passwordHash, user.id]);

    await runAsync(
      `INSERT INTO audit_logs (action, details, ip_address)
       VALUES (?, ?, ?)`,
      ['password_changed', `User ID: ${user.id}`, req.ip]
    );

    res.status(200).json({ success: true, message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password'
    });
  }
});

/**
 * POST /api/auth/save-favorite
 * Save a favorite item (college, resource, etc.)
 */
router.post('/save-favorite', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const { itemType, itemId } = req.body;

    if (!itemType || !itemId) {
      return res.status(400).json({ success: false, message: 'Item type and ID required' });
    }

    await runAsync(
      `INSERT OR IGNORE INTO favorites (user_id, item_type, item_id)
       VALUES (?, ?, ?)`,
      [decoded.userId, itemType, itemId]
    );

    res.status(200).json({ success: true, message: 'Saved to favorites' });

  } catch (error) {
    console.error('Save favorite error:', error);
    res.status(500).json({ success: false, message: 'Error saving favorite' });
  }
});

/**
 * POST /api/auth/remove-favorite
 * Remove a favorite item
 */
router.post('/remove-favorite', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const { itemType, itemId } = req.body;

    await runAsync(
      `DELETE FROM favorites WHERE user_id = ? AND item_type = ? AND item_id = ?`,
      [decoded.userId, itemType, itemId]
    );

    res.status(200).json({ success: true, message: 'Removed from favorites' });

  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ success: false, message: 'Error removing favorite' });
  }
});

/**
 * GET /api/auth/favorites
 * Get user's favorites
 */
router.get('/favorites', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const favorites = await allAsync(
      `SELECT item_type, item_id, created_at FROM favorites WHERE user_id = ? ORDER BY created_at DESC`,
      [decoded.userId]
    );

    res.status(200).json({ success: true, favorites });

  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ success: false, message: 'Error retrieving favorites' });
  }
});

/**
 * GET /api/auth/profile
 * Get user profile
 */
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const user = await getAsync(
      'SELECT id, email, full_name, account_type, enable_2fa, created_at FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ success: false, message: 'Error retrieving profile' });
  }
});

module.exports = router;
