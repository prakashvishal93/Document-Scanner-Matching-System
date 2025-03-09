const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/database.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('✅ Database connected');
  }
});

db.serialize(() => {

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    credits INTEGER DEFAULT 20,
    role TEXT DEFAULT 'user',
    last_reset TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);


  db.run(`CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    filename TEXT,
    content TEXT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);


  db.run(`CREATE TABLE IF NOT EXISTS credit_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    requested_credits INTEGER,
    status TEXT DEFAULT 'pending',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);


  db.all("PRAGMA table_info(documents)", (err, columns) => {
    if (err) {
      console.error('Error checking table structure:', err);
      return;
    }

    const columnNames = columns.map(col => col.name);
    if (!columnNames.includes("extracted_text")) {
      db.run(`ALTER TABLE documents ADD COLUMN extracted_text TEXT`, (alterErr) => {
        if (alterErr) {
          console.error('Failed to add extracted_text column:', alterErr.message);
        } else {
          console.log('✅ Added extracted_text column to documents table');
        }
      });
    }
  });


  db.get("SELECT * FROM users WHERE username = ?", ['testuser'], (err, row) => {
    if (err) {
      console.error('Error checking for test user:', err.message);
      return;
    }

    if (!row) {
      db.run("INSERT INTO users (username, password) VALUES (?, ?)", ['testuser', 'testpass'], function (err) {
        if (err) {
          console.error('Error inserting test user:', err.message);
        } else {
          console.log('✅ Dummy user created: testuser / testpass');
          insertDummyDocument(this.lastID); 
        }
      });
    } else {
      console.log('ℹ️ Dummy user already exists');
      insertDummyDocument(row.id);
    }
  });


  function insertDummyDocument(userId) {
    const dummyText = "A story is a narrative describing a sequence of events or experiences. It can be real or imaginary and is usually told through speaking, writing, or other media.";
    const dummyAnalysis = "A story is a narrative describing a sequence of events or experiences. It can be real or imaginary and is usually told through speaking, writing, or other media.";

    db.get("SELECT * FROM documents WHERE filename = ?", ['story_example.txt'], (err, row) => {
      if (err) {
        console.error('Error checking for dummy document:', err.message);
        return;
      }

      if (!row) {
        db.run(`
          INSERT INTO documents (user_id, filename, content, extracted_text)
          VALUES (?, ?, ?, ?)
        `, [userId, 'story_example.txt', dummyText, dummyAnalysis], function (err) {
          if (err) {
            console.error('❌ Failed to insert dummy document:', err.message);
          } else {
            console.log('✅ Dummy document inserted with ID:', this.lastID);
          }
        });
      } else {
        console.log('ℹ️ Dummy document already exists');
      }
    });
  }
});

module.exports = db;
