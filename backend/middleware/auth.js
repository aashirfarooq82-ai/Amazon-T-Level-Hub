/**
 * Authentication middleware - JWT token verification
 * Protects routes that require authentication
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token
 * Adds user info to request if token is valid
 */
function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }

    res.status(401).json({
      success: false,
      message: 'Invalid authorization token'
    });
  }
}

/**
 * Middleware to verify JWT token (optional)
 * Does not reject if token is missing, but adds user info if valid
 */
function optionalAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = {
        userId: decoded.userId,
        email: decoded.email
      };
    }

    next();
  } catch (error) {
    // Silently ignore invalid tokens on optional routes
    next();
  }
}

module.exports = {
  authMiddleware,
  optionalAuthMiddleware
};
