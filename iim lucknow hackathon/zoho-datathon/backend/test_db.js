const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'test.db');
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON;');
  
  const schemaPath = path.join(__dirname, '../database/sqlite_schema.sql');
  console.log('Reading schema from:', schemaPath);
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  
  db.exec(schemaSql, (err) => {
    if (err) {
      console.error('Schema initialization failed:', err);
    } else {
      console.log('Schema initialization successful!');
      
      db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, rows) => {
        if (err) {
          console.error('Failed to retrieve tables:', err);
        } else {
          console.log('Created tables:', rows.map(r => r.name));
        }
        db.close();
        if (fs.existsSync(dbPath)) {
          fs.unlinkSync(dbPath);
        }
      });
    }
  });
});
