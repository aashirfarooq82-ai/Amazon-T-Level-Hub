/**
 * Registration API endpoint
 * Handles interest registration submissions
 */

const express = require('express');
const router = express.Router();
const { runAsync } = require('../db/database');
const { validateRegistrationForm, sanitizeText } = require('../middleware/validation');
const { sendRegistrationAcknowledgement, sendRegistrationNotificationToAdmin } = require('../services/email');

/**
 * POST /api/register
 * Submit interest registration
 * 
 * Request body:
 * {
 *   full_name: string (required, 1-100 chars),
 *   email: string (required, valid email),
 *   audience: string (required, one of: Student, Parent, Teacher, School Representative),
 *   interest: string (optional, max 2000 chars)
 * }
 */
router.post('/', async (req, res) => {
  try {
    const { full_name, email, audience, interest } = req.body;

    // Validate input
    const validation = validateRegistrationForm({
      full_name,
      email,
      audience,
      interest
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Sanitize inputs
    const sanitizedName = sanitizeText(full_name);
    const sanitizedEmail = sanitizeText(email);
    const sanitizedAudience = sanitizeText(audience);
    const sanitizedInterest = interest ? sanitizeText(interest) : null;

    // Insert into database
    const result = await runAsync(
      `INSERT INTO registrations (full_name, email, audience, interest, ip_address, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [sanitizedName, sanitizedEmail, sanitizedAudience, sanitizedInterest, req.ip]
    );

    // Log action for audit trail
    await runAsync(
      `INSERT INTO audit_logs (action, details, ip_address)
       VALUES (?, ?, ?)`,
      ['registration_submission', `Registration ID: ${result.id}, Audience: ${sanitizedAudience}`, req.ip]
    );

    // Send automated emails in the background (don't block the response)
    Promise.all([
      sendRegistrationAcknowledgement(sanitizedEmail, sanitizedName, sanitizedAudience),
      sendRegistrationNotificationToAdmin(sanitizedEmail, sanitizedName, sanitizedAudience, sanitizedInterest)
    ]).catch(err => console.error('Email sending error:', err));

    res.status(201).json({
      success: true,
      id: result.id,
      message: `Thank you for registering, ${sanitizedName}! We have received your request. A team member will respond shortly.`
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing registration. Please try again later.'
    });
  }
});

module.exports = router;