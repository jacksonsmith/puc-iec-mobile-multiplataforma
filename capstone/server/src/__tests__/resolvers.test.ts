import { describe, it, expect, beforeAll } from 'vitest';
import Database from 'better-sqlite3';
import { migrate } from '../db.js';
import { resolvers } from '../resolvers.js';
import { hashPassword } from '../auth.js';
import type { Context } from '../context.js';

// Banco em memória isolado por suíte — não toca o cinehub.db real.
let db: Database.Database;

function ctx(userId: number | null = null): Context {
  return { db, userId };
}

beforeAll(() => {
  db = new Database(':memory:');
  migrate(db);
  db.prepare(
    `INSERT INTO movies (id,title,overview,poster_path,release_date,vote_average)
     VALUES (1,'Matrix','...','/m.jpg','1999-03-31',8.2),
            (2,'A Origem','...','/o.jpg','2010-07-15',8.4)`,
  ).run();
  db.prepare('INSERT INTO users (id,email,password_hash,name) VALUES (1,?,?,?)').run(
    'ada@cinehub.dev',
    hashPassword('senha1234'),
    'Ada',
  );
});

describe('Query', () => {
  it('1. popularMovies pagina e ordena por nota', () => {
    const page = resolvers.Query.popularMovies({}, { page: 1, pageSize: 1 }, ctx());
    expect(page.totalResults).toBe(2);
    expect(page.results[0].title).toBe('A Origem');
  });

  it('2. searchMovies casa por título (case-insensitive)', () => {
    const res = resolvers.Query.searchMovies({}, { query: 'matrix' }, ctx());
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe(1);
  });

  it('3. myFavorites exige autenticação', () => {
    expect(() => resolvers.Query.myFavorites({}, {}, ctx(null))).toThrow();
  });
});

describe('Mutation', () => {
  it('4. login válido retorna token', () => {
    const out = resolvers.Mutation.login(
      {},
      { email: 'ada@cinehub.dev', password: 'senha1234' },
      ctx(),
    );
    expect(out.token).toBeTruthy();
    expect(out.user.email).toBe('ada@cinehub.dev');
  });

  it('5. login inválido lança', () => {
    expect(() =>
      resolvers.Mutation.login({}, { email: 'ada@cinehub.dev', password: 'errada' }, ctx()),
    ).toThrow();
  });

  it('6. addFavorite + myFavorites refletem o favorito', () => {
    resolvers.Mutation.addFavorite({}, { movieId: 1 }, ctx(1));
    const favs = resolvers.Query.myFavorites({}, {}, ctx(1));
    expect(favs.map((m) => m.id)).toContain(1);
  });
});
