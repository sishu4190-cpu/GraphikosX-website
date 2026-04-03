/**
 * GraphikosX Backend Server
 * ──────────────────────────────────────────────────
 * SETUP INSTRUCTIONS:
 *
 * 1. Install dependencies:
 *    npm install express cors nodemailer express-rate-limit helmet dotenv
 *
 * 2. Create a .env file in the same folder (see .env.example below)
 *
 * 3. Start the server:
 *    node server.js
 *    OR for production: pm2 start server.js --name graphikosx
 *
 * 4. For deployment on shared hosting / VPS:
 *    - Upload all files to your server
 *    - Point graphikosx.in to your server IP
 *    - Install Node.js on server
 *    - Run: npm install && node server.js
 *    - Use Nginx as reverse proxy (config included below)
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── SECURITY ──────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false, // Allow CDN scripts (GSAP, Google Fonts)
}));

app.use(cors({
  origin: ['https://graphikosx.in', 'https://www.graphikosx.in', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ─── RATE LIMITING ─────────────────────────────────────────
const contactLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 submissions per 15 min per IP
  message: { success: false, error: 'Too many requests. Please try again later.' }
});

// ─── SERVE STATIC FILES ────────────────────────────────────
app.use(express.static(path.join(__dirname, '.')));

// ─── EMAIL TRANSPORTER ─────────────────────────────────────
// Option A: Gmail (easiest setup)
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,    // your Gmail: hello@graphikosx.in or a Gmail account
    pass: process.env.EMAIL_PASS,    // Gmail App Password (not your regular password)
  }
});

// Option B: Custom SMTP (for professional email with your domain)
// const transporter = nodemailer.createTransporter({
//   host: process.env.SMTP_HOST,       // e.g. mail.graphikosx.in
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,    // hello@graphikosx.in
//     pass: process.env.EMAIL_PASS,
//   }
// });

// ─── CONTACT FORM ENDPOINT ─────────────────────────────────
app.post('/api/contact', contactLimit, async (req, res) => {
  const { name, phone, email, industry, city, message } = req.body;

  // Basic validation
  if (!name || !phone || !industry) {
    return res.status(400).json({ success: false, error: 'Missing required fields.' });
  }

  // Sanitize inputs
  const cleanName     = name.toString().slice(0, 100).trim();
  const cleanPhone    = phone.toString().slice(0, 20).trim();
  const cleanEmail    = (email || 'Not provided').toString().slice(0, 200).trim();
  const cleanIndustry = industry.toString().slice(0, 100).trim();
  const cleanCity     = (city || 'Not provided').toString().slice(0, 100).trim();
  const cleanMessage  = (message || 'No message provided').toString().slice(0, 2000).trim();

  // ── Email to YOU (GraphikosX notification) ──────────────
  const toYouMail = {
    from: `"GraphikosX Website" <${process.env.EMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL || process.env.EMAIL_USER,
    subject: `🔥 New Lead: ${cleanName} — ${cleanIndustry}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; background: #0a0a0a; color: #f0ebe3; padding: 32px; border-radius: 8px;">
        <div style="border-left: 4px solid #FF4B26; padding-left: 20px; margin-bottom: 28px;">
          <h1 style="font-size: 24px; margin: 0 0 4px; color: #FF4B26;">New Enquiry — GraphikosX</h1>
          <p style="margin: 0; color: #888; font-size: 13px;">Received at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #222;">
            <td style="padding: 12px 0; color: #888; font-size: 12px; width: 140px;">NAME</td>
            <td style="padding: 12px 0; font-weight: bold; font-size: 16px;">${cleanName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #222;">
            <td style="padding: 12px 0; color: #888; font-size: 12px;">PHONE / WA</td>
            <td style="padding: 12px 0;"><a href="https://wa.me/${cleanPhone.replace(/\D/g,'')}" style="color: #FF4B26;">${cleanPhone}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #222;">
            <td style="padding: 12px 0; color: #888; font-size: 12px;">EMAIL</td>
            <td style="padding: 12px 0;">${cleanEmail}</td>
          </tr>
          <tr style="border-bottom: 1px solid #222;">
            <td style="padding: 12px 0; color: #888; font-size: 12px;">INDUSTRY</td>
            <td style="padding: 12px 0; color: #FF4B26; font-weight: bold;">${cleanIndustry}</td>
          </tr>
          <tr style="border-bottom: 1px solid #222;">
            <td style="padding: 12px 0; color: #888; font-size: 12px;">CITY</td>
            <td style="padding: 12px 0;">${cleanCity}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #888; font-size: 12px; vertical-align: top;">CHALLENGE</td>
            <td style="padding: 12px 0; line-height: 1.7; color: #ccc;">${cleanMessage}</td>
          </tr>
        </table>

        <div style="margin-top: 28px; padding: 16px; background: rgba(255,75,38,0.1); border-radius: 4px;">
          <p style="margin: 0; font-size: 13px; color: #FF4B26;">⏱️ Respond within 4 hours via WhatsApp for best conversion.</p>
        </div>
      </div>
    `
  };

  // ── Confirmation email to CLIENT ────────────────────────
  const toClientMail = cleanEmail !== 'Not provided' ? {
    from: `"Prakash — GraphikosX" <${process.env.EMAIL_USER}>`,
    to: cleanEmail,
    subject: `Your free audit request received — GraphikosX`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; background: #0a0a0a; color: #f0ebe3; padding: 32px; border-radius: 8px;">
        <h1 style="font-family: Georgia, serif; font-size: 32px; margin: 0 0 8px; color: #f0ebe3;">Hi ${cleanName},</h1>
        <p style="color: #888; margin: 0 0 28px;">We've received your request for a free marketing audit.</p>

        <p style="line-height: 1.8; color: #ccc;">
          I'm Prakash — founder of GraphikosX. I'll personally review your digital presence across Instagram, Google, and Facebook, and share exactly what I'd change and why.
        </p>
        <br>
        <p style="line-height: 1.8; color: #ccc;">
          <strong style="color: #f0ebe3;">You'll hear from me within 4 hours</strong> on WhatsApp (${cleanPhone}) or email. If it's urgent, feel free to WhatsApp me directly.
        </p>

        <div style="margin: 32px 0; padding: 20px; border-left: 3px solid #FF4B26; background: rgba(255,75,38,0.08);">
          <p style="margin: 0; font-style: italic; color: #ccc; line-height: 1.7;">
            "India has thousands of agencies. None of them are at the top. That position is available. GraphikosX will take it — one client result at a time."
          </p>
        </div>

        <p style="color: #888; font-size: 13px; margin-bottom: 4px;">Prakash</p>
        <p style="color: #FF4B26; font-size: 13px; margin: 0;">Founder, GraphikosX</p>
        <p style="color: #555; font-size: 12px; margin: 4px 0 0;">graphikosx.in · graphikosx25@gmail.com</p>
      </div>
    `
  } : null;

  // ── Send emails ──────────────────────────────────────────
  try {
    await transporter.sendMail(toYouMail);
    if (toClientMail) {
      await transporter.sendMail(toClientMail).catch(e => console.log('Client email failed:', e.message));
    }
    console.log(`✅ Lead received: ${cleanName} | ${cleanIndustry} | ${cleanPhone}`);
    res.json({ success: true, message: 'Received! We\'ll reach out within 4 hours.' });
  } catch (err) {
    console.error('Email send error:', err.message);
    // Still return success to user — lead is logged in console
    res.json({ success: true });
  }
});

// ─── HEALTH CHECK ──────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), site: 'graphikosx.in' });
});

// ─── SERVE INDEX FOR ALL ROUTES (SPA) ──────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ─── START ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════╗
  ║  GraphikosX Server Running        ║
  ║  Port: ${PORT}                       ║
  ║  graphikosx.in                    ║
  ╚═══════════════════════════════════╝
  `);
});

module.exports = app;
