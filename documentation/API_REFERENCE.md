# API Reference Guide

## Base URL
- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

---

## Endpoints

### 1. Contact Form Submission

#### POST `/api/contact`

Submit a contact form inquiry.

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "string (required, valid email format)",
  "subject": "string (required, 1-100 characters)",
  "message": "string (required, 1-2000 characters)"
}
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "id": 1,
  "message": "Thank you for your enquiry. We will respond within 24 hours."
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Valid email is required",
    "subject": "Subject must be between 1-100 characters",
    "message": "Message must be between 1-2000 characters"
  }
}
```

**Validation Rules**:
- Email: Valid email format (RFC 5322 compliant)
- Subject: 1-100 alphanumeric characters
- Message: 1-2000 characters, no HTML tags
- No XSS payloads allowed

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "subject": "T Levels Information Request",
    "message": "I would like to learn more about Amazon T Levels opportunities."
  }'
```

---

### 2. Interest Registration

#### POST `/api/register`

Register interest in T Levels program.

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "full_name": "string (required, 1-100 characters)",
  "email": "string (required, valid email format)",
  "audience": "string (required, one of: Student, Parent, Teacher, School Representative)",
  "interest": "string (optional, max 2000 characters)"
}
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "id": 1,
  "message": "Thank you for registering, John Doe! We'll be in touch soon."
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "full_name": "Full name must be between 1-100 characters",
    "email": "Valid email is required",
    "audience": "Valid audience selection is required"
  }
}
```

**Validation Rules**:
- Full Name: 1-100 characters, no HTML tags
- Email: Valid email format
- Audience: Must be one of the specified options
- Interest: Optional, max 2000 characters

**Valid Audiences**:
- Student
- Parent
- Teacher
- School Representative

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Jane Smith",
    "email": "jane@example.com",
    "audience": "Student",
    "interest": "Interested in AWS cloud computing pathway"
  }'
```

---

### 3. Health Check

#### GET `/api/health`

Check if API is running and healthy.

**Response** (200 OK):
```json
{
  "status": "healthy",
  "timestamp": "2026-06-17T10:30:00.000Z",
  "uptime": 3600
}
```

**Example Request**:
```bash
curl http://localhost:3000/api/health
```

---

## Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation failed or invalid input |
| 404 | Not Found | Endpoint not found |
| 429 | Too Many Requests | Rate limit exceeded (100 requests/15 min) |
| 500 | Server Error | Internal server error |

---

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP address
- **Header**: `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`

When limit exceeded:
```json
{
  "error": "Too many requests, please try again later"
}
```

---

## CORS Headers

Allowed origins (configured in .env):
- `http://localhost:3000`
- `http://localhost:5000`
- `file://`

**Allowed Methods**:
- GET
- POST
- OPTIONS

**Allowed Headers**:
- Content-Type

---

## Data Validation

All inputs are validated server-side and:
- Sanitized to prevent XSS attacks
- Limited to maximum lengths
- Checked for valid formats
- Escaped before database insertion

---

## Security Measures

1. **HTTPS Only** (production)
2. **CORS Protection**
3. **Rate Limiting**
4. **Input Validation**
5. **SQL Injection Prevention** (parameterized queries)
6. **XSS Prevention** (HTML entity escaping)
7. **Audit Logging**
8. **Security Headers** (Helmet.js)

---

## Integration Guide

### JavaScript/Fetch

```javascript
// Contact form submission
async function submitContact(email, subject, message) {
  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        subject,
        message
      })
    });

    const data = await response.json();

    if (data.success) {
      console.log('Success:', data.message);
    } else {
      console.error('Errors:', data.errors);
    }
  } catch (error) {
    console.error('Request error:', error);
  }
}
```

### Node.js/Axios

```javascript
const axios = require('axios');

async function registerInterest(fullName, email, audience) {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/register',
      {
        full_name: fullName,
        email,
        audience
      }
    );

    console.log('Registration success:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Validation errors:', error.response.data.errors);
    } else {
      console.error('Error:', error.message);
    }
  }
}
```

---

**API Version**: 1.0.0
**Last Updated**: 2026-06-17
