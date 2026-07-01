# Cline Prompt: Generate Complete Design Documentation

Copy and paste this entire prompt into Cline to generate the complete set of design documents for the Amazon T Levels Hub project.

---

## PROMPT START

I need you to create a comprehensive set of design documents for an existing web application project. The project is located at:

**Project Root:** `c:\Users\far24238616\OneDrive - University College Birmingham\amazon(chatbot)\AMAZONIAN\AMAZONIAN\AMAZON`

### Project Context

This is a full-stack web application called "Amazon T Levels Hub" - a digital platform providing information about T Levels (UK technical qualifications) with Amazon industry placement opportunities.

**Technology Stack:**
- **Frontend:** HTML5, CSS3, JavaScript (ES6+), PWA features
- **Backend:** Node.js, Express.js
- **Database:** SQLite3
- **APIs:** RESTful API + Google Gemini AI integration
- **Languages Used:** JavaScript (frontend & backend), SQL, HTML/CSS

**Current File Structure:**
```
backend/
  server.js              # Main Express server
  db/database.js         # SQLite database setup
  middleware/validation.js  # Input validation
  routes/
    auth.js              # Authentication routes
    contact.js           # Contact form API
    register.js          # Registration API
    colleges.js          # College search API
    health.js            # Health check endpoint
  services/email.js      # Email notifications
  tests/                 # Test files (to be created)

Frontend:
  index.html             # Login page
  Main.html              # Landing page
  students.html          # Student resources
  parents.html           # Parent guidance
  schools.html           # School partnerships
  advisors.html          # Advisor resources
  find-colleges.html     # College search
  reset-password.html    # Password reset
  404.html               # Error page
  translations.js        # i18n strings
  sw.js                  # Service worker
  manifest.json          # PWA manifest

documentation/
  DESIGN_DOCUMENT.md     # Existing design doc (needs updating)
```

### What I Need You To Create

Create a **complete, production-ready design document set** saved to `documentation/DESIGN_DOCUMENTS_COMPLETE.md` that includes ALL of the following sections:

---

## REQUIRED SECTIONS

### 1. EXECUTIVE SUMMARY (for non-technical stakeholders)
- Project overview and objectives
- Key features and benefits
- Target audiences (Students, Parents, Schools, Advisors)
- High-level timeline and scope
- Business value proposition

### 2. VISUAL / INTERFACE DESIGNS

#### 2.1 Page Inventory
Document all 7 content pages + authentication pages with:
- Page name and file
- Target audience
- Primary purpose
- Key features

#### 2.2 ASCII Wireframes
Create detailed ASCII wireframes for:
- Global layout structure (navbar, content, footer, chat widget)
- Each of the 7 main pages
- Authentication pages (login, reset password)
- Modals (contact form, settings, chatbot)
- Mobile responsive layouts

#### 2.3 Design System
- **Color Palette:** Primary dark (#1E2B3C), Accent orange (#FF9900), Accent teal (#2E9E8E), backgrounds, text colors, semantic colors (error, success)
- **Typography:** Font families, sizes for H1-H6, body text, line heights
- **Spacing System:** Consistent padding/margin scale
- **Component Library:** Navbar, hero sections, cards, buttons, forms, tables, accordions, modals, chat widget

#### 2.4 Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768-1024px
- Desktop: > 1024px
- Layout changes at each breakpoint

#### 2.5 Accessibility Features
- Dark mode implementation
- High contrast mode
- Text size adjustment (small/medium/large)
- Reduced motion option
- Multi-language support (EN, FR, ZH, DE)
- WCAG 2.1 AA compliance notes

---

### 3. DATA REQUIREMENTS

#### 3.1 Database Schema (SQLite)
Document ALL 7 tables with complete CREATE TABLE statements:

1. **contacts** - Contact form submissions
   - Fields: id, name, email, subject, message, created_at, status, ip_address
   - Constraints: email format, length limits
   - Indexes: email, status

2. **registrations** - User registrations
   - Fields: id, full_name, email, audience, interest, created_at, status, ip_address
   - Constraints: email format, valid audience enum
   - Indexes: email, audience

3. **users** - Authentication
   - Fields: id, email, password_hash, full_name, account_type, enable_2fa, created_at, updated_at
   - Constraints: email format, valid account_type enum

4. **two_fa_codes** - 2FA verification
   - Fields: id, user_id, code, expires_at, created_at
   - Foreign key to users

5. **tokens** - JWT session management
   - Fields: id, user_id, token_hash, expires_at, created_at
   - Foreign key to users

6. **audit_logs** - Security audit trail
   - Fields: id, action, details, ip_address, created_at
   - Indexes: action, created_at

7. **password_resets** - Password reset tokens
   - Fields: id, user_id, token, expires_at, used, created_at
   - Foreign key to users

For each table, document:
- Field name, type, max length, required status
- Validation rules
- Business purpose

#### 3.2 API Data Structures
Document all API endpoints with request/response examples:

1. **POST /api/contact** - Contact form submission
2. **POST /api/register** - Registration form
3. **GET /api/colleges** - College search (with query params)
4. **POST /api/chat** - Chatbot message
5. **POST /api/auth** - Authentication
6. **GET /api/health** - Health check

For each endpoint show:
- HTTP method and path
- Request body/params with JSON examples
- Success response (200/201) with JSON example
- Error responses (400, 401, 403, 404, 429, 500, 503) with JSON examples
- Validation rules
- Authentication requirements

#### 3.3 Data Flow Diagrams
Create ASCII diagrams showing data flow for:
- Contact form submission (user → browser → server → database → email)
- College search (user input → API → filtering → results → display)
- Authentication flow (login → validation → 2FA → JWT → session)
- Chatbot interaction (message → API → Gemini → response)

#### 3.4 Security Data Requirements
Document:
- Password hashing (bcrypt, salt rounds: 10+)
- JWT token management (HS256, 24h expiry, SHA-256 hash storage)
- 2FA implementation (6-digit codes, 5-min expiry)
- Input sanitization (validator.escape, HTML detection)
- SQL injection prevention (parameterized queries)
- Rate limiting (100 req/15min, 20 auth req/15min)
- CORS configuration
- Payload limits (10KB)
- Audit logging requirements

---

### 4. ALGORITHM DESIGNS (MAXIMUM 5 COMPLEX PROBLEMS)

Select and document the 5 most complex algorithms from the existing codebase. For each algorithm provide:

#### 4.1 College Search Algorithm
**Purpose:** Filter and rank T Level colleges based on location and subject preferences

Include:
- Input parameters (location, subject)
- Step-by-step pseudocode
- Relevance scoring formula (Amazon partner +40, Ofsted rating 5-30, satisfaction 0-15, placement hours 0-15)
- Filtering logic (location: town/postcode/region/name; subject: partial match in subjects array)
- Sorting logic (relevance score → satisfaction → placement hours)
- Time/Space complexity analysis
- Edge cases (no filters, no matches, case insensitivity)

#### 4.2 Contact Form Processing Algorithm
**Purpose:** Handle contact submissions with spam detection, validation, storage, and notifications

Include:
- Spam detection (honeypot check)
- Input validation (email format, length limits, HTML detection)
- Sanitization process
- Database insertion with audit logging
- Asynchronous email notifications
- Error handling and response format
- Security considerations

#### 4.3 Authentication Algorithm
**Purpose:** User login with password verification, 2FA support, and JWT token generation

Include:
- Input validation
- User lookup by email
- bcrypt password comparison (constant-time)
- 2FA code generation and storage
- JWT token creation and database storage
- Token verification logic
- Session management
- Audit logging

#### 4.4 Chatbot Algorithm (Gemini AI Integration)
**Purpose:** Process user messages through Google Gemini AI for conversational responses

Include:
- Input validation (history array)
- History transformation (bot → model role mapping)
- Gemini API call structure
- System instruction configuration
- Error handling (API failures, missing responses)
- Response extraction and fallback
- Token limits and temperature settings

#### 4.5 Registration Processing Algorithm
**Purpose:** Handle user registration with audience validation and notifications

Include:
- Field validation (name, email, audience enum, optional interest)
- Sanitization
- Database insertion
- Audit logging
- Asynchronous email notifications
- Success/error response format

**For each algorithm, also provide:**
- Clear pseudocode with comments
- Complexity analysis (time/space)
- Edge cases and error handling
- Security considerations

---

### 5. TEST STRATEGY

#### 5.1 Testing Overview
Create a table showing:
- Test level (Unit, Integration, Security, Accessibility, E2E)
- Focus area
- Tools used
- Target coverage percentages

#### 5.2 Testing Order
Document the **exact order** in which tests should be executed:
1. Unit tests (validation functions)
2. Integration tests (API endpoints)
3. Security tests (XSS, SQLi, rate limiting, CORS)
4. Accessibility tests (WCAG 2.1 AA)
5. Performance tests
6. End-to-end tests

#### 5.3 Unit Tests
Provide detailed test cases for:
- Email validation (valid/invalid cases)
- Text validation (length, HTML detection)
- HTML tag detection
- Sanitization functions
- Contact form validation
- Registration form validation

Use Jest test syntax with clear test descriptions.

#### 5.4 Integration Tests
Provide test cases for:
- Health check endpoint
- Contact API (valid data, missing data, XSS attempts)
- Registration API (valid data, invalid audience, XSS attempts)
- College search API (no filters, location filter, subject filter, no matches)
- Authentication API (if applicable)

Use Supertest syntax with assertions.

#### 5.5 Security Testing
Document test cases for:
- XSS prevention (script injection, image tags, iframes, event handlers, encoded XSS)
- SQL injection prevention (various injection techniques)
- Rate limiting (normal usage, threshold, above limit, reset)
- CORS configuration (allowed/disallowed origins)
- Input validation edge cases

#### 5.6 Accessibility Testing
Document WCAG 2.1 AA tests:
- Automated checks (contrast, alt text, resize text, keyboard navigation)
- Manual checks (focus order, focus visibility, error identification)
- Feature tests (dark mode, high contrast, text size, reduced motion, language switching, persistence)

#### 5.7 Performance Testing
Define targets:
- API response time < 200ms (p95)
- Static page load < 2s (first paint)
- Concurrent users: 50 simultaneous
- Database queries < 50ms
- College search < 100ms

#### 5.8 Error Handling Tests
Document expected behavior for:
- Database connection lost
- Invalid JSON body
- Missing API key
- Rate limit exceeded
- Unknown endpoints
- Static file not found
- Server internal errors

#### 5.9 Browser Compatibility
Specify minimum versions:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- IE: Not supported

#### 5.10 Test Execution
Provide npm scripts:
```bash
npm test                    # Run all tests
npm test -- --coverage      # With coverage report
npm test validation.test.js # Specific file
npm run test:watch          # Watch mode
```

Coverage thresholds:
- Lines: 80%
- Branches: 75%
- Functions: 80%
- Statements: 80%

#### 5.11 Test Data Requirements
Specify test datasets:
- Colleges: 35 records
- Contacts: 50+ records
- Registrations: 50+ records
- Users: 10+ records
- Audit logs: 100+ records

---

### 6. TECHNICAL ARCHITECTURE

#### 6.1 System Architecture
- Frontend/backend separation
- Static file serving
- API routing structure
- Middleware stack (security, CORS, rate limiting, body parsing, logging)

#### 6.2 Directory Structure
Document the complete project structure with file purposes.

#### 6.3 Environment Variables
List all required environment variables:
- PORT (default 3000)
- GEMINI_API_KEY (required for chatbot)
- ALLOWED_ORIGINS (CORS)
- EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS (SMTP)
- JWT_SECRET (token signing)
- NODE_ENV (development/production)

#### 6.4 Dependencies
List key npm packages and their purposes:
- express, sqlite3, cors, helmet, rate-limit
- validator, bcrypt, jsonwebtoken
- dotenv, cookie-parser, express-session

---

### 7. IMPLEMENTATION ROADMAP

#### 7.1 Development Phases
Break down implementation into phases:
- Phase 1: Core infrastructure (database, server, validation)
- Phase 2: API endpoints (contact, registration, colleges)
- Phase 3: Frontend pages (HTML/CSS/JS)
- Phase 4: Advanced features (auth, chatbot, accessibility)
- Phase 5: Testing and refinement

#### 7.2 Key Decision Points
Highlight areas where client input is needed:
- Email service provider choice
- Production hosting environment
- Gemini AI API key procurement
- College data sourcing (mock vs. real API)
- Monitoring and analytics tools

---

## FORMATTING REQUIREMENTS

1. **Use Markdown** with clear heading hierarchy (H1-H4)
2. **Include code blocks** with syntax highlighting for:
   - SQL (sql)
   - JavaScript (javascript)
   - JSON (json)
   - Pseudocode (no highlighting or plain text)
3. **Use tables** for specifications, test cases, and comparisons
4. **Include ASCII diagrams** for wireframes and data flow
5. **Use callout boxes** for important notes:
   - ⚠️ WARNING: Security considerations
   - ℹ️ INFO: Implementation notes
   - ✅ REQUIRED: Mandatory features
6. **Add page references** linking to existing files where applicable

---

## QUALITY STANDARDS

Your documentation must:
- Be comprehensive enough for a third-party developer to implement the entire solution
- Communicate clearly to both technical and non-technical stakeholders
- Provide sufficient detail for informed decision-making
- Include all 5 algorithm designs with complete pseudocode
- Specify test order and types for all components
- Reference actual file paths from the existing project
- Maintain consistency with the existing codebase style

---

## OUTPUT FILE

Save the complete document to:
**`documentation/DESIGN_DOCUMENTS_COMPLETE.md`**

The file should be production-ready and require no additional editing before being shared with stakeholders or developers.

---

## PROMPT END

---

## Additional Instructions for Cline

When you run this prompt in Cline:

1. **First**, read the existing files to understand the current implementation:
   - `documentation/DESIGN_DOCUMENT.md` (for reference)
   - `backend/server.js`
   - `backend/db/database.js`
   - `backend/middleware/validation.js`
   - `backend/routes/colleges.js`
   - `find-colleges.html` (for frontend structure)

2. **Then**, create the new comprehensive document at `documentation/DESIGN_DOCUMENTS_COMPLETE.md`

3. **Ensure** all 7 required sections are present and complete

4. **Verify** the 5 algorithm designs are the most complex ones from the codebase

5. **Check** that test strategy includes clear ordering and specific test types

6. **Confirm** the document is suitable for both technical and non-technical readers

---

**Tip:** If Cline runs out of context window, break this into multiple prompts:
- Prompt 1: Executive Summary + Visual Designs
- Prompt 2: Data Requirements
- Prompt 3: Algorithm Designs
- Prompt 4: Test Strategy
- Prompt 5: Technical Architecture + Roadmap

Then combine all sections into the final document.