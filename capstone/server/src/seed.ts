// Popula o banco com filmes + dois usuários de exemplo. Idempotente.
//   npm run seed
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { getDb, migrate, type MovieRow } from './db.js';
import { hashPassword } from './auth.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function seed(): void {
  const db = getDb();
  migrate(db);

  const movies: MovieRow[] = JSON.parse(
    readFileSync(join(__dirname, 'data', 'movies.json'), 'utf8'),
  );

  const upsertMovie = db.prepare(`
    INSERT INTO movies (id, title, overview, poster_path, release_date, vote_average)
    VALUES (@id, @title, @overview, @poster_path, @release_date, @vote_average)
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      overview = excluded.overview,
      poster_path = excluded.poster_path,
      release_date = excluded.release_date,
      vote_average = excluded.vote_average
  `);
  const insertMany = db.transaction((rows: MovieRow[]) => {
    for (const m of rows) upsertMovie.run(m);
  });
  insertMany(movies);

  const upsertUser = db.prepare(`
    INSERT INTO users (email, password_hash, name)
    VALUES (@email, @password_hash, @name)
    ON CONFLICT(email) DO NOTHING
  `);
  const users = [
    { email: 'ada@cinehub.dev', name: 'Ada Lovelace' },
    { email: 'alan@cinehub.dev', name: 'Alan Turing' },
  ];
  for (const u of users) {
    upsertUser.run({ ...u, password_hash: hashPassword('senha1234') });
  }

  const movieCount = (db.prepare('SELECT COUNT(*) AS n FROM movies').get() as { n: number }).n;
  const userCount = (db.prepare('SELECT COUNT(*) AS n FROM users').get() as { n: number }).n;
  console.log(`Seed OK — ${movieCount} filmes, ${userCount} usuários.`);
}

seed();
