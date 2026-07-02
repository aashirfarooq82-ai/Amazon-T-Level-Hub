/**
 * Amazon T Levels Hub - Backend Server
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize database
const db = require('./db/database');

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disabled to allow inline styles/scripts - enable in production with proper nonces
  crossOriginEmbedderPolicy: false
}));

// CORS
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET || 'tlevels-cookie-secret'));

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET || 'tlevels-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Serve frontend files
app.use(express.static(path.join(__dirname, '..'), { index: 'Main.html' }));

// ── CHATBOT ────────────────────────────────────────────────────────────
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_INSTRUCTION = `
You are the "T Levels Assistant" chatbot on the Amazon T Levels Hub website.
You help students, parents, schools and advisors understand:
- What T Levels are (2-year qualifications for 16-19 year olds combining classroom
  learning with a substantial industry placement)
- How Amazon's industry placements work for T Level students
- How students, parents, schools and advisors can each get involved

Keep answers short, friendly and easy to read (2-4 sentences unless more detail is
clearly needed. If someone asks something totally unrelated to T Levels, Amazon
placements, or careers/education, politely steer the conversation back.
`;

app.post('/api/chat', async (req, res) => {
  try {
    const { history } = req.body;
    if (!Array.isArray(history) || history.length === 0) {
      return res.status(400).json({ error: 'Missing chat history' });
    }

    const contents = history.map((turn) => ({
      role: turn.role === 'bot' ? 'model' : 'user',
      parts: [{ text: turn.text }],
    }));

    const geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', geminiRes.status, errText);
      return res.status(502).json({ error: 'AI service temporarily unavailable. Please try again.' });
    }

    const data = await geminiRes.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ||
      "Sorry, I couldn't come up with a response. Could you try rephrasing?";

    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Something went wrong on the server' });
  }
});

// API Routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/register', require('./routes/register'));
app.use('/api/health', require('./routes/health'));
app.use('/api/colleges', require('./routes/colleges'));
app.use('/api/admin', require('./routes/admin'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'An error occurred'
      : err.message
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`\n✅ Server running at http://localhost:${port}\n`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;