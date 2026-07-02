import Database from 'better-sqlite3';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const DB_PATH = join(__dirname, '..', 'data', 'cinehub.db');

export type MovieRow = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
};

export type UserRow = {
  id: number;
  email: string;
  password_hash: string;
  name: string | null;
};

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  return db;
}

// Cria o schema (idempotente).
export function migrate(database: Database.Database = getDb()): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS movies (
      id            INTEGER PRIMARY KEY,
      title         TEXT NOT NULL,
      overview      TEXT NOT NULL,
      poster_path   TEXT,
      release_date  TEXT NOT NULL,
      vote_average  REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name          TEXT
    );

    CREATE TABLE IF NOT EXISTS favorites (
      user_id   INTEGER NOT NULL REFERENCES users(id),
      movie_id  INTEGER NOT NULL REFERENCES movies(id),
      PRIMARY KEY (user_id, movie_id)
    );

    CREATE TABLE IF NOT EXISTS lists (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      name      TEXT NOT NULL,
      owner_id  INTEGER NOT NULL REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS list_movies (
      list_id   INTEGER NOT NULL REFERENCES lists(id),
      movie_id  INTEGER NOT NULL REFERENCES movies(id),
      PRIMARY KEY (list_id, movie_id)
    );
  `);
}
