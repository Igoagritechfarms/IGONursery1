import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'server', 'data', 'igo-nursery.db');

console.log('🔍 Connecting to DB:', DB_PATH);
const db = new DatabaseSync(DB_PATH);

try {
  const result = db.prepare(`
    UPDATE orders 
    SET customer_id = NULL 
    WHERE customer_id IS NOT NULL 
    AND customer_id NOT IN (SELECT id FROM customers)
  `).run();
  
  console.log('✅ Cleanup complete. Rows affected:', result.changes);
} catch (err) {
  console.error('❌ Cleanup failed:', err);
}
