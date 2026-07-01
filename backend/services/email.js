/**
 * Email Service
 * Handles all email operations using Nodemailer with Gmail SMTP
 */

const nodemailer = require('nodemailer');

/**
 * Create email transporter using Gmail SMTP
 * @returns {Object|null} Nodemailer transporter or null if not configured
 */
function createTransporter() {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    return null;
  }

  // Clean the password - remove quotes and spaces (Gmail App Passwords have spaces for readability)
  const cleanPass = String(EMAIL_PASS).replace(/^["']|["']$/g, '').replace(/\s/g, '');

  return nodemailer.createTransport({
    host: EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(EMAIL_PORT || '587'),
    secure: false,
    requireTLS: true,
    auth: {
      user: EMAIL_USER,
      pass: cleanPass,
    },
  });
}

/**
 * Send contact acknowledgement email to the user
 * @param {string} email - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} subject - Contact form subject
 * @returns {Promise<boolean>} Success status
 */
async function sendContactAcknowledgement(email, name, subject) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('Email not configured — skipping contact acknowledgement email');
    return false;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"T Levels Hub" <tlevelshub@gmail.com>',
    to: email,
    subject: 'Thank you for contacting T Levels Hub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #F2F4F7; border-radius: 12px;">
        <div style="background: #1E2B3C; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #FF9900; margin: 0; font-size: 22px;">Amazon T Levels Hub</h1>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1E2B3C; font-size: 18px; margin-top: 0;">We've received your enquiry</h2>
          <p style="color: #4A5568; font-size: 15px; line-height: 1.7;">Dear ${name},</p>
          <p style="color: #4A5568; font-size: 15px; line-height: 1.7;">
            Thank you for contacting the Amazon T Levels Hub regarding <strong>"${subject}"</strong>.
          </p>
          <p style="color: #4A5568; font-size: 15px; line-height: 1.7;">
            <strong>We have received your request. A team member will respond within 2 business days.</strong>
          </p>
          <p style="color: #4A5568; font-size: 15px; line-height: 1.7;">
            A member of our team will review your enquiry and get back to you as soon as possible.
          </p>
          <div style="background: #F2F4F7; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #4A5568; font-size: 13px; line-height: 1.6; margin: 0;">
              <strong style="color: #1E2B3C;">Did you know?</strong><br>
              You can also find answers to common questions using the T Levels Assistant chatbot
              on our website.
            </p>
          </div>
          <p style="color: #4A5568; font-size: 15px; line-height: 1.7;">
            Best regards,<br>
            <strong style="color: #FF9900;">The T Levels Hub Team</strong>
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #A0AEC0; font-size: 12px;">
          <p style="margin: 0;">© 2026 Amazon T Levels Hub — Supporting Future Careers</p>
          <p style="margin: 5px 0 0 0;">This is an automated response. Please do not reply to this email.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Contact acknowledgement email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send contact acknowledgement email:', error.message);
    return false;
  }
}

/**
 * Send contact notification email to admin
 * @param {string} name - Sender name
 * @param {string} email - Sender email
 * @param {string} subject - Contact form subject
 * @param {string} message - Contact form message
 * @param {string} timestamp - Submission timestamp
 * @returns {Promise<boolean>} Success status
 */
async function sendContactNotificationToAdmin(name, email, subject, message, timestamp) {
  const transporter = createTransporter();
  if (!transporter) {
    return false;
  }

  const adminEmail = process.env.EMAIL_TO || process.env.EMAIL_USER;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"T Levels Hub" <tlevelshub@gmail.com>',
    to: adminEmail,
    subject: `[T Levels Hub] New enquiry: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px;">
        <h2 style="color: #1E2B3C;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px 12px; background: #F2F4F7; font-weight: bold; color: #1E2B3C; border: 1px solid #D2D7DF;">Name</td>
            <td style="padding: 8px 12px; color: #4A5568; border: 1px solid #D2D7DF;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; background: #F2F4F7; font-weight: bold; color: #1E2B3C; border: 1px solid #D2D7DF;">Email</td>
            <td style="padding: 8px 12px; color: #4A5568; border: 1px solid #D2D7DF;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; background: #F2F4F7; font-weight: bold; color: #1E2B3C; border: 1px solid #D2D7DF;">Subject</td>
            <td style="padding: 8px 12px; color: #4A5568; border: 1px solid #D2D7DF;">${subject}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; background: #F2F4F7; font-weight: bold; color: #1E2B3C; border: 1px solid #D2D7DF;">Message</td>
            <td style="padding: 8px 12px; color: #4A5568; border: 1px solid #D2D7DF;">${message}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; background: #F2F4F7; font-weight: bold; color: #1E2B3C; border: 1px solid #D2D7DF;">Submitted</td>
            <td style="padding: 8px 12px; color: #4A5568; border: 1px solid #D2D7DF;">${timestamp}</td>
          </tr>
        </table>
        <p style="color: #A0AEC0; font-size: 12px;">This is an automated notification from the T Levels Hub contact form.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Admin notification sent for enquiry from ${name} (${email})`);
    return true;
  } catch (error) {
    console.error('Failed to send admin notification:', error.message);
    return false;
  }
}

/**
 * Send registration acknowledgement email to the user
 * @param {string} email - Recipient email address
 * @param {string} full_name - Recipient full name
 * @param {string} audience - User type (Student, Parent, etc.)
 * @returns {Promise<boolean>} Success status
 */
async function sendRegistrationAcknowledgement(email, full_name, audience) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('Email not configured — skipping registration acknowledgement email');
    return false;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"T Levels Hub" <tlevelshub@gmail.com>',
    to: email,
    subject: 'Thank you for registering with T Levels Hub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #F2F4F7; border-radius: 12px;">
        <div style="background: #1E2B3C; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #FF9900; margin: 0; font-size: 22px;">Amazon T Levels Hub</h1>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1E2B3C; font-size: 18px; margin-top: 0;">We've received your registration</h2>
          <p style="color: #4A5568; font-size: 15px; line-height: 1.7;">Dear ${full_name},</p>
          <p style="color: #4A5568; font-size: 15px; line-height: 1.7;">
            Thank you for registering your interest in T Levels with Amazon placements as a <strong>${audience}</strong>.
          </p>
          <p style="color: #4A5568; font-size: 15px; line-height: 1.7;">
            <strong>We have received your request. A team member will respond shortly.</strong>
          </p>
          <p style="color: #4A5568; font-size: 15px; line-height: 1.7;">
            We typically respond within one working day. A member of our team will review your registration
            and get back to you as soon as possible with relevant information and next steps.
          </p>
          <div style="background: #F2F4F7; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #4A5568; font-size: 13px; line-height: 1.6; margin: 0;">
              <strong style="color: #1E2B3C;">Did you know?</strong><br>
              You can also find answers to common questions using the T Levels Assistant chatbot
              on our website.
            </p>
          </div>
          <p style="color: #4A5568; font-size: 15px; line-height: 1.7;">
            Best regards,<br>
            <strong style="color: #FF9900;">The T Levels Hub Team</strong>
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #A0AEC0; font-size: 12px;">
          <p style="margin: 0;">© 2026 Amazon T Levels Hub — Supporting Future Careers</p>
          <p style="margin: 5px 0 0 0;">This is an automated response. Please do not reply to this email.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Registration acknowledgement email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send registration acknowledgement email:', error.message);
    return false;
  }
}

/**
 * Send registration notification email to admin
 * @param {string} email - User email
 * @param {string} full_name - User full name
 * @param {string} audience - User type
 * @param {string} interest - User interest (optional)
 * @returns {Promise<boolean>} Success status
 */
async function sendRegistrationNotificationToAdmin(email, full_name, audience, interest) {
  const transporter = createTransporter();
  if (!transporter) {
    return false;
  }

  const adminEmail = process.env.EMAIL_TO || process.env.EMAIL_USER;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"T Levels Hub" <tlevelshub@gmail.com>',
    to: adminEmail,
    subject: `[T Levels Hub] New registration: ${full_name} (${audience})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px;">
        <h2 style="color: #1E2B3C;">New Registration Submission</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px 12px; background: #F2F4F7; font-weight: bold; color: #1E2B3C; border: 1px solid #D2D7DF;">Name</td>
            <td style="padding: 8px 12px; color: #4A5568; border: 1px solid #D2D7DF;">${full_name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; background: #F2F4F7; font-weight: bold; color: #1E2B3C; border: 1px solid #D2D7DF;">Email</td>
            <td style="padding: 8px 12px; color: #4A5568; border: 1px solid #D2D7DF;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; background: #F2F4F7; font-weight: bold; color: #1E2B3C; border: 1px solid #D2D7DF;">Audience</td>
            <td style="padding: 8px 12px; color: #4A5568; border: 1px solid #D2D7DF;">${audience}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; background: #F2F4F7; font-weight: bold; color: #1E2B3C; border: 1px solid #D2D7DF;">Interest</td>
            <td style="padding: 8px 12px; color: #4A5568; border: 1px solid #D2D7DF;">${interest || 'Not specified'}</td>
          </tr>
        </table>
        <p style="color: #A0AEC0; font-size: 12px;">This is an automated notification from the T Levels Hub registration form.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Admin registration notification sent for ${full_name} (${email})`);
    return true;
  } catch (error) {
    console.error('Failed to send admin registration notification:', error.message);
    return false;
  }
}

module.exports = {
  createTransporter,
  sendContactAcknowledgement,
  sendContactNotificationToAdmin,
  sendRegistrationAcknowledgement,
  sendRegistrationNotificationToAdmin,
};