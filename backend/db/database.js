/**
 * Database module - Turso (libSQL) configuration and initialization
 * Implements secure database practices
 *
 * Replaces local SQLite file storage with hosted, persistent Turso database.
 * Function interface (runAsync, allAsync, getAsync) is unchanged, so
 * the rest of the app does not need to be modified.
 */
 
const { createClient } = require('@libsql/client');
require('dotenv').config();
 
// Connect to Turso using env vars (set these in Render's Environment tab,
// NOT in this file, and NOT committed to GitHub)
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
 
/**
 * Initialize database tables with proper schema
 * Uses parameterized queries to prevent SQL injection
 */
async function initializeTables() {
  try {
    // Contact submissions table
    await db.execute(`
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
    try {
      await db.execute(`ALTER TABLE contacts ADD COLUMN name TEXT`);
    } catch (err) {
      // Column already exists - this is expected on fresh installs
    }
 
    // Interest registration table
    await db.execute(`
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
    await db.execute(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT NOT NULL,
        details TEXT,
        ip_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
 
    // Users table for authentication
    await db.execute(`
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
    await db.execute(`
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
    await db.execute(`
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
    await db.execute(`
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
    await db.execute(`
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
  } catch (err) {
    console.error('Error initializing tables:', err);
  }
}
 
// Run initialization once on startup
initializeTables();
 
/**
 * Execute query with proper error handling (INSERT/UPDATE/DELETE)
 * @param {string} sql - SQL query
 * @param {array} params - Query parameters
 * @returns {Promise} - Resolves with { id, changes }
 */
async function runAsync(sql, params = []) {
  try {
    const result = await db.execute({ sql, args: params });
    return {
      id: result.lastInsertRowid ? Number(result.lastInsertRowid) : null,
      changes: result.rowsAffected,
    };
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
}
 
/**
 * Execute select query
 * @param {string} sql - SQL query
 * @param {array} params - Query parameters
 * @returns {Promise} - Resolves with array of results
 */
async function allAsync(sql, params = []) {
  try {
    const result = await db.execute({ sql, args: params });
    return result.rows || [];
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
}
 
/**
 * Execute single row select query
 * @param {string} sql - SQL query
 * @param {array} params - Query parameters
 * @returns {Promise} - Resolves with single row or null
 */
async function getAsync(sql, params = []) {
  try {
    const result = await db.execute({ sql, args: params });
    return result.rows && result.rows.length > 0 ? result.rows[0] : null;
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
}
 
module.exports = {
  db,
  runAsync,
  allAsync,
  getAsync,
};
 