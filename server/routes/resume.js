import { Router } from 'express';
import multer from 'multer';
import { readJson, writeJson, deleteJson } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const ALLOWED = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

function getResumeMeta(content) {
  return (
    content.profile?.resume || {
      available: false,
      fileName: null,
      originalName: null,
      uploadedAt: null,
    }
  );
}

// Files are small (5MB cap) so we keep them in memory just long enough to
// base64-encode them into Postgres — no disk writes, so nothing to lose on redeploy.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED.has(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error('Only PDF, DOC, or DOCX resumes are allowed'));
  },
});

router.get('/', async (_req, res) => {
  const content = await readJson('content.json', {});
  const meta = getResumeMeta(content);

  if (!meta.available) {
    return res.status(404).json({ error: 'Resume not uploaded yet' });
  }

  const file = await readJson('resume_file.json', null);
  if (!file?.dataBase64) {
    return res.status(404).json({ error: 'Resume file missing' });
  }

  const downloadName =
    meta.originalName ||
    `${(content.profile?.name || 'Resume').replace(/\s+/g, '_')}_Resume`;

  const buffer = Buffer.from(file.dataBase64, 'base64');
  res.set('Content-Type', file.mimeType || 'application/octet-stream');
  res.set('Content-Disposition', `attachment; filename="${downloadName}"`);
  res.send(buffer);
});

router.get('/status', async (_req, res) => {
  const content = await readJson('content.json', {});
  res.json(getResumeMeta(content));
});

router.post('/upload', requireAuth, (req, res) => {
  upload.single('resume')(req, res, async (err) => {
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

    const content = await readJson('content.json', {});
    if (!content.profile) content.profile = {};

    await writeJson('resume_file.json', {
      dataBase64: req.file.buffer.toString('base64'),
      mimeType: req.file.mimetype,
      originalName: req.file.originalname,
      size: req.file.size,
    });

    content.profile.resume = {
      available: true,
      fileName: `resume-${Date.now()}`,
      originalName: req.file.originalname,
      uploadedAt: new Date().toISOString(),
      size: req.file.size,
      mimeType: req.file.mimetype,
    };
    content.profile.resumeUrl = '/api/resume';
    await writeJson('content.json', content);

    res.json({ ok: true, resume: content.profile.resume, content });
  });
});

router.delete('/', requireAuth, async (req, res) => {
  const content = await readJson('content.json', {});

  await deleteJson('resume_file.json');

  if (!content.profile) content.profile = {};
  content.profile.resume = {
    available: false,
    fileName: null,
    originalName: null,
    uploadedAt: null,
  };
  content.profile.resumeUrl = '';
  await writeJson('content.json', content);

  res.json({ ok: true, content });
});

export default router;
