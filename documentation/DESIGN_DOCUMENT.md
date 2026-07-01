# Amazon T Levels Hub — Design Documentation

> **Version:** 1.0  
> **Project:** Amazon T Levels Hub — Full-Stack Digital Solution  
> **Date:** June 2026

---

## Table of Contents

1. [Visual / Interface Designs](#1-visual--interface-designs)
2. [Data Requirements](#2-data-requirements)
3. [Algorithm Designs](#3-algorithm-designs)
4. [Test Strategy](#4-test-strategy)

---

## 1. Visual / Interface Designs

### 1.1 Page Inventory

The application consists of **6 content pages**, plus **authentication pages**, each serving a specific audience:

| Page | Audience | Primary Purpose |
|------|----------|-----------------|
| `index.html` | All | Login / 2FA authentication gateway |
| `Main.html` | All | Landing page with hero, features, CTA |
| `students.html` | Students | T Level info, career pathways, FAQ |
| `parents.html` | Parents | Parental guidance, financial support, FAQ |
| `schools.html` | Schools | Partnership info, implementation guide, FAQ |
| `advisors.html` | Advisors | Career advisor resources, student guidance, FAQ |
| `find-colleges.html` | All | College search with filtering and results |

### 1.2 Global Layout Structure

Every page follows the same structural template:

```
┌────────────────────────────────────────────────┐
│ NAVBAR (sticky, 70px height)                    │
│ ┌─────┐  ┌─────────────────────────┐ ┌──────┐ │
│ │Sign │  │  Amazon T Levels Logo   │ │Settings││
│ │ Out │  │                         │ │  ⚙️   ││
│ └─────┘  └─────────────────────────┘ └──────┘ │
│     Home  Students  Parents  Schools  Advisors  │
│     Find Colleges  Contact                      │
├────────────────────────────────────────────────┤
│                                                 │
│   PAGE HERO SECTION                             │
│   ┌───────────────────────────────────────┐     │
│   │  Icon + Title (H1)                    │     │
│   │  Subtitle / description paragraph     │     │
│   └───────────────────────────────────────┘     │
│                                                 │
│   CONTENT SECTION(S)                            │
│   ┌──────┐  ┌──────┐  ┌──────┐                 │
│   │Card 1│  │Card 2│  │Card 3│                 │
│   └──────┘  └──────┘  └──────┘                 │
│                                                 │
│   ACCENT BANNER / CTA SECTION                   │
│                                                 │
│   FAQ ACCORDION SECTION                         │
│                                                 │
│   FINAL CTA BANNER                              │
│                                                 │
├────────────────────────────────────────────────┤
│ FOOTER                                          │
│ © 2026 Amazon T Levels Hub                      │
└────────────────────────────────────────────────┘
│                                                 │
│ [CHAT FAB] floating bottom-right (fixed)        │
│ ┌──────────────────────┐                        │
│ │ Chat Window (hidden) │                        │
│ └──────────────────────┘                        │
└────────────────────────────────────────────────┘
```

### 1.3 Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Primary Dark | `#1E2B3C` | Navbar, hero backgrounds, cards |
| Accent Orange | `#FF9900` | Amazon brand accent, CTAs, highlights |
| Accent Teal | `#2E9E8E` | Secondary accent, success states |
| Light Background | `#F2F4F7` | Page background (light mode) |
| Dark Background | `#0F172A` | Page background (dark mode) |
| Text Primary | `#1E2B3C` | Body text (light mode) |
| Text Light | `#F8FAFC` | Body text (dark mode) |
| Text Muted | `#D2D7DF` / `#CBD5E1` | Secondary text |
| High Contrast | `#000000` + `#FFFF00` | Accessibility mode |
| Border | `#334155` | Card/input borders (dark mode) |
| Error | `#e74c3c` | Validation errors |

### 1.4 Typography

```
Font Family: 'Segoe UI', Arial, sans-serif

Base Size:    16px (1rem)
Line Height:  1.6

Headings:
  H1 (hero):  46px desktop / 32px mobile — 800 weight
  H2:         26px — 800 weight
  H3:         18px — 700 weight
  Section Label: 11px uppercase, tracked 2px

Text Size Variants:
  Small:  14px base
  Medium: 16px base (default)
  Large:  18px base
```

### 1.5 Component Designs

#### 1.5.1 Navbar

```
┌──────────────────────────────────────────────────────┐
│ [Sign Out 🔒]  Amazon T Levels  [Home] [Students]    │
│                └─── orange ───┘  [Parents] [Schools]  │
│                                 [Advisors] [Find]    │
│                                 [Contact]  [⚙️]      │
└──────────────────────────────────────────────────────┘
```

- Sticky position at top
- Background: `#1E2B3C` (dark mode: `#162033`)
- Active page link highlighted with `#FF9900`
- Settings button opens accessibility modal
- Sign out button for session termination

#### 1.5.2 Hero Section

```
┌──────────────────────────────────────────────────────┐
│                                                       │
│   📍  Find T Level Colleges Near You                  │
│                                                       │
│   Search for schools and colleges offering T Levels   │
│   with Amazon placements in your area. Filter by      │
│   subject, location, and study mode.                  │
│                                                       │
└──────────────────────────────────────────────────────┘
```

- Top accent gradient line (orange → teal)
- Background: `#1E2B3C` with rounded corners (20px)
- Icon + H1 heading in white
- Description paragraph in muted gray

#### 1.5.3 Card Grid Layout

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  TAG         │  │  TAG         │  │  TAG         │
│              │  │              │  │              │
│  Card Title  │  │  Card Title  │  │  Card Title  │
│              │  │              │  │              │
│  Description │  │  Description │  │  Description │
│  text here…  │  │  text here…  │  │  text here…  │
└──────────────┘  └──────────────┘  └──────────────┘
```

- CSS Grid: `grid-template-columns: repeat(auto-fit, minmax(290px, 1fr))`
- Cards have `#1E2B3C` background, 16px border radius
- Hover: translateY(-4px) + shadow increase
- Entrance animation: fade-in + slide-up on scroll

#### 1.5.4 College Search Form

```
┌─────────────────────────────────────────────────────────┐
│  [Enter postcode or town...     ▼]  [All Subjects ▼]    │
│  └──────────────────────────────┘  └──────────────────┘  │
│                           [🔍 Search]                    │
└─────────────────────────────────────────────────────────┘
```

- Flex layout, wrapping on mobile
- Input and select fields with 12px padding, rounded 10px
- Orange search button with hover darkening

#### 1.5.5 College Result Card

```
┌───────────────────────────────────────────────┐
│  Birmingham Metropolitan College              │
│  Birmingham, B4 7PS · West Midlands           │
│  [Amazon Partner] [Digital & IT] [Engineering]│
│                                               │
│  One of the largest FE colleges in the region │
│  with strong industry connections…            │
│                                               │
│  📊 350 hrs placement  ⭐ Ofsted: Good        │
│  😊 Satisfaction: 87%                         │
│                                               │
│  [Visit website →]                            │
└───────────────────────────────────────────────┘
```

- 3px orange top border
- Badges for Amazon Partner and subjects
- Stats row showing placement hours, Ofsted, satisfaction

#### 1.5.6 FAQ Accordion

```
┌──────────────────────────────────────────────┐
│  How do I know if a college offers Amazon    │ ▼
│  placements?                                 │
├──────────────────────────────────────────────┤
│  (hidden) Answer text appears when open      │
└──────────────────────────────────────────────┘
```

- Click to toggle open/close
- Only one item open at a time
- Arrow rotates 180° when open
- Smooth transition

#### 1.5.7 Chatbot Widget

```

  ┌──────────────────────────┐
  │ 🤖 T Levels Assistant  ✕ │
  ├──────────────────────────┤
  │ ┌──────────────────────┐ │
  │ │ Hi! I'm the T Levels │ │
  │ │ Assistant. Ask me    │ │
  │ │ anything…            │ │
  │ └──────────────────────┘ │
  │        ┌────────────┐   │
  │        │ Your msg   │   │
  │        └────────────┘   │
  │ ┌──────────────────┐    │
  │ │ Ask a question…  │🚀 │
  │ └──────────────────┘    │
  └──────────────────────────┘
  
          [💬 FAB]
```

- Fixed position bottom-right
- Opens/closes with FAB button
- Messages scrollable
- Bot messages left-aligned (dark bubble)
- User messages right-aligned (orange bubble)

#### 1.5.8 Settings Modal

```
┌─────────────────────────────────────┐
│  ✕  Accessibility Settings          │
│     Customize your experience       │
│                                     │
│  Text Size                          │
│  [A] [A] [A]                        │
│                                     │
│  Display Mode                       │
│  [Normal] [Dark Mode] [High Contr.] │
│                                     │
│  Language                           │
│  [English ▼]                        │
│                                     │
│  Motion                             │
│  ☐ Reduce motion (disable anim.)    │
└─────────────────────────────────────┘
```

- Modal overlay with blur backdrop
- Settings persisted to localStorage
- Dark mode and high contrast override all page styles

#### 1.5.9 Contact Modal

```
┌─────────────────────────────────────┐
│  ✕  Get in Touch                    │
│     We typically respond within     │
│     one working day.                │
│                                     │
│  [Email address        ]            │
│                                     │
│  [What do you need help? ▼]         │
│                                     │
│  [Describe your enquiry…     ]      │
│  [                              ]   │
│                                     │
│  [📨 Send Message]                  │
└─────────────────────────────────────┘
```

### 1.6 Responsive Breakpoints

| Breakpoint | Target | Layout Changes |
|------------|--------|----------------|
| < 768px | Mobile | Single column, stacked nav, reduced padding |
| 768–1024px | Tablet | 2-column grid, condensed nav |
| > 1024px | Desktop | Full layout, 3-column grids |

### 1.7 Accessibility Features

All pages include:
- **Dark Mode** — Purple/turquoise color scheme
- **High Contrast Mode** — Black background + yellow text/accents
- **Text Size Adjustment** — Small (14px), Medium (16px default), Large (18px)
- **Reduced Motion** — Disables all animations/transitions
- **Language Selection** — English, French, Chinese, German
- All settings persist in `localStorage`

---

## 2. Data Requirements

### 2.1 Database Schema (SQLite)

#### 2.1.1 Contacts Table

```sql
CREATE TABLE contacts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    subject     TEXT NOT NULL,
    message     TEXT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    status      TEXT DEFAULT 'pending',
    ip_address  TEXT,
    
    CONSTRAINT email_format  CHECK(email LIKE '%@%.%')
);

-- Index for fast lookups
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_status ON contacts(status);
```

**Field Constraints:**

| Field | Type | Max Length | Required | Validation |
|-------|------|-----------|----------|------------|
| name | TEXT | 100 chars | Yes | No HTML tags, sanitized |
| email | TEXT | 254 chars | Yes | Valid email format (`validator.isEmail`) |
| subject | TEXT | 100 chars | Yes | No HTML tags, sanitized |
| message | TEXT | 2000 chars | Yes | No HTML tags, sanitized |
| status | TEXT | — | Yes | `pending` or `reviewed` |
| ip_address | TEXT | 45 chars | Audit | IPv4/IPv6 |

#### 2.1.2 Registrations Table

```sql
CREATE TABLE registrations (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name   TEXT NOT NULL,
    email       TEXT NOT NULL,
    audience    TEXT NOT NULL,
    interest    TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    status      TEXT DEFAULT 'pending',
    ip_address  TEXT,
    
    CONSTRAINT email_format    CHECK(email LIKE '%@%.%'),
    CONSTRAINT valid_audience  CHECK(audience IN (
        'Student', 'Parent', 'Teacher', 'School Representative'
    ))
);

CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_audience ON registrations(audience);
```

**Field Constraints:**

| Field | Type | Max Length | Required | Validation |
|-------|------|-----------|----------|------------|
| full_name | TEXT | 100 chars | Yes | No HTML tags, sanitized |
| email | TEXT | 254 chars | Yes | Valid email format |
| audience | TEXT | — | Yes | One of: Student, Parent, Teacher, School Representative |
| interest | TEXT | 2000 chars | No | No HTML tags, sanitized |
| status | TEXT | — | Yes | `pending` or `processed` |
| ip_address | TEXT | 45 chars | Audit | IPv4/IPv6 |

#### 2.1.3 Users Table (Authentication)

```sql
CREATE TABLE users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name     TEXT NOT NULL,
    account_type  TEXT NOT NULL,
    enable_2fa    BOOLEAN DEFAULT 0,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT email_format        CHECK(email LIKE '%@%.%'),
    CONSTRAINT valid_account_type  CHECK(account_type IN (
        'Student', 'Parent', 'Teacher', 'School Representative'
    ))
);
```

#### 2.1.4 Authentication Support Tables

```sql
-- JWT session tokens
CREATE TABLE tokens (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    token_hash  TEXT NOT NULL UNIQUE,
    expires_at  DATETIME NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 2FA verification codes
CREATE TABLE two_fa_codes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    code        TEXT NOT NULL,
    expires_at  DATETIME NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 2.1.5 Audit Logs Table

```sql
CREATE TABLE audit_logs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    action      TEXT NOT NULL,
    details     TEXT,
    ip_address  TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
```

**Audit Actions Tracked:**

| Action | Details Example | Trigger |
|--------|----------------|---------|
| `contact_submission` | "Contact ID: 42, Name: John Doe" | Contact form submit |
| `registration_submission` | "Registration ID: 15, Audience: Student" | Registration form submit |
| `user_login` | "User ID: 7" | Successful login |
| `user_logout` | "User ID: 7" | Logout |
| `2fa_verified` | "User ID: 7" | 2FA code verified |

### 2.2 API Data Structures

#### 2.2.1 Contact Form — Request

```json
POST /api/contact
{
    "email": "user@example.com",
    "subject": "T Levels Information",
    "message": "I would like to know more about T Levels.",
    "_honeypot": ""
}
```

#### 2.2.2 Contact Form — Response (Success)

```json
HTTP 201
{
    "success": true,
    "id": 42,
    "message": "Thank you for your enquiry. We will respond within 2 business days."
}
```

#### 2.2.3 Contact Form — Response (Validation Error)

```json
HTTP 400
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "email": "Valid email is required",
        "message": "Message must be between 1-2000 characters"
    }
}
```

#### 2.2.4 Registration — Request

```json
POST /api/register
{
    "full_name": "Jane Smith",
    "email": "jane@example.com",
    "audience": "Student",
    "interest": "Interested in Digital T Level"
}
```

#### 2.2.5 Registration — Response (Success)

```json
HTTP 201
{
    "success": true,
    "id": 15,
    "message": "Thank you for registering, Jane Smith! We have received your request."
}
```

#### 2.2.6 College Search — Request

```http
GET /api/colleges?location=Birmingham&subject=Digital%20%26%20IT
```

#### 2.2.7 College Search — Response

```json
HTTP 200
{
    "success": true,
    "count": 4,
    "data": [
        {
            "id": 1,
            "name": "Birmingham Metropolitan College",
            "town": "Birmingham",
            "postcode": "B4 7PS",
            "region": "West Midlands",
            "subjects": ["Digital & IT", "Business & Finance", "Engineering"],
            "amazonPartner": true,
            "placementHours": 350,
            "ofsted": "Good",
            "studentSatisfaction": 87,
            "website": "https://www.bmetc.ac.uk",
            "description": "One of the largest FE colleges..."
        }
    ]
}
```

#### 2.2.8 Chatbot — Request

```json
POST /api/chat
{
    "history": [
        {"role": "user", "text": "What are T Levels?"},
        {"role": "bot", "text": "T Levels are 2-year qualifications..."}
    ]
}
```

#### 2.2.9 Chatbot — Response

```json
HTTP 200
{
    "reply": "T Levels are 2-year qualifications for 16-19 year olds..."
}
```

### 2.3 Data Flow Diagrams

#### 2.3.1 Contact Form Data Flow

```
User                   Browser              Server                Database
 │                       │                     │                      │
 │── Submit form ───────>│                     │                      │
 │                       │── POST /api/contact ──>                    │
 │                       │                     │                      │
 │                       │                  ┌──▼──┐                   │
 │                       │                  │Honey│── spam? ──> 200 OK│
 │                       │                  │ pot │                  │
 │                       │                  └─────┘                   │
 │                       │                  ┌──▼──┐                   │
 │                       │                  │ Vali│── fail ──> 400    │
 │                       │                  │date │                  │
 │                       │                  └─────┘                   │
 │                       │                  ┌──▼──┐                   │
 │                       │                  │Sanit│── escape HTML     │
 │                       │                  │tize │                  │
 │                       │                  └─────┘                   │
 │                       │                  ┌──▼──┐                   │
 │                       │                  │ INS │── INSERT INTO ───>│
 │                       │                  │ ERT │   contacts        │
 │                       │                  └─────┘                   │
 │                       │                  ┌──▼──┐                   │
 │                       │                  │Audi│── INSERT INTO ───>│
 │                       │                  │ t   │   audit_logs      │
 │                       │                  └─────┘                   │
 │                       │                  ┌──▼──┐                   │
 │                       │                  │ Em │── (async)         │
 │                       │                  │ail │   sendToUser()    │
 │                       │                  │    │   sendToAdmin()   │
 │                       │                  └─────┘                   │
 │                       │<── 201 Created ────                        │
 │<── Show success ──────│                     │                      │
```

#### 2.3.2 College Search Data Flow

```
User                   Browser              Server
 │                       │                     │
 │── Enter location ────>│                     │
 │── Select subject ────>│                     │
 │── Click Search ──────>│                     │
 │                       │── GET /api/colleges ──>│
 │                       │   ?location=X          │
 │                       │   &subject=Y           │
 │                       │                     ┌──▼──┐
 │                       │                     │Pars│
 │                       │                     │e Q │
 │                       │                     │uer │
 │                       │                     │ y   │
 │                       │                     └─────┘
 │                       │                     ┌──▼──────┐
 │                       │                     │Fi lter  │
 │                       │                     │By Loca  │
 │                       │                     │ tion     │
 │                       │                     └─────────┘
 │                       │                     ┌──▼──────┐
 │                       │                     │Fi lter  │
 │                       │                     │By Subj  │
 │                       │                     │ ect      │
 │                       │                     └─────────┘
 │                       │                     ┌──▼──────┐
 │                       │                     │Sort By  │
 │                       │                     │Relevan  │
 │                       │                     │ ce      │
 │                       │                     └─────────┘
 │                       │<── JSON results ──────│
 │                       │                     │
 │── Render cards ──────>│                     │
 │── Show on page ──────>│                     │
```

### 2.4 Security Data Requirements

| Requirement | Implementation |
|-------------|---------------|
| Password Storage | bcrypt hash (salt rounds: 10+) |
| JWT Tokens | Signed with HS256 secret, 24h expiry |
| Token Storage | SHA-256 hash in database |
| 2FA Codes | Random 6-digit, 5-minute expiry |
| Input Sanitization | `validator.escape()` + HTML tag detection |
| SQL Injection | Parameterized queries (ALL queries) |
| Rate Limiting | 100 requests per 15 minutes per IP |
| Payload Limit | 10KB max per request body |
| CORS | Whitelist of allowed origins |
| Audit Trail | All write operations logged with IP |

---

## 3. Algorithm Designs

### 3.1 College Search Algorithm

**Purpose:** Filter and rank T Level colleges based on user's location and subject preferences.

**Input:**
- `location`: string (postcode, town, or region)
- `subject`: string (subject name, or "all")

**Output:** Sorted array of matching college objects

**Pseudocode:**

```
ALGORITHM: searchColleges(location, subject)
INPUT:    location (string or null), subject (string or "all" or null)
OUTPUT:   sorted array of college objects

BEGIN
    // Step 1: Start with full dataset
    results = COLLEGES_DATA (full array of 35 colleges)
    
    // Step 2: Filter by location (if provided)
    IF location IS NOT null AND location.trim() IS NOT empty THEN
        normalizedLocation = convertToLowercase(location.trim())
        
        results = FILTER results WHERE college MATCHES:
            CONTAINS(convertToLowercase(college.town), normalizedLocation)
            OR CONTAINS(convertToLowercase(college.postcode), normalizedLocation)
            OR CONTAINS(convertToLowercase(college.region), normalizedLocation)
            OR CONTAINS(convertToLowercase(college.name), normalizedLocation)
        END FILTER
    END IF
    
    // Step 3: Filter by subject (if provided and not "all")
    IF subject IS NOT null AND subject IS NOT "all" THEN
        normalizedSubject = convertToLowercase(subject.trim())
        
        results = FILTER results WHERE college MATCHES:
            EXISTS subject IN college.subjects WHERE:
                CONTAINS(convertToLowercase(subject), normalizedSubject)
        END FILTER
    END IF
    
    // Step 4: Sort results by relevance score
    results = SORT results BY:
        PRIMARY:   calculateRelevanceScore(college, location) DESCENDING
        SECONDARY: college.studentSatisfaction DESCENDING
        TERTIARY:  college.placementHours DESCENDING
    END SORT
    
    // Step 5: Return results with metadata
    RETURN {
        success: true,
        count: LENGTH(results),
        data: results
    }
END ALGORITHM


// --- Helper: Calculate Relevance Score ---
FUNCTION calculateRelevanceScore(college, searchLocation)
    score = 0
    
    // Factor 1: Amazon partner (+40 points)
    IF college.amazonPartner IS true THEN
        score = score + 40
    END IF
    
    // Factor 2: Ofsted rating weighted score
    SWITCH college.ofsted:
        CASE "Outstanding":           score = score + 30
        CASE "Good":                  score = score + 20
        CASE "Requires Improvement":  score = score + 5
        DEFAULT:                      score = score + 10
    END SWITCH
    
    // Factor 3: Student satisfaction (normalized to 0-15 points)
    score = score + (college.studentSatisfaction / 100) * 15
    
    // Factor 4: Placement hours (normalized to 0-15 points)
    // Min hours = 315, Max hours = 350, Range = 35
    normalizedHours = (college.placementHours - 315) / (350 - 315)
    score = score + normalizedHours * 15
    
    // Return final score (theoretical max = 100)
    RETURN ROUND(score, 1)
END FUNCTION
```

**Complexity Analysis:**

| Operation | Time Complexity | Space Complexity |
|-----------|----------------|-----------------|
| Location filter | O(n) | O(n) |
| Subject filter | O(n × m) where m = avg subjects per college | O(n) |
| Sort (merge sort) | O(n log n) | O(n) |
| **Overall** | **O(n log n)** | **O(n)** |

With n = 35 colleges (current dataset), this is effectively constant time.

### 3.2 Contact Form Processing Algorithm

**Purpose:** Handle contact form submissions with spam detection, validation, database storage, audit logging, and email notifications.

**Pseudocode:**

```
ALGORITHM: processContactForm(formData, clientIp)
INPUT:    formData = { email, subject, message, _honeypot }
          clientIp = request IP address string
OUTPUT:   response object { success, id, message, errors? }

BEGIN
    // Step 1: SPAM DETECTION — Honeypot check
    IF formData._honeypot IS NOT empty THEN
        LOG "Spam detected from IP: " + clientIp
        // Return fake success to avoid revealing detection
        RETURN {
            success: true,
            message: "Thank you for your enquiry. We will respond within 2 business days."
        }
    END IF
    
    // Step 2: INPUT VALIDATION
    errors = EMPTY OBJECT
    
    // Validate email format
    IF formData.email IS null 
       OR NOT isValidEmail(formData.email) THEN
        errors.email = "Valid email is required"
    END IF
    
    // Validate subject (1-100 chars, no HTML)
    IF formData.subject IS null
       OR formData.subject.length < 1
       OR formData.subject.length > 100
       OR containsHtmlTags(formData.subject) THEN
        errors.subject = "Subject must be between 1-100 characters"
    END IF
    
    // Validate message (1-2000 chars, no HTML)
    IF formData.message IS null
       OR formData.message.length < 1
       OR formData.message.length > 2000
       OR containsHtmlTags(formData.message) THEN
        errors.message = "Message must be between 1-2000 characters"
    END IF
    
    // If validation failed, return errors
    IF errors IS NOT empty THEN
        RETURN {
            success: false,
            message: "Validation failed",
            errors: errors
        }
    END IF
    
    // Step 3: SANITIZATION
    sanitizedName    = sanitizeText(formData.name)
    sanitizedEmail   = sanitizeText(formData.email)
    sanitizedSubject = sanitizeText(formData.subject)
    sanitizedMessage = sanitizeText(formData.message)
    
    // Step 4: DATABASE INSERTION
    result = EXECUTE SQL:
        INSERT INTO contacts (name, email, subject, message, ip_address, status)
        VALUES (sanitizedName, sanitizedEmail, sanitizedSubject, 
                sanitizedMessage, clientIp, 'pending')
    END EXECUTE
    
    // Step 5: AUDIT LOGGING
    EXECUTE SQL:
        INSERT INTO audit_logs (action, details, ip_address)
        VALUES ('contact_submission', 
                'Contact ID: ' + result.id + ', Name: ' + sanitizedName,
                clientIp)
    END EXECUTE
    
    // Step 6: EMAIL NOTIFICATIONS (asynchronous — non-blocking)
    ASYNC BEGIN
        // Send acknowledgement to the user
        CALL sendContactAcknowledgement(sanitizedEmail, sanitizedName, sanitizedSubject)
        
        // Send notification to admin team
        CALL sendContactNotificationToAdmin(sanitizedName, sanitizedEmail, 
                                            sanitizedSubject, sanitizedMessage, timestamp)
    ASYNC END
    
    // Step 7: RETURN SUCCESS RESPONSE
    RETURN {
        success: true,
        id: result.id,
        message: "Thank you for your enquiry. We will respond within 2 business days."
    }
END ALGORITHM


// --- Helper: Email Validation ---
FUNCTION isValidEmail(email)
    // Uses validator.isEmail() library
    // Checks: format, domain, length
    RETURN validator.isEmail(email)
END FUNCTION


// --- Helper: HTML Tag Detection ---
FUNCTION containsHtmlTags(text)
    // Regex pattern matches any HTML/XML tags
    pattern = /<[^>]*>/g
    RETURN pattern.test(text)
END FUNCTION


// --- Helper: Text Sanitization ---
FUNCTION sanitizeText(text)
    // Escape HTML entities (&, <, >, ", ')
    escapedText = validator.escape(text)
    
    // Trim whitespace
    RETURN escapedText.trim()
END FUNCTION
```

### 3.3 Registration Processing Algorithm

**Purpose:** Handle user registration for T Level interest, with audience validation and notification.

**Pseudocode:**

```
ALGORITHM: processRegistration(formData, clientIp)
INPUT:    formData = { full_name, email, audience, interest? }
          clientIp = request IP address string
OUTPUT:   response object { success, id, message, errors? }

BEGIN
    // Step 1: VALIDATION
    errors = EMPTY OBJECT
    validAudiences = ["Student", "Parent", "Teacher", "School Representative"]
    
    // Validate full name
    IF formData.full_name IS null
       OR formData.full_name.length < 1
       OR formData.full_name.length > 100
       OR containsHtmlTags(formData.full_name) THEN
        errors.full_name = "Full name must be between 1-100 characters"
    END IF
    
    // Validate email
    IF formData.email IS null OR NOT isValidEmail(formData.email) THEN
        errors.email = "Valid email is required"
    END IF
    
    // Validate audience selection
    IF formData.audience IS null 
       OR validAudiences DOES NOT CONTAIN formData.audience THEN
        errors.audience = "Valid audience selection is required"
    END IF
    
    // Validate interest (optional, max 2000 chars)
    IF formData.interest IS NOT null
       AND (formData.interest.length > 2000
            OR containsHtmlTags(formData.interest)) THEN
        errors.interest = "Interest must be under 2000 characters"
    END IF
    
    IF errors IS NOT empty THEN
        RETURN { success: false, message: "Validation failed", errors: errors }
    END IF
    
    // Step 2: SANITIZATION
    sanitizedName   = sanitizeText(formData.full_name)
    sanitizedEmail  = sanitizeText(formData.email)
    sanitizedAudience = sanitizeText(formData.audience)
    sanitizedInterest = IF formData.interest IS NOT null 
                          THEN sanitizeText(formData.interest) 
                          ELSE null
    
    // Step 3: DATABASE INSERTION
    result = EXECUTE SQL:
        INSERT INTO registrations (full_name, email, audience, interest, 
                                   ip_address, status)
        VALUES (sanitizedName, sanitizedEmail, sanitizedAudience, 
                sanitizedInterest, clientIp, 'pending')
    END EXECUTE
    
    // Step 4: AUDIT LOGGING
    EXECUTE SQL:
        INSERT INTO audit_logs (action, details, ip_address)
        VALUES ('registration_submission',
                'Registration ID: ' + result.id + ', Audience: ' + sanitizedAudience,
                clientIp)
    END EXECUTE
    
    // Step 5: EMAIL NOTIFICATIONS (asynchronous)
    ASYNC BEGIN
        CALL sendRegistrationAcknowledgement(sanitizedEmail, sanitizedName, 
                                              sanitizedAudience)
        CALL sendRegistrationNotificationToAdmin(sanitizedEmail, sanitizedName, 
                                                  sanitizedAudience, sanitizedInterest)
    ASYNC END
    
    // Step 6: RETURN SUCCESS
    RETURN {
        success: true,
        id: result.id,
        message: "Thank you for registering, " + sanitizedName 
                 + "! We have received your request. A team member will respond shortly."
    }
END ALGORITHM
```

### 3.4 Chatbot Algorithm (Gemini AI Integration)

**Purpose:** Process user messages through Google's Gemini AI to provide conversational responses about T Levels.

**Pseudocode:**

```
ALGORITHM: processChatMessage(history)
INPUT:    history = array of { role: string, text: string }
OUTPUT:   response object { reply: string }

BEGIN
    // Step 1: VALIDATE INPUT
    IF history IS NOT array OR history.length IS 0 THEN
        RETURN { error: "Missing chat history" }
        EXIT WITH STATUS 400
    END IF
    
    // Step 2: CHECK API KEY CONFIGURATION
    IF GEMINI_API_KEY IS not set THEN
        LOG "Warning: GEMINI_API_KEY not configured"
        RETURN { error: "Chatbot not configured" }
        EXIT WITH STATUS 503
    END IF
    
    // Step 3: TRANSFORM HISTORY TO GEMINI FORMAT
    contents = EMPTY ARRAY
    
    FOREACH turn IN history DO
        // Map 'bot' role to 'model' for Gemini API
        geminiRole = IF turn.role IS "bot" THEN "model" ELSE "user"
        
        APPEND TO contents: {
            role: geminiRole,
            parts: [{ text: turn.text }]
        }
    END FOREACH
    
    // Step 4: CALL GEMINI API
    systemInstruction = "You are the 'T Levels Assistant' chatbot..." 
                        + "(system prompt defining behavior)"
    
    geminiResponse = HTTP POST "https://generativelanguage.googleapis.com/v1beta/"
                               + "models/gemini-2.5-flash:generateContent"
        HEADERS:
            Content-Type: application/json
            x-goog-api-key: GEMINI_API_KEY
        BODY:
            system_instruction: { parts: [{ text: systemInstruction }] }
            contents: contents
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 300
            }
    END HTTP
    
    // Step 5: HANDLE API ERROR
    IF geminiResponse.status IS NOT 200 THEN
        errorText = geminiResponse.body
        LOG "Gemini API error: " + geminiResponse.status + " - " + errorText
        RETURN { error: "Gemini API request failed" }
        EXIT WITH STATUS 502
    END IF
    
    // Step 6: EXTRACT REPLY FROM RESPONSE
    responseData = PARSE_JSON(geminiResponse.body)
    
    reply = EXTRACT text FROM responseData.candidates[0].content.parts
            JOIN with empty string
    
    // Fallback if extraction fails
    IF reply IS null OR reply IS empty THEN
        reply = "Sorry, I couldn't come up with a response. Could you try rephrasing?"
    END IF
    
    // Step 7: RETURN REPLY
    RETURN { reply: reply }
END ALGORITHM
```

### 3.5 Authentication Algorithm (Login + Token)

**Pseudocode:**

```
ALGORITHM: authenticateUser(email, password)
INPUT:    email (string), password (string)
OUTPUT:   response { success, token?, requires2fa?, errors? }

BEGIN
    // Step 1: VALIDATE INPUT
    IF NOT isValidEmail(email) THEN
        RETURN { success: false, errors: { email: "Valid email required" } }
    END IF
    
    IF password IS null OR password.length < 8 THEN
        RETURN { success: false, errors: { password: "Password required (min 8 chars)" } }
    END IF
    
    // Step 2: LOOKUP USER
    user = EXECUTE SQL:
        SELECT * FROM users WHERE email = ? LIMIT 1
        WITH PARAMS: [email]
    END EXECUTE
    
    IF user IS null THEN
        RETURN { success: false, errors: { email: "Invalid credentials" } }
    END IF
    
    // Step 3: VERIFY PASSWORD (constant-time comparison)
    IF NOT bcrypt.compare(password, user.password_hash) THEN
        RETURN { success: false, errors: { password: "Invalid credentials" } }
    END IF
    
    // Step 4: LOGIN AUDIT LOG
    EXECUTE SQL:
        INSERT INTO audit_logs (action, details, ip_address)
        VALUES ('user_login', 'User ID: ' + user.id, clientIp)
    END EXECUTE
    
    // Step 5: CHECK 2FA REQUIREMENT
    IF user.enable_2fa IS true THEN
        // Generate 2FA code
        twoFACode = GENERATE random 6-digit number
        
        EXECUTE SQL:
            INSERT INTO two_fa_codes (user_id, code, expires_at)
            VALUES (user.id, twoFACode, NOW() + 5 MINUTES)
        END EXECUTE
        
        // Send code via email (or authenticator app)
        CALL send2FACodeToUser(user.email, twoFACode)
        
        RETURN {
            success: true,
            requires2fa: true,
            message: "2FA code sent to your email"
        }
    END IF
    
    // Step 6: GENERATE JWT TOKEN
    tokenPayload = {
        userId: user.id,
        email: user.email,
        accountType: user.account_type,
        iat: NOW(),
        exp: NOW() + 24 HOURS
    }
    
    token = jwt.sign(tokenPayload, JWT_SECRET)
    
    // Step 7: STORE TOKEN HASH IN DATABASE
    tokenHash = SHA256(token)
    
    EXECUTE SQL:
        INSERT INTO tokens (user_id, token_hash, expires_at)
        VALUES (user.id, tokenHash, NOW() + 24 HOURS)
    END EXECUTE
    
    // Step 8: RETURN SUCCESS
    RETURN {
        success: true,
        token: token,
        user: {
            id: user.id,
            name: user.full_name,
            email: user.email,
            accountType: user.account_type
        }
    }
END ALGORITHM


// --- Helper: Verify JWT Token ---
FUNCTION verifyToken(token)
    TRY
        decoded = jwt.verify(token, JWT_SECRET)
        
        // Check token exists in database (not revoked)
        storedToken = EXECUTE SQL:
            SELECT * FROM tokens 
            WHERE token_hash = SHA256(token) 
              AND expires_at > NOW()
            LIMIT 1
        END EXECUTE
        
        IF storedToken IS null THEN
            RETURN null  // Token revoked or expired
        END IF
        
        RETURN decoded
    CATCH error
        RETURN null  // Invalid or expired token
    END TRY
END FUNCTION
```

### 3.6 Accessibility Settings Algorithm

**Purpose:** Persist and apply user accessibility preferences across all pages.

**Pseudocode:**

```
ALGORITHM: applyAccessibilitySettings(pageName)
INPUT:    pageName — identifier for page-specific i18n keys
OUTPUT:   none (modifies DOM and localStorage)

BEGIN
    // Step 1: LOAD SAVED PREFERENCES
    savedTextSize      = localStorage.getItem("textSize")      // null, "small", "large"
    savedDisplayMode   = localStorage.getItem("displayMode")   // null, "dark", "highContrast"
    savedReduceMotion  = localStorage.getItem("reduceMotion")  // null, "enabled"
    savedLanguage      = localStorage.getItem("language")      // null, "en", "fr", "zh", "de"
    
    // Step 2: APPLY TEXT SIZE
    htmlElement = document.documentElement
    
    IF savedTextSize IS NOT null THEN
        REMOVE class "text-small" FROM htmlElement
        REMOVE class "text-large" FROM htmlElement
        
        IF savedTextSize IS "small" THEN
            ADD class "text-small" TO htmlElement
        END IF
        IF savedTextSize IS "large" THEN
            ADD class "text-large" TO htmlElement
        END IF
        
        // Update settings UI buttons
        FOREACH btn IN document.querySelectorAll("[data-action='textSize']") DO
            IF btn.dataset.value IS savedTextSize THEN
                ADD class "active" TO btn
            ELSE
                REMOVE class "active" FROM btn
            END IF
        END FOREACH
    END IF
    
    // Step 3: APPLY DISPLAY MODE
    IF savedDisplayMode IS NOT null THEN
        REMOVE class "dark-mode" FROM htmlElement
        REMOVE class "high-contrast" FROM htmlElement
        
        IF savedDisplayMode IS "dark" THEN
            ADD class "dark-mode" TO htmlElement
        END IF
        IF savedDisplayMode IS "highContrast" THEN
            ADD class "high-contrast" TO htmlElement
        END IF
        
        // Update settings UI buttons
        FOREACH btn IN document.querySelectorAll("[data-action='displayMode']") DO
            IF btn.dataset.value IS savedDisplayMode THEN
                ADD class "active" TO btn
            ELSE
                REMOVE class "active" FROM btn
            END IF
        END FOREACH
    END IF
    
    // Step 4: APPLY REDUCED MOTION
    IF savedReduceMotion IS "enabled" THEN
        ADD class "reduce-motion" TO htmlElement
        IF reduceMotionCheckbox EXISTS THEN
            reduceMotionCheckbox.checked = true
        END IF
    ELSE
        REMOVE class "reduce-motion" FROM htmlElement
    END IF
    
    // Step 5: APPLY LANGUAGE
    IF savedLanguage IS NOT null AND languageSelect EXISTS THEN
        languageSelect.value = savedLanguage
        CALL updateLanguage(savedLanguage, pageName)
    END IF
END ALGORITHM


// --- Settings Change Handler ---
FUNCTION onSettingChange(action, value)
    // Called when user clicks a settings button
    
    IF action IS "textSize" THEN
        localStorage.setItem("textSize", value)
        CALL applyAccessibilitySettings(currentPage)
    END IF
    
    IF action IS "displayMode" THEN
        localStorage.setItem("displayMode", value)
        CALL applyAccessibilitySettings(currentPage)
    END IF
    
    IF action IS "reduceMotion" THEN
        IF checkbox.checked THEN
            localStorage.setItem("reduceMotion", "enabled")
        ELSE
            localStorage.setItem("reduceMotion", "disabled")
        END IF
        CALL applyAccessibilitySettings(currentPage)
    END IF
    
    IF action IS "language" THEN
        localStorage.setItem("language", selectedValue)
        CALL updateLanguage(selectedValue, currentPage)
    END IF
END FUNCTION
```

### 3.7 Scroll Animation Algorithm

**Purpose:** Trigger fade-in animations when elements scroll into view.

**Pseudocode:**

```
ALGORITHM: initializeScrollAnimations()
INPUT:    none
OUTPUT:   none (sets up IntersectionObserver)

BEGIN
    // Step 1: CREATE INTERSECTION OBSERVER
    observer = NEW IntersectionObserver(
        CALLBACK: function(entries) {
            FOREACH entry IN entries DO
                // Step 2: CHECK IF ELEMENT IS VISIBLE
                IF entry.isIntersecting IS true THEN
                    
                    // Step 3: ADD "in-view" CLASS TO TRIGGER CSS ANIMATION
                    ADD class "in-view" TO entry.target
                    
                    // Step 4: STOP OBSERVING (animate once only)
                    observer.unobserve(entry.target)
                END IF
            END FOREACH
        },
        OPTIONS: {
            threshold: 0.08  // Trigger when 8% visible
        }
    )
    
    // Step 5: SELECT ALL ANIMATABLE ELEMENTS
    selectors = [
        ".info-box", ".feature-card", ".faq-item", ".step-card",
        ".accent-banner", ".card-section", ".page-hero",
        ".section-title", ".section-label", ".section-subtitle",
        ".cta-strip", "table", ".comparison-wrap", ".college-card"
    ]
    
    elements = document.querySelectorAll(selectors.join(","))
    
    // Step 6: SET INITIAL STATE AND START OBSERVING
    FOREACH element IN elements DO
        element.style.opacity = "0"
        element.style.transform = "translateY(28px)"
        observer.observe(element)
    END FOREACH
END ALGORITHM
```

### 3.8 FAQ Accordion Algorithm

**Pseudocode:**

```
ALGORITHM: initializeFaqAccordion()
INPUT:    none
OUTPUT:   none (adds click handlers to FAQ questions)

BEGIN
    questions = document.querySelectorAll(".faq-question")
    
    FOREACH question IN questions DO
        question.addEventListener("click", FUNCTION(event) {
            // Step 1: GET PARENT FAQ ITEM
            faqItem = question.parentElement
            
            // Step 2: CHECK IF CURRENTLY OPEN
            wasOpen = faqItem.classList.contains("open")
            
            // Step 3: CLOSE ALL FAQ ITEMS
            allItems = document.querySelectorAll(".faq-item")
            FOREACH item IN allItems DO
                REMOVE class "open" FROM item
            END FOREACH
            
            // Step 4: TOGGLE CURRENT ITEM
            IF wasOpen IS false THEN
                ADD class "open" TO faqItem
            END IF
        })
    END FOREACH
END ALGORITHM
```

### 3.9 Spam Detection Algorithm (Backend)

**Pseudocode:**

```
ALGORITHM: detectSpam(request)
INPUT:    request object with body and IP
OUTPUT:   boolean (true = likely spam)

BEGIN
    // Test 1: HONEYPOT CHECK
    // Hidden field that should remain empty (bots fill it)
    IF request.body._honeypot IS NOT empty THEN
        LOG "Honeypot triggered from IP: " + request.ip
        RETURN true  // Definitely spam
    END IF
    
    // Test 2: RATE LIMITING
    // Check if IP has exceeded request limit
    // Handled by express-rate-limit middleware
    // 100 requests per 15 minutes per IP
    
    // Test 3: PAYLOAD SIZE CHECK
    // Body size limited to 10KB via express.json({ limit: '10kb' })
    
    // Test 4: CONTENT VALIDATION
    // If text contains suspicious patterns:
    // - Multiple URLs
    // - Excessive repetition
    // - Common spam keywords
    // This is handled by the validation middleware
    
    RETURN false  // Message appears legitimate
END FUNCTION
```

### 3.10 Server Request Handling Algorithm

**Pseudocode:**

```
ALGORITHM: handleServerRequest(request, response)
INPUT:    HTTP request and response objects
OUTPUT:   HTTP response

BEGIN
    // Step 1: STATIC FILE SERVING
    // Try to serve static files from root directory
    // index: Main.html (served for "/")
    
    // Step 2: SECURITY MIDDLEWARE
    // Helmet.js sets security headers (if enabled)
    
    // Step 3: CORS CHECK
    allowedOrigins = env.ALLOWED_ORIGINS || ["http://localhost:3000", "file://"]
    IF request.origin IS NOT in allowedOrigins THEN
        BLOCK request
        RETURN 403 Forbidden
    END IF
    
    // Step 4: RATE LIMITING
    // Check request count for this IP
    IF request.ip has exceeded 100 requests in 15 minutes THEN
        RETURN 429 Too Many Requests
    END IF
    
    // Step 5: BODY PARSING
    // Parse JSON body (max 10KB)
    // Parse URL-encoded body
    
    // Step 6: REQUEST LOGGING
    LOG timestamp + method + path + " - IP: " + request.ip
    
    // Step 7: ROUTE TO API HANDLER
    route = MATCH request.method + request.path TO:
        POST /api/contact  → contactRoute.process()
        POST /api/register → registerRoute.process()
        GET  /api/colleges → collegesRoute.search()
        POST /api/chat     → chatbotRoute.process()
        POST /api/auth     → authRoute.authenticate()
        GET  /api/health   → healthRoute.check()
        ANY  /api/*        → 404 Not Found
        ANY  /*            → Try static file, 404 if not found
    
    CALL route.handler(request, response)
    
    // Step 8: GLOBAL ERROR HANDLING
    IF any error occurs THEN
        LOG error
        IF production mode THEN
            RETURN { error: "An error occurred" }
        ELSE
            RETURN { error: error.message }
        END IF
    END IF
END ALGORITHM
```

---

## 4. Test Strategy

### 4.1 Testing Overview

| Level | Focus | Tools | Target Coverage |
|-------|-------|-------|-----------------|
| Unit | Individual functions | Jest | 100% of validation logic |
| Integration | API endpoints, DB | Jest + Supertest | 95%+ of API routes |
| Security | XSS, SQLi, auth | Manual + automated | All security measures |
| Accessibility | WCAG 2.1 AA | Manual + tools | All pages |
| End-to-End | Full user flows | Manual | All critical paths |

### 4.2 Unit Tests

#### 4.2.1 Validation Functions (`validation.test.js`)

```javascript
// FILE: backend/tests/validation.test.js

// --- Test Suite: Email Validation ---
TEST "validateEmail with valid emails":
    ASSERT validateEmail("user@example.com")        IS true
    ASSERT validateEmail("user.name+tag@domain.co.uk") IS true
    ASSERT validateEmail("a@b.com")                 IS true
END TEST

TEST "validateEmail with invalid emails":
    ASSERT validateEmail(null)              IS false
    ASSERT validateEmail("")                IS false
    ASSERT validateEmail("not-an-email")    IS false
    ASSERT validateEmail("@domain.com")     IS false
    ASSERT validateEmail("user@")           IS false
    ASSERT validateEmail("user@.com")       IS false
END TEST

// --- Test Suite: Text Validation ---
TEST "validateText with valid inputs":
    ASSERT validateText("Hello", 500)       IS true
    ASSERT validateText("A", 1)             IS true  // Minimum length
    ASSERT validateText(REPEAT("x", 500), 500) IS true  // Max length
END TEST

TEST "validateText with invalid inputs":
    ASSERT validateText("", 500)            IS false  // Empty string
    ASSERT validateText(null, 500)          IS false
    ASSERT validateText(undefined, 500)     IS false
    ASSERT validateText("<script>alert('xss')</script>", 500) IS false  // HTML tags
    ASSERT validateText(REPEAT("x", 501), 500) IS false  // Exceeds max length
END TEST

// --- Test Suite: HTML Tag Detection ---
TEST "containsHtmlTags detection":
    ASSERT containsHtmlTags("<script>")         IS true
    ASSERT containsHtmlTags("<img src=x>")      IS true
    ASSERT containsHtmlTags("</div>")           IS true
    ASSERT containsHtmlTags("normal text")      IS false
    ASSERT containsHtmlTags("Hello < world")    IS false  // Not valid HTML tag
    ASSERT containsHtmlTags("")                 IS false  // Empty string
END TEST

// --- Test Suite: Sanitization ---
TEST "sanitizeText escapes HTML":
    ASSERT sanitizeText("<script>")             IS "<script>"
    ASSERT sanitizeText("Hello & goodbye")      IS "Hello & goodbye"
    ASSERT sanitizeText('quote "test"')         IS "quote "test""
    ASSERT sanitizeText("  spaces  ")           IS "spaces"  // Trimmed
END TEST

// --- Test Suite: Contact Form Validation ---
TEST "validateContactForm with valid data":
    result = validateContactForm({
        name: "John",
        email: "john@test.com",
        subject: "T Levels Info",
        message: "Please send me information"
    })
    ASSERT result.isValid IS true
    ASSERT result.errors IS empty
END TEST

TEST "validateContactForm with missing fields":
    result = validateContactForm({})
    ASSERT result.isValid IS false
    ASSERT result.errors CONTAINS "email"
    ASSERT result.errors CONTAINS "subject"
    ASSERT result.errors CONTAINS "message"
END TEST

TEST "validateContactForm with invalid email":
    result = validateContactForm({
        name: "John",
        email: "not-email",
        subject: "Test",
        message: "Test message"
    })
    ASSERT result.isValid IS false
    ASSERT result.errors.email IS "Valid email is required"
END TEST

// --- Test Suite: Registration Form Validation ---
TEST "validateRegistrationForm with valid data":
    result = validateRegistrationForm({
        full_name: "Jane Smith",
        email: "jane@test.com",
        audience: "Student",
        interest: "Digital T Level"
    })
    ASSERT result.isValid IS true
END TEST

TEST "validateRegistrationForm with invalid audience":
    result = validateRegistrationForm({
        full_name: "Jane Smith",
        email: "jane@test.com",
        audience: "InvalidRole"
    })
    ASSERT result.isValid IS false
    ASSERT result.errors CONTAINS "audience"
END TEST

TEST "validateRegistrationForm with XSS attempt":
    result = validateRegistrationForm({
        full_name: "<script>alert('xss')</script>",
        email: "test@test.com",
        audience: "Student"
    })
    ASSERT result.isValid IS false
    ASSERT result.errors CONTAINS "full_name"
END TEST
```

### 4.3 Integration Tests

#### 4.3.1 API Endpoint Tests (`api.test.js`)

```javascript
// FILE: backend/tests/api.test.js

// --- Test Suite: Health Check ---
TEST "GET /api/health returns status":
    response = supertest(app).get("/api/health")
    ASSERT response.status IS 200
    ASSERT response.body.success IS true
    ASSERT response.body.status IS "ok"
    ASSERT response.body CONTAINS "uptime"
END TEST

// --- Test Suite: Contact API ---
TEST "POST /api/contact with valid data":
    response = supertest(app)
        .post("/api/contact")
        .send({
            email: "test@example.com",
            subject: "Test Subject",
            message: "This is a test message"
        })
    ASSERT response.status IS 201
    ASSERT response.body.success IS true
    ASSERT response.body CONTAINS "id"
    ASSERT response.body.message CONTAINS "Thank you"
END TEST

TEST "POST /api/contact with missing data":
    response = supertest(app)
        .post("/api/contact")
        .send({})
    ASSERT response.status IS 400
    ASSERT response.body.success IS false
    ASSERT response.body CONTAINS "errors"
END TEST

TEST "POST /api/contact with XSS attempt":
    response = supertest(app)
        .post("/api/contact")
        .send({
            email: "test@test.com",
            subject: "<script>alert('x')</script>",
            message: "Normal message"
        })
    ASSERT response.status IS 400  // Should reject HTML
END TEST

// --- Test Suite: Registration API ---
TEST "POST /api/register with valid data":
    response = supertest(app)
        .post("/api/register")
        .send({
            full_name: "Jane Smith",
            email: "jane@example.com",
            audience: "Student",
            interest: "Interested in Digital T Levels"
        })
    ASSERT response.status IS 201
    ASSERT response.body.success IS true
    ASSERT response.body.message CONTAINS "Jane Smith"
END TEST

TEST "POST /api/register with invalid audience":
    response = supertest(app)
        .post("/api/register")
        .send({
            full_name: "Test User",
            email: "test@test.com",
            audience: "Invalid"
        })
    ASSERT response.status IS 400
    ASSERT response.body.success IS false
END TEST

// --- Test Suite: College Search API ---
TEST "GET /api/colleges with no filters":
    response = supertest(app).get("/api/colleges")
    ASSERT response.status IS 200
    ASSERT response.body.success IS true
    ASSERT response.body.count IS 35  // All colleges
    ASSERT response.body.data LENGTH IS 35
END TEST

TEST "GET /api/colleges with location filter":
    response = supertest(app)
        .get("/api/colleges?location=Birmingham")
    ASSERT response.status IS 200
    ASSERT response.body.success IS true
    // Should find Birmingham Met, South & City, etc.
    FOREACH college IN response.body.data DO
        ASSERT college.town.toLowerCase() CONTAINS "birmingham"
           OR college.postcode.toLowerCase().startsWith("b")
    END FOREACH
END TEST

TEST "GET /api/colleges with subject filter":
    response = supertest(app)
        .get("/api/colleges?subject=Engineering")
    ASSERT response.status IS 200
    FOREACH college IN response.body.data DO
        ASSERT college.subjects CONTAINS "Engineering"
    END FOREACH
END TEST

TEST "GET /api/colleges with no matches":
    response = supertest(app)
        .get("/api/colleges?location=Atlantis")
    ASSERT response.status IS 200
    ASSERT response.body.count IS 0
    ASSERT response.body.data IS empty
END TEST
```

### 4.4 Security Testing

#### 4.4.1 XSS Prevention Tests

| Test | Input | Expected Result |
|------|-------|-----------------|
| Script injection | `<script>alert('xss')</script>` | Rejected (400) |
| Image tag XSS | `<img src=x onerror=alert(1)>` | Rejected (400) |
| Iframe injection | `<iframe src="malicious.com"></iframe>` | Rejected (400) |
| Event handler | `<div onmouseover="alert(1)">Hover</div>` | Rejected (400) |
| Encoded XSS | `<script>alert(1)</script>` | Stored but escaped |

#### 4.4.2 SQL Injection Tests

| Test | Input | Expected Result |
|------|-------|-----------------|
| SQL injection in email | `' OR 1=1 --` | Treated as literal string, query safe |
| UNION injection | `' UNION SELECT * FROM users --` | Treated as literal string |
| Boolean blind | `' AND 1=1 --` | Treated as literal string |
| Stacked queries | `'; DROP TABLE contacts; --` | Treated as literal string |

**Key:** All queries use parameterized statements — NO string concatenation.

#### 4.4.3 Rate Limiting Tests

| Test | Action | Expected Result |
|------|--------|-----------------|
| Normal usage | 50 requests / 15 min | All succeed (200) |
| Threshold | 100 requests / 15 min | All succeed (200) |
| Above limit | 101st request / 15 min | Blocked (429) |
| Reset | Wait 15 min, then request | Succeed (200) |

#### 4.4.4 CORS Tests

| Test | Origin | Expected Result |
|------|--------|-----------------|
| Allowed origin | `http://localhost:3000` | Access granted |
| Allowed origin | `file://` | Access granted |
| Disallowed origin | `https://malicious.com` | Blocked |

### 4.5 Accessibility Testing (WCAG 2.1 AA)

#### 4.5.1 Automated Checks (per page)

| Criterion | Test | Tool/Method |
|-----------|------|-------------|
| 1.1.1 Non-text Content | All images have alt text | Manual review |
| 1.4.3 Contrast (Minimum) | Text contrast ≥ 4.5:1 | Wave / axe DevTools |
| 1.4.4 Resize Text | Text scales to 200% without loss | Manual browser zoom |
| 2.1.1 Keyboard | All functions accessible via keyboard | Manual Tab navigation |
| 2.4.3 Focus Order | Logical focus order | Manual Tab testing |
| 2.4.7 Focus Visible | Visible focus indicators | Manual Tab testing |
| 3.3.1 Error Identification | Form errors clearly identified | Manual form testing |
| 4.1.2 Name, Role, Value | ARIA labels on dynamic elements | axe DevTools |

#### 4.5.2 Accessibility Feature Tests

| Feature | Test | Expected Behavior |
|---------|------|-------------------|
| Dark Mode | Toggle on/off | All pages switch to dark palette |
| High Contrast | Toggle on/off | Black + yellow scheme applied |
| Text Size small | Select "A" small | Font size reduced to 14px base |
| Text Size large | Select "A" large | Font size increased to 18px base |
| Reduced Motion | Checkbox checked | All animations/transitions disabled |
| Language: French | Select "Français" | All data-i18n elements show French text |
| Persistence | Reload page | All settings preserved |

### 4.6 Performance Testing

| Test | Target | Method |
|------|--------|--------|
| API response time | < 200ms (p95) | Load testing with k6/Artillery |
| Static page load | < 2s (first paint) | Lighthouse audit |
| Concurrent users | Support 50 simultaneous | Stress testing |
| Database queries | < 50ms per query | Query profiling |
| College search | < 100ms (35 items) | Microbenchmark |

### 4.7 Error Handling Tests

| Scenario | Expected Behavior |
|----------|-------------------|
| Database connection lost | Return 500 with generic error message |
| Invalid JSON body | Return 400 "Invalid JSON" |
| Missing API key (chatbot) | Return 503 with helpful message |
| Rate limit exceeded | Return 429 with retry-after header |
| Unknown API endpoint | Return 404 with JSON error |
| Static file not found | Return 404 HTML page |
| Server internal error | Log details, return generic 500 |

### 4.8 Browser Compatibility

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Internet Explorer | Not supported |

### 4.9 Test Execution Commands

```bash
# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Run specific test file
npm test validation.test.js
npm test api.test.js

# Watch mode (re-run on changes)
npm run test:watch

# Coverage thresholds
# Lines:      80%
# Branches:   75%
# Functions:  80%
# Statements: 80%
```

### 4.10 Test Data Requirements

| Dataset | Records | Purpose |
|---------|---------|---------|
| Colleges | 35 | Search algorithm testing |
| Contacts | 50+ | CRUD and pagination testing |
| Registrations | 50+ | Registration flow testing |
| Users | 10+ | Authentication testing |
| Audit logs | 100+ | Audit trail testing |

---

## Appendices

### A. Key Files Reference

| File | Purpose |
|------|---------|
| `backend/server.js` | Main Express server, routes, chatbot logic |
| `backend/db/database.js` | SQLite connection, schema, query helpers |
| `backend/middleware/validation.js` | Input validation and sanitization |
| `backend/routes/contact.js` | Contact form API endpoint |
| `backend/routes/register.js` | Registration API endpoint |
| `backend/routes/colleges.js` | College search API with data |
| `backend/services/email.js` | Email notification service |
| `find-colleges.html` | Frontend college search page |
| `translations.js` | Internationalization strings |

### B. Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `PORT` | No (default 3000) | Server port |
| `GEMINI_API_KEY` | Yes (for chatbot) | Google Gemini API key |
| `ALLOWED_ORIGINS` | No | CORS allowed origins |
| `EMAIL_HOST` | Yes (for email) | SMTP server host |
| `EMAIL_PORT` | Yes | SMTP server port |
| `EMAIL_USER` | Yes | SMTP username |
| `EMAIL_PASS` | Yes | SMTP password |
| `JWT_SECRET` | Yes | JWT signing secret |
| `NODE_ENV` | No | "development" or "production" |

---

*End of Design Document*