import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabaseAsync('dev.db');

export async function initDB() {

  (await db).execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY ,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS budgets (
      bdgtId INTEGER PRIMARY KEY ,
      bdgtName TEXT NOT NULL,
      userId INTEGER NOT NULL,
      bdgtAmount REAL NOT NULL,
      bdgtCapacity REAL NOT NULL,
      startDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      endDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS categories (
      categId INTEGER PRIMARY KEY ,
      userId INTEGER NOT NULL,
      categName TEXT NOT NULL,
      categColor TEXT NOT NULL,
      categIcon TEXT NOT NULL,
      FOREIGN KEY(userId) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS transactions (
      transId INTEGER PRIMARY KEY ,
      userId INTEGER NOT NULL,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT,
      transDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      transCreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      transRecurrence TEXT DEFAULT 'Once-0',
      categId INTEGER,
      bdgtId INTEGER,
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(categId) REFERENCES categories(categId),
      FOREIGN KEY (bdgtId) REFERENCES budgets(bdgtId)
    );
  `).catch((err) => {
    console.log(err);
  });
  console.log('DB initialized');
}

export async function dropDB() {

  (await db).execAsync(`
PRAGMA writable_schema = 1;
DELETE FROM sqlite_master;
PRAGMA writable_schema = 0;
VACUUM;
PRAGMA integrity_check;
  `).catch((err) => {
    console.log(err);
  });
  console.log('All tables dropped');
}