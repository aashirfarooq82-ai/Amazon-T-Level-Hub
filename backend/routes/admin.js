/**
 * Admin routes - Dashboard, user management, analytics
 * Requires admin privileges
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { runAsync, allAsync, getAsync } = require('../db/database');
const crypto = require('crypto');

/**
 * Middleware to verify admin authentication
 */
async function verifyAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Authorization required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Check if user is admin
    const user = await getAsync(
      'SELECT id, email, full_name, account_type FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // For now, we'll use account_type to determine admin status
    // In production, add an is_admin column to users table
    const isAdmin = user.account_type === 'Admin' || user.email === 'admin@amazon.com';

    if (!isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

/**
 * GET /api/admin/dashboard
 * Get dashboard statistics
 */
router.get('/dashboard', verifyAdmin, async (req, res) => {
  try {
    // Get user count
    const userCount = await getAsync('SELECT COUNT(*) as count FROM users');
    
    // Get contact count
    const contactCount = await getAsync('SELECT COUNT(*) as count FROM contacts');
    
    // Get registration count
    const registrationCount = await getAsync('SELECT COUNT(*) as count FROM registrations');
    
    // Get pending contacts
    const pendingContacts = await getAsync(
      "SELECT COUNT(*) as count FROM contacts WHERE status = 'pending'"
    );
    
    // Get recent users (last 7 days)
    const recentUsers = await allAsync(
      `SELECT COUNT(*) as count FROM users 
       WHERE created_at >= datetime('now', '-7 days')`
    );
    
    // Get recent registrations (last 7 days)
    const recentRegistrations = await allAsync(
      `SELECT COUNT(*) as count FROM registrations 
       WHERE created_at >= datetime('now', '-7 days')`
    );

    // Get contact submissions by status
    const contactStats = await allAsync(
      `SELECT status, COUNT(*) as count 
       FROM contacts 
       GROUP BY status`
    );

    // Get registrations by audience type
    const registrationStats = await allAsync(
      `SELECT audience, COUNT(*) as count 
       FROM registrations 
       GROUP BY audience`
    );

    // Get recent activity (last 10 audit logs)
    const recentActivity = await allAsync(
      `SELECT action, details, ip_address, created_at 
       FROM audit_logs 
       ORDER BY created_at DESC 
       LIMIT 10`
    );

    res.status(200).json({
      success: true,
      stats: {
        totalUsers: userCount.count,
        totalContacts: contactCount.count,
        totalRegistrations: registrationCount.count,
        pendingContacts: pendingContacts.count,
        recentUsers: recentUsers[0]?.count || 0,
        recentRegistrations: recentRegistrations[0]?.count || 0
      },
      contactStats,
      registrationStats,
      recentActivity
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Error fetching dashboard data' });
  }
});

/**
 * GET /api/admin/users
 * Get all users with pagination
 */
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    let query = 'SELECT id, email, full_name, account_type, enable_2fa, created_at FROM users';
    let countQuery = 'SELECT COUNT(*) as total FROM users';
    const params = [];

    if (search) {
      query += ' WHERE email LIKE ? OR full_name LIKE ?';
      countQuery += ' WHERE email LIKE ? OR full_name LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    
    const [users, totalResult] = await Promise.all([
      allAsync(query, search ? [...params, limit, offset] : [limit, offset]),
      allAsync(countQuery, search ? params : [])
    ]);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total: totalResult[0]?.total || 0,
        totalPages: Math.ceil((totalResult[0]?.total || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

/**
 * GET /api/admin/users/:id
 * Get single user details
 */
router.get('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const user = await getAsync(
      'SELECT id, email, full_name, account_type, enable_2fa, created_at FROM users WHERE id = ?',
      [req.params.id]
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get user's favorites
    const favorites = await allAsync(
      'SELECT item_type, item_id, created_at FROM favorites WHERE user_id = ?',
      [req.params.id]
    );

    res.status(200).json({
      success: true,
      user,
      favorites
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Error fetching user' });
  }
});

/**
 * PUT /api/admin/users/:id
 * Update user
 */
router.put('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const { full_name, account_type, enable_2fa } = req.body;

    const user = await getAsync('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await runAsync(
      `UPDATE users 
       SET full_name = ?, account_type = ?, enable_2fa = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [full_name, account_type, enable_2fa ? 1 : 0, req.params.id]
    );

    // Log audit
    await runAsync(
      `INSERT INTO audit_logs (action, details, ip_address)
       VALUES (?, ?, ?)`,
      ['admin_user_updated', `User ID: ${req.params.id}`, req.ip]
    );

    res.status(200).json({
      success: true,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: 'Error updating user' });
  }
});

/**
 * DELETE /api/admin/users/:id
 * Delete user
 */
router.delete('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const user = await getAsync('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Delete user's favorites first
    await runAsync('DELETE FROM favorites WHERE user_id = ?', [req.params.id]);
    
    // Delete user
    await runAsync('DELETE FROM users WHERE id = ?', [req.params.id]);

    // Log audit
    await runAsync(
      `INSERT INTO audit_logs (action, details, ip_address)
       VALUES (?, ?, ?)`,
      ['admin_user_deleted', `User ID: ${req.params.id}, Email: ${user.email}`, req.ip]
    );

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Error deleting user' });
  }
});

/**
 * GET /api/admin/contacts
 * Get all contact submissions
 */
router.get('/contacts', verifyAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const status = req.query.status || '';
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM contacts';
    let countQuery = 'SELECT COUNT(*) as total FROM contacts';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      countQuery += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

    const [contacts, totalResult] = await Promise.all([
      allAsync(query, params.length > 0 ? [...params, limit, offset] : [limit, offset]),
      allAsync(countQuery, params)
    ]);

    res.status(200).json({
      success: true,
      contacts,
      pagination: {
        page,
        limit,
        total: totalResult[0]?.total || 0,
        totalPages: Math.ceil((totalResult[0]?.total || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ success: false, message: 'Error fetching contacts' });
  }
});

/**
 * PUT /api/admin/contacts/:id
 * Update contact status
 */
router.put('/contacts/:id', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const contact = await getAsync('SELECT * FROM contacts WHERE id = ?', [req.params.id]);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    await runAsync(
      'UPDATE contacts SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    // Log audit
    await runAsync(
      `INSERT INTO audit_logs (action, details, ip_address)
       VALUES (?, ?, ?)`,
      ['admin_contact_updated', `Contact ID: ${req.params.id}, Status: ${status}`, req.ip]
    );

    res.status(200).json({
      success: true,
      message: 'Contact status updated successfully'
    });

  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ success: false, message: 'Error updating contact' });
  }
});

/**
 * GET /api/admin/registrations
 * Get all registrations
 */
router.get('/registrations', verifyAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const audience = req.query.audience || '';
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM registrations';
    let countQuery = 'SELECT COUNT(*) as total FROM registrations';
    const params = [];

    if (audience) {
      query += ' WHERE audience = ?';
      countQuery += ' WHERE audience = ?';
      params.push(audience);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

    const [registrations, totalResult] = await Promise.all([
      allAsync(query, params.length > 0 ? [...params, limit, offset] : [limit, offset]),
      allAsync(countQuery, params)
    ]);

    res.status(200).json({
      success: true,
      registrations,
      pagination: {
        page,
        limit,
        total: totalResult[0]?.total || 0,
        totalPages: Math.ceil((totalResult[0]?.total || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ success: false, message: 'Error fetching registrations' });
  }
});

/**
 * GET /api/admin/audit-logs
 * Get audit logs
 */
router.get('/audit-logs', verifyAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const action = req.query.action || '';
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM audit_logs';
    let countQuery = 'SELECT COUNT(*) as total FROM audit_logs';
    const params = [];

    if (action) {
      query += ' WHERE action = ?';
      countQuery += ' WHERE action = ?';
      params.push(action);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

    const [logs, totalResult] = await Promise.all([
      allAsync(query, params.length > 0 ? [...params, limit, offset] : [limit, offset]),
      allAsync(countQuery, params)
    ]);

    res.status(200).json({
      success: true,
      logs,
      pagination: {
        page,
        limit,
        total: totalResult[0]?.total || 0,
        totalPages: Math.ceil((totalResult[0]?.total || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ success: false, message: 'Error fetching audit logs' });
  }
});

/**
 * GET /api/admin/analytics
 * Get analytics data
 */
router.get('/analytics', verifyAdmin, async (req, res) => {
  try {
    // User growth over last 30 days
    const userGrowth = await allAsync(
      `SELECT date(created_at) as date, COUNT(*) as count
       FROM users
       WHERE created_at >= datetime('now', '-30 days')
       GROUP BY date(created_at)
       ORDER BY date ASC`
    );

    // Registration growth over last 30 days
    const registrationGrowth = await allAsync(
      `SELECT date(created_at) as date, COUNT(*) as count
       FROM registrations
       WHERE created_at >= datetime('now', '-30 days')
       GROUP BY date(created_at)
       ORDER BY date ASC`
    );

    // Contact submissions over last 30 days
    const contactGrowth = await allAsync(
      `SELECT date(created_at) as date, COUNT(*) as count
       FROM contacts
       WHERE created_at >= datetime('now', '-30 days')
       GROUP BY date(created_at)
       ORDER BY date ASC`
    );

    // Account type distribution
    const accountTypeDistribution = await allAsync(
      `SELECT account_type, COUNT(*) as count
       FROM users
       GROUP BY account_type`
    );

    // Audience type distribution
    const audienceDistribution = await allAsync(
      `SELECT audience, COUNT(*) as count
       FROM registrations
       GROUP BY audience`
    );

    res.status(200).json({
      success: true,
      userGrowth,
      registrationGrowth,
      contactGrowth,
      accountTypeDistribution,
      audienceDistribution
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, message: 'Error fetching analytics' });
  }
});

/**
 * POST /api/admin/export/users
 * Export users to CSV
 */
router.get('/export/users', verifyAdmin, async (req, res) => {
  try {
    const users = await allAsync(
      'SELECT id, email, full_name, account_type, enable_2fa, created_at FROM users ORDER BY created_at DESC'
    );

    // Create CSV content
    const headers = ['ID', 'Email', 'Full Name', 'Account Type', '2FA Enabled', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        user.id,
        user.email,
        `"${user.full_name}"`,
        user.account_type,
        user.enable_2fa ? 'Yes' : 'No',
        user.created_at
      ].join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    res.send(csvContent);

  } catch (error) {
    console.error('Export users error:', error);
    res.status(500).json({ success: false, message: 'Error exporting users' });
  }
});

/**
 * POST /api/admin/export/contacts
 * Export contacts to CSV
 */
router.get('/export/contacts', verifyAdmin, async (req, res) => {
  try {
    const contacts = await allAsync(
      'SELECT id, name, email, subject, message, status, created_at FROM contacts ORDER BY created_at DESC'
    );

    // Create CSV content
    const headers = ['ID', 'Name', 'Email', 'Subject', 'Message', 'Status', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...contacts.map(contact => [
        contact.id,
        contact.name ? `"${contact.name}"` : '',
        contact.email,
        `"${contact.subject}"`,
        `"${contact.message.replace(/"/g, '""')}"`,
        contact.status,
        contact.created_at
      ].join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
    res.send(csvContent);

  } catch (error) {
    console.error('Export contacts error:', error);
    res.status(500).json({ success: false, message: 'Error exporting contacts' });
  }
});

module.exports = router;