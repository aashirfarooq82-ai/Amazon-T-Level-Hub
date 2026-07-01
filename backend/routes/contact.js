/**
 * Contact form API endpoint
 * Handles contact form submissions with validation and automated email responses
 */

const express = require('express');
const router = express.Router();
const { runAsync } = require('../db/database');
const { validateContactForm, sanitizeText } = require('../middleware/validation');
const { sendContactAcknowledgement, sendContactNotificationToAdmin } = require('../services/email');



/**
 * POST /api/contact
 * Submit contact form
 * 
 * Request body:
 * {
 *   email: string (required, valid email),
 *   subject: string (required, 1-100 chars),
 *   message: string (required, 1-2000 chars)
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   id?: number,
 *   message: string,
 *   errors?: object
 * }
 */
  router.post('/', async (req, res) => {
    try {
      const { name, email, subject, message, _honeypot } = req.body;

      // Honeypot spam protection - if honeypot field is filled, it's likely spam
      if (_honeypot) {
        console.warn(`Spam detected from IP ${req.ip}: honeypot field was filled`);
        // Return success to avoid revealing the honeypot, but don't process
        return res.status(200).json({
          success: true,
          message: 'Thank you for your enquiry. We will respond within 2 business days.'
        });
      }

      // Validate input
      const validation = validateContactForm({
        name,
        email,
        subject,
        message
      });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

      // Sanitize inputs
      const sanitizedName = sanitizeText(name);
      const sanitizedEmail = sanitizeText(email);
      const sanitizedSubject = sanitizeText(subject);
      const sanitizedMessage = sanitizeText(message);

      // Get current timestamp
      const timestamp = new Date().toISOString();

      // Insert into database
      const result = await runAsync(
        `INSERT INTO contacts (name, email, subject, message, ip_address, status)
         VALUES (?, ?, ?, ?, ?, 'pending')`,
        [sanitizedName, sanitizedEmail, sanitizedSubject, sanitizedMessage, req.ip]
      );

      // Log action for audit trail
      await runAsync(
        `INSERT INTO audit_logs (action, details, ip_address)
         VALUES (?, ?, ?)`,
        ['contact_submission', `Contact ID: ${result.id}, Name: ${sanitizedName}`, req.ip]
      );

      // Send automated emails in the background (don't block the response)
      Promise.all([
        sendContactAcknowledgement(sanitizedEmail, sanitizedName, sanitizedSubject),
        sendContactNotificationToAdmin(sanitizedName, sanitizedEmail, sanitizedSubject, sanitizedMessage, timestamp)
      ]).catch(err => console.error('Email sending error:', err));

      res.status(201).json({
        success: true,
        id: result.id,
        message: 'Thank you for your enquiry. We will respond within 2 business days.'
      });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting form. Please try again later.'
    });
  }
});

/**
 * GET /api/contact/:id
 * Retrieve contact submission status (for admin use)
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!Number.isInteger(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID'
      });
    }

    const { getAsync } = require('../db/database');
    const contact = await getAsync(
      'SELECT id, email, subject, status, created_at FROM contacts WHERE id = ?',
      [id]
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact record not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (error) {
    console.error('Error retrieving contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving contact information'
    });
  }
});

module.exports = router;