/**
 * Health check endpoint
 * Used for monitoring and uptime checks
 */

const express = require('express');
const router = express.Router();

/**
 * GET /api/health
 * Returns server health status
 */
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;
