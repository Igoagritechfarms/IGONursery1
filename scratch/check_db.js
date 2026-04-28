import { DatabaseSync } from 'node:sqlite';
import { DB_PATH } from '../server/config.js';

const db = new DatabaseSync(DB_PATH);
const customers = db.prepare('SELECT id, email, name, is_verified FROM customers').all();
console.log('CUSTOMERS:', JSON.stringify(customers, null, 2));

const pending = db.prepare('SELECT email, type, expires_at FROM pending_verifications').all();
console.log('PENDING VERIFICATIONS:', JSON.stringify(pending, null, 2));
