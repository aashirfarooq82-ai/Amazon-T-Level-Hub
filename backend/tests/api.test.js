/**
 * Integration tests for API endpoints
 * Tests end-to-end functionality
 */

const request = require('supertest');
const app = require('../../server');

describe('API Endpoints', () => {
  
  describe('POST /api/contact', () => {
    test('should accept valid contact submission', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'Test message content'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.id).toBeDefined();
    });

    test('should reject invalid email', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          email: 'invalid-email',
          subject: 'Test',
          message: 'Test'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors.email).toBeDefined();
    });

    test('should reject missing required fields', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should reject XSS attempts', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          email: 'test@example.com',
          subject: '<script>alert("xss")</script>',
          message: 'Test'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/register', () => {
    test('should accept valid registration', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          full_name: 'John Doe',
          email: 'john@example.com',
          audience: 'Student',
          interest: 'Amazon placements'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    test('should reject invalid audience', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          full_name: 'John Doe',
          email: 'john@example.com',
          audience: 'InvalidAudience',
          interest: 'Test'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors.audience).toBeDefined();
    });
  });

  describe('GET /api/health', () => {
    test('should return healthy status', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('404 Handler', () => {
    test('should return 404 for unknown endpoints', async () => {
      const response = await request(app)
        .get('/api/unknown');

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });
  });
});
