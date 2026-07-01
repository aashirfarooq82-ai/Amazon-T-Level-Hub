# Admin Dashboard - Amazon T Levels Hub

## Overview

The Admin Dashboard provides a comprehensive interface for managing the Amazon T Levels Hub platform. It includes user management, contact submission tracking, registration monitoring, audit logs, and analytics.

## Access

1. Navigate to `http://localhost:3000/admin.html` in your browser
2. Login with admin credentials (must have `account_type: 'Admin'` or email `admin@amazon.com`)

## Features

### 1. Dashboard Overview
- **Total Users**: Count of all registered users
- **Total Contacts**: Count of all contact form submissions
- **Total Registrations**: Count of all interest registrations
- **Pending Contacts**: Number of contacts awaiting response
- **Recent Activity**: Last 10 audit log entries

### 2. User Management
- View all users with pagination (10 per page)
- Search users by email or name
- Edit user details (name, account type, 2FA status)
- Delete users
- Export users to CSV

### 3. Contact Submissions
- View all contact form submissions
- Filter by status (pending, in_progress, resolved, closed)
- Update contact status
- Export contacts to CSV

### 4. Interest Registrations
- View all interest registrations
- Filter by audience type (Student, Parent, Teacher, School Representative)
- Track registration trends

### 5. Audit Logs
- View all system activity logs
- Track admin actions
- Monitor security events

### 6. Analytics
- Account type distribution
- Audience type distribution
- Growth trends over last 30 days

## API Endpoints

All admin endpoints require authentication with admin privileges.

### Authentication
```
POST /api/admin/dashboard
GET /api/admin/users
GET /api/admin/users/:id
PUT /api/admin/users/:id
DELETE /api/admin/users/:id
GET /api/admin/contacts
PUT /api/admin/contacts/:id
GET /api/admin/registrations
GET /api/admin/audit-logs
GET /api/admin/analytics
GET /api/admin/export/users
GET /api/admin/export/contacts
```

## Setting Up Admin Access

### Option 1: Using Account Type (Recommended for Production)

1. Create a new user with admin privileges via the database:
```sql
INSERT INTO users (email, password_hash, full_name, account_type, enable_2fa)
VALUES ('admin@amazon.com', '$2b$10$...', 'Admin User', 'Admin', 0);
```

2. Or update an existing user:
```sql
UPDATE users SET account_type = 'Admin' WHERE email = 'admin@example.com';
```

### Option 2: Using Email (Development Only)

The system automatically grants admin access to users with email `admin@amazon.com`.

## Security Features

- **JWT Authentication**: All admin routes require valid JWT tokens
- **Admin Authorization**: Middleware verifies admin privileges
- **Rate Limiting**: Standard rate limiting applies (100 requests per 15 minutes)
- **Audit Logging**: All admin actions are logged with IP addresses
- **CSRF Protection**: Helmet security middleware enabled

## Creating an Admin User

### Using the Signup API

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@amazon.com",
    "accountType": "Admin",
    "password": "SecurePassword123!",
    "enable2FA": false
  }'
```

### Using SQLite Directly

```bash
# Access the SQLite database
sqlite3 backend/db/tlevels.db

# Insert admin user (replace password hash with actual bcrypt hash)
INSERT INTO users (email, password_hash, full_name, account_type, enable_2fa)
VALUES ('admin@amazon.com', '$2b$10$abcdefghijklmnopqrstuv', 'Admin User', 'Admin', 0);
```

## Testing the Dashboard

1. Start the backend server:
```bash
cd backend
npm install
npm run dev
```

2. Open `admin.html` in your browser or navigate to `http://localhost:3000/admin.html`

3. Login with your admin credentials

## Troubleshooting

### "Admin access required" error
- Ensure the user has `account_type = 'Admin'` in the database
- Or use email `admin@amazon.com`

### Login fails
- Verify the user exists in the database
- Check that the password is correct
- Ensure the backend server is running

### Data not loading
- Check browser console for errors
- Verify JWT token is valid (not expired)
- Ensure backend API is accessible

## Production Considerations

1. **Enable HTTPS**: Always use HTTPS in production
2. **Strong JWT Secret**: Set a strong `JWT_SECRET` in `.env`
3. **Admin Email Whitelist**: Consider using a whitelist of admin emails
4. **IP Whitelisting**: Restrict admin access to specific IPs if needed
5. **Session Management**: Implement token invalidation on logout
6. **Backup**: Regularly backup the database
7. **Monitoring**: Set up alerts for admin actions

## File Structure

```
AMAZON/
├── admin.html                 # Admin dashboard frontend
├── backend/
│   ├── routes/
│   │   └── admin.js          # Admin API routes
│   ├── server.js             # Main server (updated to include admin routes)
│   └── db/
│       └── database.js       # Database configuration
└── ADMIN_DASHBOARD.md        # This file
```

## Next Steps

- [ ] Add chart visualizations for analytics
- [ ] Implement bulk actions for users/contacts
- [ ] Add email notifications for admin actions
- [ ] Create admin role hierarchy (super admin, moderator, etc.)
- [ ] Add advanced filtering and sorting
- [ ] Implement data import functionality
- [ ] Add user activity tracking
- [ ] Create automated reports