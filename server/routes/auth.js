import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readJson, writeJson } from '../db.js';

const router = Router();

function ensureAdmin() {
  const existing = readJson('admin.json', null);
  if (existing?.passwordHash) return existing;

  const email = process.env.ADMIN_EMAIL || 'admin@portfolio.local';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const admin = {
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    updatedAt: new Date().toISOString(),
  };
  writeJson('admin.json', admin);
  return admin;
}

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const admin = ensureAdmin();
  const ok =
    email.toLowerCase() === String(admin.email).toLowerCase() &&
    bcrypt.compareSync(password, admin.passwordHash);

  if (!ok) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { email: admin.email, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '30m' }
  );

  res.json({ token, email: admin.email, expiresIn: '30m' });
});

router.get('/me', (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ email: payload.email, role: payload.role });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
