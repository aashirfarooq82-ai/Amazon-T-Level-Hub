/**
 * Database module - SQLite3 configuration and initialization
 * Implements secure database practices
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'tlevels.db');

// Initialize database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeTables();
  }
});

/**
 * Initialize database tables with proper schema
 * Uses parameterized queries to prevent SQL injection
 */
function initializeTables() {
  db.serialize(() => {
    // Contact submissions table
    db.run(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending',
        ip_address TEXT,
        CONSTRAINT email_format CHECK(email LIKE '%@%.%')
      )
    `);

    // Migration: Add name column to contacts if it doesn't exist (for existing databases)
    db.run(`ALTER TABLE contacts ADD COLUMN name TEXT`, function(err) {
      if (err) {
        // Column already exists - this is expected on fresh installs
      }
    });

    // Interest registration table
    db.run(`
      CREATE TABLE IF NOT EXISTS registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        audience TEXT NOT NULL,
        interest TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending',
        ip_address TEXT,
        CONSTRAINT email_format CHECK(email LIKE '%@%.%'),
        CONSTRAINT valid_audience CHECK(audience IN ('Student', 'Parent', 'Teacher', 'School Representative'))
      )
    `);

    // Audit log for security tracking
    db.run(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT NOT NULL,
        details TEXT,
        ip_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Users table for authentication
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        account_type TEXT NOT NULL,
        enable_2fa BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT email_format CHECK(email LIKE '%@%.%'),
        CONSTRAINT valid_account_type CHECK(account_type IN ('Student', 'Parent', 'Teacher', 'School Representative'))
      )
    `);

    // 2FA codes for two-factor authentication
    db.run(`
      CREATE TABLE IF NOT EXISTS two_fa_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        code TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // JWT tokens for session management
    db.run(`
      CREATE TABLE IF NOT EXISTS tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token_hash TEXT NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Password reset tokens
    db.run(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        used INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Favorites table for saving colleges/resources
    db.run(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        item_type TEXT NOT NULL,
        item_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, item_type, item_id)
      )
    `);

    console.log('Database tables initialized');
  });
}

/**
 * Execute query with proper error handling
 * @param {string} sql - SQL query
 * @param {array} params - Query parameters
 * @returns {Promise} - Resolves with query result
 */
function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        console.error('Database error:', err);
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}

/**
 * Execute select query
 * @param {string} sql - SQL query
 * @param {array} params - Query parameters
 * @returns {Promise} - Resolves with array of results
 */
function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
}

/**
 * Execute single row select query
 * @param {string} sql - SQL query
 * @param {array} params - Query parameters
 * @returns {Promise} - Resolves with single row or null
 */
function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error('Database error:', err);
        reject(err);
      } else {
        resolve(row || null);
      }
    });
  });
}

module.exports = {
  db,
  runAsync,
  allAsync,
  getAsync
};
