import fs from 'fs';
import path from 'path';
import { Router } from 'express';
import multer from 'multer';
import { readJson, writeJson, DATA_DIR } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');

const ALLOWED = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const EXT_BY_MIME = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
};

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

function getResumeMeta(content = readJson('content.json', {})) {
  return content.profile?.resume || {
    available: false,
    fileName: null,
    originalName: null,
    uploadedAt: null,
  };
}

function resumePath(fileName) {
  return path.join(UPLOAD_DIR, fileName);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureUploadDir();
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = EXT_BY_MIME[file.mimetype] || path.extname(file.originalname).toLowerCase() || '.pdf';
    cb(null, `resume${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED.has(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error('Only PDF, DOC, or DOCX resumes are allowed'));
  },
});

router.get('/', (req, res) => {
  const content = readJson('content.json', {});
  const meta = getResumeMeta(content);

  if (!meta.available || !meta.fileName) {
    return res.status(404).json({ error: 'Resume not uploaded yet' });
  }

  const file = resumePath(meta.fileName);
  if (!fs.existsSync(file)) {
    return res.status(404).json({ error: 'Resume file missing' });
  }

  const downloadName =
    meta.originalName ||
    `${(content.profile?.name || 'Resume').replace(/\s+/g, '_')}_Resume${path.extname(meta.fileName)}`;

  res.download(file, downloadName);
});

router.get('/status', (_req, res) => {
  res.json(getResumeMeta());
});

router.post('/upload', requireAuth, (req, res) => {
  upload.single('resume')(req, res, (err) => {
    if (err) {
      const message =
        err.code === 'LIMIT_FILE_SIZE'
          ? 'Resume must be 5MB or smaller'
          : err.message || 'Upload failed';
      return res.status(400).json({ error: message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Please choose a resume file' });
    }

    const content = readJson('content.json', {});
    if (!content.profile) content.profile = {};

    // Remove previous resume files with other extensions
    ensureUploadDir();
    for (const name of fs.readdirSync(UPLOAD_DIR)) {
      if (name.startsWith('resume') && name !== req.file.filename) {
        try {
          fs.unlinkSync(path.join(UPLOAD_DIR, name));
        } catch {
          /* ignore */
        }
      }
    }

    content.profile.resume = {
      available: true,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      uploadedAt: new Date().toISOString(),
      size: req.file.size,
      mimeType: req.file.mimetype,
    };
    content.profile.resumeUrl = '/api/resume';
    writeJson('content.json', content);

    res.json({ ok: true, resume: content.profile.resume, content });
  });
});

router.delete('/', requireAuth, (req, res) => {
  const content = readJson('content.json', {});
  const meta = getResumeMeta(content);

  if (meta.fileName) {
    const file = resumePath(meta.fileName);
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }

  if (!content.profile) content.profile = {};
  content.profile.resume = {
    available: false,
    fileName: null,
    originalName: null,
    uploadedAt: null,
  };
  content.profile.resumeUrl = '';
  writeJson('content.json', content);

  res.json({ ok: true, content });
});

export default router;
