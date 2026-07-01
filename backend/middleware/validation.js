/**
 * Input Validation Middleware
 * Provides secure input validation and sanitization
 */

const validator = require('validator');

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
function validateEmail(email) {
  return validator.isEmail(email);
}

/**
 * Validate text input (prevents XSS)
 * @param {string} text - Text to validate
 * @param {number} maxLength - Maximum allowed length
 * @returns {boolean} - True if valid
 */
function validateText(text, maxLength = 500) {
  return (
    typeof text === 'string' &&
    text.length > 0 &&
    text.length <= maxLength &&
    !containsHtmlTags(text)
  );
}

/**
 * Check for HTML tags (XSS prevention)
 * @param {string} text - Text to check
 * @returns {boolean} - True if HTML tags detected
 */
function containsHtmlTags(text) {
  return /<[^>]*>/g.test(text);
}

/**
 * Sanitize text input
 * @param {string} text - Text to sanitize
 * @returns {string} - Sanitized text
 */
function sanitizeText(text) {
  if (typeof text !== 'string') return '';
  return validator.escape(text).trim();
}

/**
 * Validate contact form data
 * @param {object} data - Form data
 * @returns {object} - Validation result
 */
function validateContactForm(data) {
  const errors = {};

  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Valid email is required';
  }

  if (!data.subject || !validateText(data.subject, 100)) {
    errors.subject = 'Subject must be between 1-100 characters';
  }

  if (!data.message || !validateText(data.message, 2000)) {
    errors.message = 'Message must be between 1-2000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate registration form data
 * @param {object} data - Form data
 * @returns {object} - Validation result
 */
function validateRegistrationForm(data) {
  const errors = {};
  const validAudiences = ['Student', 'Parent', 'Teacher', 'School Representative'];

  if (!data.full_name || !validateText(data.full_name, 100)) {
    errors.full_name = 'Full name must be between 1-100 characters';
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Valid email is required';
  }

  if (!data.audience || !validAudiences.includes(data.audience)) {
    errors.audience = 'Valid audience selection is required';
  }

  if (data.interest && !validateText(data.interest, 2000)) {
    errors.interest = 'Interest must be under 2000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

module.exports = {
  validateEmail,
  validateText,
  sanitizeText,
  validateContactForm,
  validateRegistrationForm
};
