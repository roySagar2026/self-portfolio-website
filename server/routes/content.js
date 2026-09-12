import { Router } from 'express';
import { readJson, writeJson } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const defaultContent = () => readJson('content.json', {});

router.get('/', (_req, res) => {
  res.json(defaultContent());
});

router.put('/', requireAuth, (req, res) => {
  const content = req.body;
  if (!content || typeof content !== 'object') {
    return res.status(400).json({ error: 'Invalid content payload' });
  }
  writeJson('content.json', content);
  res.json({ ok: true, content });
});

router.patch('/', requireAuth, (req, res) => {
  const current = defaultContent();
  const next = { ...current, ...req.body };
  writeJson('content.json', next);
  res.json({ ok: true, content: next });
});

export default router;
