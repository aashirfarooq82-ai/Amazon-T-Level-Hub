# Claude Prompt: Generate Complete Design Documentation

Copy and paste this entire prompt into Claude to generate the complete set of design documents for the Amazon T Levels Hub project.

---

## PROMPT START

I need you to create comprehensive design documents for an existing web application project. The project is located at:

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
  DESIGN_DOCUMENT.md     # Existing design doc (reference)
```

### What I Need You To Create

Create a **complete, production-ready design document set** saved to `documentation/DESIGN_DOCUMENTS.md` that includes ALL of the following sections:

---

## REQUIRED SECTIONS

### 1. VISUAL/INTERFACE DESIGNS

**Page Inventory (7 pages):**
- Main.html (landing), students.html, parents.html, schools.html, advisors.html, find-colleges.html, index.html (login)

**For each page document:**
- Target audience
- Key sections (hero, content cards, FAQ, CTA)
- Interactive elements (chatbot, forms, modals)

**Design System:**
- Colors: Primary dark (#1E2B3C), Orange (#FF9900), Teal (#2E9E8E), Light bg (#F2F4F7)
- Typography: Segoe UI, H1=46px, H2=26px, body=16px
- Components: Navbar (sticky, 70px), cards (dark bg, hover effects), modals, chat widget

**Responsive Breakpoints:**
- Mobile: < 768px (single column)
- Tablet: 768-1024px (2-column grid)
- Desktop: > 1024px (3-column grid)

**Accessibility:**
- Dark mode, high contrast (black+yellow), text size adjustment, reduced motion, multi-language (EN/FR/ZH/DE)

---

### 2. DATA REQUIREMENTS

**Database Tables (SQLite):**

```sql
-- 1. contacts (contact form submissions)
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'pending',
  ip_address TEXT
);

-- 2. registrations (user sign-ups)
CREATE TABLE registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  audience TEXT NOT NULL, -- 'Student','Parent','Teacher','School Representative'
  interest TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'pending',
  ip_address TEXT
);

-- 3. users (authentication)
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  account_type TEXT NOT NULL,
  enable_2fa BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. two_fa_codes
CREATE TABLE two_fa_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  code TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 5. tokens (JWT sessions)
CREATE TABLE tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 6. audit_logs
CREATE TABLE audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. password_resets
CREATE TABLE password_resets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  used INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**API Endpoints:**

1. **POST /api/contact** - Contact form
   - Request: `{email, subject, message}`
   - Success: 201 `{success: true, id: 42, message: "..."}`
   - Error: 400 `{success: false, errors: {...}}`

2. **POST /api/register** - Registration
   - Request: `{full_name, email, audience, interest?}`
   - Success: 201 `{success: true, id: 15, message: "..."}`

3. **GET /api/colleges?location=X&subject=Y** - Search
   - Success: 200 `{success: true, count: 4, data: [...]}`
   - Returns array of college objects with name, town, subjects, ratings

4. **POST /api/chat** - Chatbot
   - Request: `{history: [{role: "user"/"bot", text: "..."}]}`
   - Success: 200 `{reply: "..."}`

5. **POST /api/auth** - Login
   - Request: `{email, password}`
   - Success: 200 `{success: true, token: "jwt...", user: {...}}`

6. **GET /api/health** - Health check
   - Success: 200 `{success: true, status: "ok", uptime: 123}`

**Security:**
- Passwords: bcrypt hash (10+ rounds)
- JWT: HS256, 24h expiry, SHA-256 hash in DB
- 2FA: 6-digit codes, 5-min expiry
- Input: sanitize with validator.escape(), reject HTML tags
- SQL: parameterized queries only
- Rate limit: 100 req/15min (20 for auth)
- CORS: whitelist origins
- Payload: 10KB max

---

### 3. ALGORITHM DESIGNS (5 algorithms)

#### 3.1 College Search Algorithm

**Purpose:** Filter and rank colleges by location/subject

**Pseudocode:**
```
ALGORITHM searchColleges(location, subject)
  results = ALL_COLLEGES (35 records)
  
  // Filter by location
  IF location EXISTS THEN
    loc = location.toLowerCase()
    results = FILTER results WHERE:
      town.includes(loc) OR postcode.includes(loc) 
      OR region.includes(loc) OR name.includes(loc)
  END IF
  
  // Filter by subject
  IF subject EXISTS AND subject != "all" THEN
    sub = subject.toLowerCase()
    results = FILTER results WHERE:
      subjects.array.some(s => s.toLowerCase().includes(sub))
  END IF
  
  // Sort by relevance
  SORT results BY:
    1. calculateScore(college) DESC
    2. studentSatisfaction DESC
    3. placementHours DESC
  
  RETURN {success: true, count: results.length, data: results}
END ALGORITHM

FUNCTION calculateScore(college)
  score = 0
  IF college.amazonPartner THEN score += 40
  SWITCH college.ofsted:
    "Outstanding": score += 30
    "Good": score += 20
    "Requires Improvement": score += 5
  score += (college.studentSatisfaction / 100) * 15
  score += ((college.placementHours - 315) / 35) * 15
  RETURN score
END FUNCTION
```

**Complexity:** O(n log n) time, O(n) space (n=35 colleges)

---

#### 3.2 Contact Form Processing

**Purpose:** Handle contact submissions with spam detection

**Pseudocode:**
```
ALGORITHM processContact(formData, clientIp)
  // 1. Spam check (honeypot)
  IF formData._honeypot != "" THEN
    LOG "Spam from " + clientIp
    RETURN fakeSuccess() // Don't reveal detection
  END IF
  
  // 2. Validate
  errors = {}
  IF !isValidEmail(formData.email) THEN errors.email = "Valid email required"
  IF formData.subject.length < 1 OR > 100 THEN errors.subject = "1-100 chars"
  IF formData.message.length < 1 OR > 2000 THEN errors.message = "1-2000 chars"
  IF errors NOT empty THEN RETURN {success: false, errors}
  
  // 3. Sanitize
  sanitized = {
    email: escape(formData.email),
    subject: escape(formData.subject),
    message: escape(formData.message)
  }
  
  // 4. Database
  INSERT INTO contacts (email, subject, message, ip_address)
  VALUES (sanitized.email, sanitized.subject, sanitized.message, clientIp)
  
  // 5. Audit log
  INSERT INTO audit_logs (action, details, ip_address)
  VALUES ('contact_submission', 'Contact ID: ' + lastId, clientIp)
  
  // 6. Send emails (async)
  ASYNC sendUserAcknowledgement(sanitized.email)
  ASYNC sendAdminNotification(...)
  
  RETURN {success: true, id: lastId, message: "Thank you..."}
END ALGORITHM
```

---

#### 3.3 Authentication Algorithm

**Purpose:** Login with password verification, 2FA, and JWT tokens

**Pseudocode:**
```
ALGORITHM authenticateUser(email, password, clientIp)
  // 1. Validate input
  IF !isValidEmail(email) THEN RETURN {errors: {email: "Valid email required"}}
  
  // 2. Lookup user
  user = SELECT * FROM users WHERE email = ?
  IF user NOT found THEN RETURN {errors: {email: "Invalid credentials"}}
  
  // 3. Verify password
  IF !bcrypt.compare(password, user.password_hash) THEN
    RETURN {errors: {password: "Invalid credentials"}}
  END IF
  
  // 4. Audit log
  INSERT INTO audit_logs ('user_login', 'User ID: ' + user.id, clientIp)
  
  // 5. Check 2FA
  IF user.enable_2fa THEN
    code = random6Digits()
    INSERT INTO two_fa_codes (user_id, code, expires_at)
    VALUES (user.id, code, NOW() + 5min)
    sendEmail(user.email, "Your 2FA code: " + code)
    RETURN {success: true, requires2fa: true}
  END IF
  
  // 6. Generate JWT
  token = jwt.sign({
    userId: user.id,
    email: user.email,
    accountType: user.account_type,
    exp: NOW() + 24h
  }, JWT_SECRET)
  
  // 7. Store token hash
  INSERT INTO tokens (user_id, token_hash, expires_at)
  VALUES (user.id, SHA256(token), NOW() + 24h)
  
  RETURN {success: true, token, user: {...}}
END ALGORITHM
```

---

#### 3.4 Chatbot Algorithm (Gemini AI)

**Purpose:** Process messages through Google Gemini AI

**Pseudocode:**
```
ALGORITHM processChat(history)
  // 1. Validate
  IF !Array.isArray(history) OR history.length == 0 THEN
    RETURN {error: "Missing chat history"}
  END IF
  
  // 2. Transform to Gemini format
  contents = history.map(turn => {
    role = turn.role == "bot" ? "model" : "user"
    RETURN {role, parts: [{text: turn.text}]}
  })
  
  // 3. Call Gemini API
  response = POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
    HEADERS: { "x-goog-api-key": API_KEY }
    BODY: {
      system_instruction: "You are T Levels Assistant...",
      contents: contents,
      generationConfig: {temperature: 0.7, maxOutputTokens: 300}
    }
  
  // 4. Handle errors
  IF response.status != 200 THEN
    LOG "Gemini error: " + response.status
    RETURN {error: "Chatbot unavailable"}
  END IF
  
  // 5. Extract reply
  data = PARSE_JSON(response.body)
  reply = data.candidates[0].content.parts.map(p => p.text).join('')
  
  IF reply IS empty THEN
    reply = "Sorry, I couldn't respond. Please try rephrasing."
  END IF
  
  RETURN {reply}
END ALGORITHM
```

---

#### 3.5 Registration Processing

**Purpose:** Handle user registration with validation

**Pseudocode:**
```
ALGORITHM processRegistration(formData, clientIp)
  // 1. Validate
  errors = {}
  validAudiences = ["Student", "Parent", "Teacher", "School Representative"]
  
  IF formData.full_name IS null OR > 100 chars THEN
    errors.full_name = "1-100 characters required"
  IF !isValidEmail(formData.email) THEN
    errors.email = "Valid email required"
  IF formData.audience NOT IN validAudiences THEN
    errors.audience = "Valid selection required"
  IF formData.interest EXISTS AND > 2000 chars THEN
    errors.interest = "Max 2000 characters"
  
  IF errors NOT empty THEN RETURN {success: false, errors}
  
  // 2. Sanitize
  sanitized = {
    full_name: escape(formData.full_name),
    email: escape(formData.email),
    audience: escape(formData.audience),
    interest: formData.interest ? escape(formData.interest) : null
  }
  
  // 3. Database
  INSERT INTO registrations (full_name, email, audience, interest, ip_address)
  VALUES (sanitized.full_name, sanitized.email, sanitized.audience, sanitized.interest, clientIp)
  
  // 4. Audit
  INSERT INTO audit_logs ('registration_submission', 'ID: ' + lastId, clientIp)
  
  // 5. Emails (async)
  ASYNC sendAcknowledgement(sanitized.email, sanitized.full_name)
  ASYNC sendAdminNotification(...)
  
  RETURN {success: true, id: lastId, message: "Thank you " + sanitized.full_name + "..."}
END ALGORITHM
```

---

### 4. TEST STRATEGY

**Testing Order:**
1. Unit tests (validation functions)
2. Integration tests (API endpoints)
3. Security tests (XSS, SQLi, rate limiting)
4. Accessibility tests (WCAG 2.1 AA)
5. Performance tests
6. End-to-end tests

**Unit Tests (Jest):**
- Email validation: valid/invalid formats
- Text validation: length checks, HTML detection
- Sanitization: HTML escaping
- Contact form validation: complete/incomplete data
- Registration validation: audience enum checks

**Integration Tests (Supertest):**
- GET /api/health → 200
- POST /api/contact (valid) → 201
- POST /api/contact (missing fields) → 400
- POST /api/contact (XSS attempt) → 400
- POST /api/register (valid) → 201
- POST /api/register (invalid audience) → 400
- GET /api/colleges (no filters) → 200, returns 35
- GET /api/colleges?location=Birmingham → 200, filtered results
- GET /api/colleges?subject=Engineering → 200, filtered results

**Security Tests:**
- XSS: `<script>alert('xss')</script>` → rejected
- SQLi: `' OR 1=1 --` → treated as literal string
- Rate limit: 101st request in 15min → 429
- CORS: malicious.com → blocked

**Accessibility Tests:**
- Dark mode toggle → all pages switch
- High contrast → black+yellow scheme
- Text size → 14px/16px/18px
- Keyboard navigation → all functions accessible
- Contrast ratio → minimum 4.5:1

**Performance Targets:**
- API response: < 200ms (p95)
- Page load: < 2s first paint
- Database queries: < 50ms
- College search: < 100ms

**Test Commands:**
```bash
npm test                    # All tests
npm test -- --coverage      # With coverage
npm run test:watch          # Watch mode
```

**Coverage Targets:** Lines 80%, Branches 75%, Functions 80%

---

## FORMATTING

- Use Markdown with H1-H4 headings
- Code blocks with syntax highlighting (sql, javascript, json)
- Tables for specifications
- ASCII diagrams for data flow
- Keep it concise but complete

---

## PROMPT END

**Instructions:**
1. Read existing files: `documentation/DESIGN_DOCUMENT.md`, `backend/server.js`, `backend/db/database.js`, `backend/middleware/validation.js`, `backend/routes/colleges.js`
2. Create `documentation/DESIGN_DOCUMENTS.md` with all sections above
3. Ensure 5 algorithm designs are included with pseudocode
4. Verify test strategy shows order and types
5. Make it suitable for both technical and non-technical readers