import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { readJson, writeJson } from './db.js';
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import contactRoutes from './routes/contact.js';
import resumeRoutes from './routes/resume.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

function parseOrigins() {
  const raw = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function ensureAdminSeed() {
  const existing = readJson('admin.json', null);
  const email = process.env.ADMIN_EMAIL || 'admin@portfolio.local';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const force = String(process.env.RESEED_ADMIN || '').toLowerCase() === 'true';

  if (existing?.passwordHash && !force) return;

  writeJson('admin.json', {
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    updatedAt: new Date().toISOString(),
  });
  console.log(`Admin account ${force ? 're-seeded' : 'ready'} → ${email}`);
}

ensureAdminSeed();

const allowedOrigins = parseOrigins();

app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin / server-to-server / mobile webviews with no Origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // In production full-stack (same host), browser Origin matches the API host
      if (isProd && allowedOrigins.length === 0) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'portfolio-api',
    env: isProd ? 'production' : 'development',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/resume', resumeRoutes);

if (isProd) {
  const dist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(dist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(dist, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  if (String(err?.message || '').startsWith('CORS blocked')) {
    return res.status(403).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on port ${PORT} (${isProd ? 'production' : 'development'})`);
  if (!isProd) {
    console.log(`Allowed client origins: ${allowedOrigins.join(', ') || '(none)'}`);
  }
});
