/**
 * Unit tests for validation middleware
 * Tests input validation and sanitization functions
 */

const {
  validateEmail,
  validateText,
  sanitizeText,
  validateContactForm,
  validateRegistrationForm
} = require('../../middleware/validation');

describe('Validation Middleware', () => {
  
  describe('validateEmail', () => {
    test('accepts valid email', () => {
      expect(validateEmail('user@example.com')).toBe(true);
    });

    test('rejects invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
    });

    test('rejects empty email', () => {
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validateText', () => {
    test('accepts valid text', () => {
      expect(validateText('Hello World')).toBe(true);
    });

    test('rejects text with HTML tags', () => {
      expect(validateText('<script>alert("xss")</script>')).toBe(false);
    });

    test('rejects text exceeding max length', () => {
      expect(validateText('a'.repeat(600), 500)).toBe(false);
    });

    test('rejects empty text', () => {
      expect(validateText('')).toBe(false);
    });
  });

  describe('sanitizeText', () => {
    test('escapes HTML entities', () => {
      expect(sanitizeText('<script>')).toBe('&lt;script&gt;');
    });

    test('trims whitespace', () => {
      expect(sanitizeText('  hello  ')).toBe('hello');
    });
  });

  describe('validateContactForm', () => {
    test('accepts valid contact form', () => {
      const result = validateContactForm({
        email: 'user@example.com',
        subject: 'Test Subject',
        message: 'Test message content'
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('rejects invalid email', () => {
      const result = validateContactForm({
        email: 'invalid',
        subject: 'Test',
        message: 'Test'
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeDefined();
    });

    test('rejects missing required fields', () => {
      const result = validateContactForm({});
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateRegistrationForm', () => {
    test('accepts valid registration form', () => {
      const result = validateRegistrationForm({
        full_name: 'John Doe',
        email: 'john@example.com',
        audience: 'Student',
        interest: 'T Levels'
      });
      expect(result.isValid).toBe(true);
    });

    test('rejects invalid audience', () => {
      const result = validateRegistrationForm({
        full_name: 'John Doe',
        email: 'john@example.com',
        audience: 'Invalid',
        interest: 'Test'
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.audience).toBeDefined();
    });
  });
});
