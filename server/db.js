import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('[db] DATABASE_URL is not set — reads/writes will fail until it is configured.');
}

export const pool = new Pool({
  connectionString,
  ssl: connectionString ? { rejectUnauthorized: false } : undefined,
});

let tableReady = null;

function ensureTable() {
  if (!tableReady) {
    tableReady = pool.query(`
      CREATE TABLE IF NOT EXISTS kv_store (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
  }
  return tableReady;
}

/**
 * Reads a JSON value by key. If the key doesn't exist yet, seeds it with
 * `fallback` and returns that instead — mirrors the old file-based behavior.
 */
export async function readJson(key, fallback) {
  await ensureTable();
  const { rows } = await pool.query('SELECT value FROM kv_store WHERE key = $1', [key]);
  if (rows.length === 0) {
    await writeJson(key, fallback);
    return structuredClone(fallback);
  }
  return rows[0].value;
}

export async function writeJson(key, data) {
  await ensureTable();
  await pool.query(
    `INSERT INTO kv_store (key, value, updated_at)
     VALUES ($1, $2::jsonb, now())
     ON CONFLICT (key) DO UPDATE SET value = $2::jsonb, updated_at = now()`,
    [key, JSON.stringify(data)]
  );
}

export async function deleteJson(key) {
  await ensureTable();
  await pool.query('DELETE FROM kv_store WHERE key = $1', [key]);
}
