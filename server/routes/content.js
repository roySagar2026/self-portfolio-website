import { Router } from 'express';
import { readJson, writeJson } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

async function getContent() {
  return readJson('content.json', {});
}

router.get('/', async (_req, res) => {
  res.json(await getContent());
});

router.put('/', requireAuth, async (req, res) => {
  const content = req.body;
  if (!content || typeof content !== 'object') {
    return res.status(400).json({ error: 'Invalid content payload' });
  }
  await writeJson('content.json', content);
  res.json({ ok: true, content });
});

router.patch('/', requireAuth, async (req, res) => {
  const current = await getContent();
  const next = { ...current, ...req.body };
  await writeJson('content.json', next);
  res.json({ ok: true, content: next });
});

export default router;
