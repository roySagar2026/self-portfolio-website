import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { writeJson } from './db.js';

dotenv.config();

const email = process.env.ADMIN_EMAIL || 'admin@portfolio.local';
const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
const hash = bcrypt.hashSync(password, 10);

await writeJson('admin.json', {
  email,
  passwordHash: hash,
  updatedAt: new Date().toISOString(),
});

console.log('Admin seeded:');
console.log(`  email: ${email}`);
console.log(`  password: (from .env ADMIN_PASSWORD)`);

process.exit(0);
