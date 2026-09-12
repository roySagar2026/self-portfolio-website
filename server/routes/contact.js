import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { readJson, writeJson } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages. Please try again later.' },
});

async function maybeSendEmail({ name, email, subject, message }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return { emailed: false, reason: 'SMTP not configured — message stored only' };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: CONTACT_FROM_EMAIL || SMTP_USER,
    to: CONTACT_TO_EMAIL || SMTP_USER,
    replyTo: email,
    subject: `[Portfolio] ${subject || 'New message'} — ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `
      <div style="font-family:sans-serif;background:#111;color:#e8e8e8;padding:24px;border-radius:8px">
        <h2 style="margin:0 0 12px;color:#fff">New portfolio message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || '(none)'}</p>
        <hr style="border-color:#333" />
        <p style="white-space:pre-wrap">${message}</p>
      </div>
    `,
  });

  return { emailed: true };
}

router.post('/', contactLimiter, async (req, res) => {
  const { name, email, subject, message } = req.body || {};

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    return res.status(400).json({ error: 'Please provide a valid email' });
  }

  if (String(message).length > 5000) {
    return res.status(400).json({ error: 'Message is too long' });
  }

  const entry = {
    id: uuidv4(),
    name: String(name).trim().slice(0, 120),
    email: String(email).trim().slice(0, 180),
    subject: String(subject || '').trim().slice(0, 200),
    message: String(message).trim(),
    read: false,
    createdAt: new Date().toISOString(),
  };

  const messages = readJson('messages.json', []);
  messages.unshift(entry);
  writeJson('messages.json', messages);

  try {
    const mail = await maybeSendEmail(entry);
    res.status(201).json({
      ok: true,
      id: entry.id,
      emailed: mail.emailed,
      note: mail.reason || null,
    });
  } catch (err) {
    console.error('Email send failed:', err.message);
    res.status(201).json({
      ok: true,
      id: entry.id,
      emailed: false,
      note: 'Message saved; email delivery failed',
    });
  }
});

router.get('/messages', requireAuth, (_req, res) => {
  const messages = readJson('messages.json', []);
  res.json(messages);
});

router.patch('/messages/:id/read', requireAuth, (req, res) => {
  const messages = readJson('messages.json', []);
  const idx = messages.findIndex((m) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Message not found' });
  messages[idx].read = true;
  writeJson('messages.json', messages);
  res.json(messages[idx]);
});

router.delete('/messages/:id', requireAuth, (req, res) => {
  const messages = readJson('messages.json', []);
  const next = messages.filter((m) => m.id !== req.params.id);
  if (next.length === messages.length) {
    return res.status(404).json({ error: 'Message not found' });
  }
  writeJson('messages.json', next);
  res.json({ ok: true });
});

export default router;
