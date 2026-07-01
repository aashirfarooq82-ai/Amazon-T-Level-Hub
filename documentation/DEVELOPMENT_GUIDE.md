# Comprehensive Development Documentation

## Amazon T Levels Hub - Digital Solution

### 1. Project Overview

The Amazon T Levels Hub is a full-stack web application designed to connect students, parents, schools, and teachers with Amazon's T Levels educational program. This solution combines an accessible, responsive front-end with a secure, scalable back-end.

**Key Components:**
- **Front-end**: HTML5, CSS3, JavaScript (responsive, accessible)
- **Back-end**: Node.js/Express with SQLite database
- **Security**: Input validation, CSRF protection, rate limiting
- **Accessibility**: WCAG 2.1 compliance, dark mode, text sizing

---

### 2. Architecture & Design

#### 2.1 Front-end Architecture
- **Responsive Design**: Mobile-first approach with CSS Grid/Flexbox
- **Accessibility Features**:
  - Dark mode with purple & turquoise color scheme
  - Adjustable text sizes for dyslexia support
  - Semantic HTML structure
  - ARIA labels and roles
  - Keyboard navigation support
  - Color contrast compliance (WCAG AA)

#### 2.2 Back-end Architecture
- **API-First Design**: RESTful endpoints for form submissions
- **Database Layer**: SQLite with parameterized queries (SQL injection prevention)
- **Security Middleware**: Helmet, CORS, rate limiting
- **Error Handling**: Comprehensive error handling with audit logging

---

### 3. Security Implementation

#### 3.1 Code Security Measures

**Input Validation & Sanitization** (`backend/middleware/validation.js`):
```javascript
- Email format validation using `validator.js`
- HTML tag detection and rejection
- Character limit enforcement
- HTML entity escaping (XSS prevention)
```

**SQL Injection Prevention**:
```javascript
// Parameterized queries - NOT vulnerable to SQL injection
db.run('SELECT * FROM users WHERE email = ?', [userEmail])

// BAD - Vulnerable to SQL injection
db.run('SELECT * FROM users WHERE email = ' + userEmail)
```

**Authentication & Rate Limiting**:
- Rate limiting: 100 requests per 15 minutes per IP
- CORS configured to allow only specific origins
- Content-type validation and payload size limits

#### 3.2 Server Security Headers (via Helmet)
```
X-Content-Type-Options: nosniff          (Prevent MIME sniffing)
X-Frame-Options: DENY                     (Prevent clickjacking)
Content-Security-Policy: strict           (Prevent XSS)
Strict-Transport-Security                 (Force HTTPS)
```

---

### 4. Database Schema

#### Tables & Constraints:

**contacts** - Contact form submissions
```sql
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'pending',
  ip_address TEXT,
  CONSTRAINT email_format CHECK(email LIKE '%@%.%')
)
```

**registrations** - Interest registrations
```sql
CREATE TABLE registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  audience TEXT NOT NULL,
  interest TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'pending',
  ip_address TEXT,
  CONSTRAINT valid_audience CHECK(
    audience IN ('Student', 'Parent', 'Teacher', 'School Representative')
  )
)
```

**audit_logs** - Security audit trail
```sql
CREATE TABLE audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

---

### 5. API Documentation

#### 5.1 Contact Submission

**Endpoint**: `POST /api/contact`

**Request**:
```json
{
  "email": "user@example.com",
  "subject": "T Levels Information",
  "message": "I would like more information about T Levels"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "id": 1,
  "message": "Thank you for your enquiry. We will respond within 24 hours."
}
```

**Error Response (400 Bad Request)**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Valid email is required"
  }
}
```

#### 5.2 Registration

**Endpoint**: `POST /api/register`

**Request**:
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "audience": "Student",
  "interest": "AWS internships"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "id": 1,
  "message": "Thank you for registering, John Doe! We'll be in touch soon."
}
```

#### 5.3 Health Check

**Endpoint**: `GET /api/health`

**Response (200 OK)**:
```json
{
  "status": "healthy",
  "timestamp": "2026-06-17T10:30:00.000Z",
  "uptime": 3600
}
```

---

### 6. Testing Strategy

#### 6.1 Unit Tests (`backend/tests/validation.test.js`)

Tests validation functions:
- Email format validation
- Text content validation
- HTML tag detection
- Sanitization functions

**Run**: `npm test`

#### 6.2 Integration Tests (`backend/tests/api.test.js`)

Tests API endpoints:
- Valid form submissions (201 Created)
- Invalid data rejection (400 Bad Request)
- XSS attack prevention
- Missing field handling
- 404 error handling

**Run**: `npm test`

**Test Coverage Targets**:
- Input validation: 100%
- API endpoints: 95%+
- Error handling: 90%+

---

### 7. Development Process & Changes

#### 7.1 Iterative Development Log

**Phase 1: Foundation (Complete)**
- ✅ Created responsive front-end with accessibility features
- ✅ Implemented dark mode with color scheme
- ✅ Added text size adjustment for dyslexia support
- ✅ Implemented localStorage for preference persistence

**Phase 2: Back-end Development (Complete)**
- ✅ Set up Node.js/Express server
- ✅ Created SQLite database with schema
- ✅ Implemented input validation middleware
- ✅ Created RESTful API endpoints
- ✅ Added security headers (Helmet)
- ✅ Implemented rate limiting

**Phase 3: Security Hardening (Complete)**
- ✅ Added parameterized SQL queries
- ✅ Implemented XSS prevention
- ✅ Added CORS configuration
- ✅ Created audit logging
- ✅ Implemented request validation

**Phase 4: Testing & Documentation (Current)**
- ✅ Created unit tests for validation
- ✅ Created integration tests for API
- ✅ Added JSDoc comments throughout code
- ✅ Generated API documentation

#### 7.2 Key Decisions & Changes

**Decision 1: Front-end Framework**
- **Choice**: Vanilla JavaScript (no framework)
- **Reason**: Lightweight, fast loading, better accessibility
- **Change**: Initially used emojis, switched to custom SVG icons for dark mode toggle

**Decision 2: Database**
- **Choice**: SQLite
- **Reason**: Lightweight, requires no server, good for small-to-medium apps
- **Trade-off**: Can scale to PostgreSQL if needed

**Decision 3: Validation Location**
- **Choice**: Server-side validation (client optional)
- **Reason**: Server-side cannot be bypassed; client-side for UX

**Decision 4: Color Scheme**
- **Initial**: Orange (#FF9900)
- **Change**: Tomato Red (#FF6347) for light mode
- **Reason**: Better contrast and visual accessibility

---

### 8. Legal & Regulatory Compliance

#### 8.1 GDPR Compliance

**Data Collection**:
- ✅ Users provide explicit consent (form submission)
- ✅ Only necessary data collected (name, email, interest)
- ✅ No tracking cookies or third-party analytics
- ✅ Data stored securely with constraints

**User Rights**:
- Right to Access: Can retrieve contact records via ID
- Right to Erasure: Record status field supports deletion marking
- Data Retention: Recommend 90-day retention policy

**Implementation**:
```javascript
// Database constraints prevent invalid data
CONSTRAINT email_format CHECK(email LIKE '%@%.%')
CONSTRAINT valid_audience CHECK(audience IN ('Student', 'Parent', ...))
```

#### 8.2 Accessibility Compliance (WCAG 2.1)

**Level AA Compliance**:
- ✅ Color contrast ratio 4.5:1 for text
- ✅ Keyboard navigation support
- ✅ Semantic HTML structure
- ✅ ARIA labels for dynamic content
- ✅ Alt text for images/icons
- ✅ Text resizing support (not more than 1.2x)
- ✅ Focus indicators for interactive elements

**Accessibility Features**:
- Dark mode for low-light environments
- Large text mode for dyslexia/visual impairment
- High contrast color scheme
- Clear form labels and error messages

#### 8.3 Data Protection

**Encryption**:
- ✅ Ready for HTTPS (Helmet headers configured)
- ✅ No sensitive data stored unencrypted
- ✅ IP addresses logged for security audit trail

**Data Minimization**:
- Only collect essential information
- No passwords or sensitive identification
- Temporary storage of form data

---

### 9. Code Maintainability

#### 9.1 Code Organization

```
backend/
├── server.js              # Main application entry
├── package.json          # Dependencies
├── db/
│   └── database.js       # Database initialization
├── middleware/
│   └── validation.js     # Input validation
├── routes/
│   ├── contact.js        # Contact endpoint
│   ├── register.js       # Registration endpoint
│   └── health.js         # Health check
└── tests/
    ├── validation.test.js # Unit tests
    └── api.test.js       # Integration tests
```

#### 9.2 Code Standards

**JSDoc Documentation**:
```javascript
/**
 * Function description
 * @param {type} paramName - Parameter description
 * @returns {type} - Return description
 */
```

**Function Naming**:
- Validation functions: `validate*` prefix
- Database functions: `*Async` suffix
- Route handlers: descriptive names

**Error Handling**:
- Try-catch blocks for async operations
- Descriptive error messages
- Error logging for debugging

#### 9.3 Dependencies & Version Management

**Core Dependencies**:
- express@4.18.2 - Web framework
- sqlite3@5.1.6 - Database
- validator@13.9.0 - Input validation
- helmet@7.0.0 - Security headers
- cors@2.8.5 - Cross-origin handling
- express-rate-limit@6.7.0 - Rate limiting

All packages pinned to specific versions for reproducibility.

---

### 10. Deployment & Running

#### 10.1 Development Setup

```bash
# Install dependencies
cd backend
npm install

# Create .env file
cp .env.example .env

# Run development server with auto-reload
npm run dev

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

#### 10.2 Production Deployment

```bash
# Install only production dependencies
npm install --production

# Start server
npm start

# Set environment variables
export NODE_ENV=production
export PORT=3000
```

#### 10.3 Environment Configuration

| Variable | Development | Production |
|----------|-------------|-----------|
| NODE_ENV | development | production |
| PORT | 3000 | 3000+ |
| ALLOWED_ORIGINS | localhost | your-domain.com |

---

### 11. Future Enhancements

1. **Email Notifications**: Send confirmation emails to users
2. **Admin Dashboard**: Manage submissions and registrations
3. **Payment Integration**: For premium T Levels programs
4. **User Authentication**: Login for registered users
5. **Database Scaling**: Migrate to PostgreSQL for production
6. **API Authentication**: JWT tokens for secure access
7. **Analytics**: Track user engagement (GDPR-compliant)
8. **Mobile App**: Native iOS/Android version

---

### 12. Support & Troubleshooting

**Common Issues**:

1. **Database Lock**: Restart server
2. **Port Already in Use**: Change PORT in .env
3. **CORS Errors**: Update ALLOWED_ORIGINS in .env
4. **Rate Limit Exceeded**: Wait 15 minutes or use different IP

**Logs**:
- Application logs: Console output
- Audit trail: `audit_logs` table
- Error logs: Check `NODE_ENV=production` setting

---

### 13. Contact & Support

For technical support or questions about this implementation, refer to:
- API Documentation (above)
- Code comments (JSDoc)
- Test files (usage examples)

---

**Last Updated**: 2026-06-17
**Version**: 1.0.0
**Status**: Production Ready
