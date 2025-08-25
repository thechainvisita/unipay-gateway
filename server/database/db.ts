import sqlite3 from 'sqlite3';
import path from 'path';

const sqlite = sqlite3.verbose();
// For ts-node with CommonJS, use process.cwd() relative path
const dbPath = path.resolve(process.cwd(), 'server', 'database', 'unipay.db');

export const db = new sqlite.Database(dbPath, (err: Error | null) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Initialize database schema
export const initializeDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(
        `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('user', 'merchant')),
        created_at TEXT NOT NULL
      )`,
        (err: Error | null) => {
          if (err) {
            console.error('Error creating users table:', err);
            reject(err);
            return;
          }
        }
      );

      // Goods table
      db.run(
        `CREATE TABLE IF NOT EXISTS goods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        discount REAL DEFAULT 0,
        merchant TEXT NOT NULL,
        payment_method TEXT NOT NULL CHECK(payment_method IN ('fiat', 'crypto'))
      )`,
        (err: Error | null) => {
          if (err) {
            console.error('Error creating goods table:', err);
            reject(err);
            return;
          }
        }
      );

      // Cryptos table
      db.run(
        `CREATE TABLE IF NOT EXISTS cryptos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL UNIQUE,
        price REAL NOT NULL
      )`,
        (err: Error | null) => {
          if (err) {
            console.error('Error creating cryptos table:', err);
            reject(err);
            return;
          }
        }
      );

      // Cards table
      db.run(
        `CREATE TABLE IF NOT EXISTS cards (
        id TEXT PRIMARY KEY,
        holder_id TEXT NOT NULL,
        card_number TEXT NOT NULL,
        expiry TEXT NOT NULL,
        cvv TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (holder_id) REFERENCES users(id)
      )`,
        (err: Error | null) => {
          if (err) {
            console.error('Error creating cards table:', err);
            reject(err);
            return;
          }
        }
      );

      // Banks table
      db.run(
        `CREATE TABLE IF NOT EXISTS banks (
        id TEXT PRIMARY KEY,
        holder_id TEXT NOT NULL,
        bank_name TEXT NOT NULL,
        account_number TEXT NOT NULL,
        routing_number TEXT NOT NULL,
        account_holder_name TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (holder_id) REFERENCES users(id)
      )`,
        (err: Error | null) => {
          if (err) {
            console.error('Error creating banks table:', err);
            reject(err);
            return;
          }
        }
      );

      // Purchase history table
      db.run(
        `CREATE TABLE IF NOT EXISTS purchase_history (
        id TEXT PRIMARY KEY,
        user_email TEXT NOT NULL,
        item TEXT NOT NULL,
        amount_paid REAL NOT NULL,
        payment_method TEXT NOT NULL,
        points INTEGER DEFAULT 0,
        status TEXT DEFAULT 'Completed',
        merchant_name TEXT NOT NULL,
        created_at TEXT NOT NULL
      )`,
        (err: Error | null) => {
          if (err) {
            console.error('Error creating purchase_history table:', err);
            reject(err);
            return;
          }
        }
      );

      // Reward history table
      db.run(
        `CREATE TABLE IF NOT EXISTS reward_history (
        id TEXT PRIMARY KEY,
        user_email TEXT NOT NULL,
        tokens INTEGER NOT NULL,
        source TEXT NOT NULL,
        note TEXT,
        created_at TEXT NOT NULL
      )`,
        (err: Error | null) => {
          if (err) {
            console.error('Error creating reward_history table:', err);
            reject(err);
            return;
          }
          console.log('✅ Database tables initialized');
          resolve();
        }
      );
    });
  });
};

// Seed initial data
export const seedDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Check if goods already exist
      db.get('SELECT COUNT(*) as count FROM goods', (err: Error | null, row: { count: number } | undefined) => {
        if (err) {
          reject(err);
          return;
        }

        if (row && row.count === 0) {
          // Insert default goods
          const goods = [
            ['1-month membership', 100, 10, 'Demo Merchant', 'fiat'],
            ['1-month membership', 0.04, 10, 'Demo Merchant', 'crypto']
          ];

          const stmt = db.prepare('INSERT INTO goods (name, price, discount, merchant, payment_method) VALUES (?, ?, ?, ?, ?)');
          goods.forEach(good => {
            stmt.run(good);
          });
          stmt.finalize((err: Error | null) => {
            if (err) {
              console.error('Error seeding goods:', err);
            } else {
              console.log('✅ Seeded goods data');
            }
          });
        }

        // Check if cryptos already exist
        db.get('SELECT COUNT(*) as count FROM cryptos', (err: Error | null, row: { count: number } | undefined) => {
          if (err) {
            reject(err);
            return;
          }

          if (row && row.count === 0) {
            db.run('INSERT INTO cryptos (type, price) VALUES (?, ?)', ['ETH', 2500], (err: Error | null) => {
              if (err) {
                console.error('Error seeding cryptos:', err);
              } else {
                console.log('✅ Seeded cryptos data');
              }
              resolve();
            });
          } else {
            resolve();
          }
        });
      });
    });
  });
};

// Initialize database on startup (non-blocking)
// Delay initialization to ensure server starts first
setImmediate(() => {
  initializeDatabase()
    .then(() => {
      console.log('📦 Seeding database...');
      return seedDatabase();
    })
    .then(() => {
      console.log('✅ Database initialization complete');
    })
    .catch(err => {
      console.error('❌ Database initialization error:', err);
      // Don't crash the server if DB init fails
    });
});

export default db;

