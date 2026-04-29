const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('server/data/igo-nursery.db');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', JSON.stringify(tables));

for (const table of tables) {
    const schema = db.prepare(`SELECT sql FROM sqlite_master WHERE name='${table.name}'`).get();
    console.log(`\nSchema for ${table.name}:`);
    console.log(schema.sql);
}
