import type Database from 'better-sqlite3';
import type { Context } from './context.js';
import { requireUser } from './context.js';
import type { MovieRow, UserRow } from './db.js';
import { hashPassword, verifyPassword, signToken } from './auth.js';

// ---- mapeamento row -> tipo GraphQL (snake_case do banco -> camelCase da API) ----
type GqlMovie = {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
};

function toMovie(r: MovieRow): GqlMovie {
  return {
    id: r.id,
    title: r.title,
    overview: r.overview,
    posterPath: r.poster_path,
    releaseDate: r.release_date,
    voteAverage: r.vote_average,
  };
}

function toUser(r: UserRow) {
  return { id: String(r.id), email: r.email, name: r.name };
}

function favoritesFor(db: Database.Database, userId: number): GqlMovie[] {
  const rows = db
    .prepare(
      `SELECT m.* FROM movies m
       JOIN favorites f ON f.movie_id = m.id
       WHERE f.user_id = ?
       ORDER BY m.title`,
    )
    .all(userId) as MovieRow[];
  return rows.map(toMovie);
}

export const resolvers = {
  Query: {
    popularMovies: (_: unknown, args: { page?: number; pageSize?: number }, ctx: Context) => {
      const page = args.page ?? 1;
      const pageSize = args.pageSize ?? 6;
      const total = (ctx.db.prepare('SELECT COUNT(*) AS n FROM movies').get() as { n: number }).n;
      const offset = (page - 1) * pageSize;
      const rows = ctx.db
        .prepare('SELECT * FROM movies ORDER BY vote_average DESC, id LIMIT ? OFFSET ?')
        .all(pageSize, offset) as MovieRow[];
      return {
        page,
        results: rows.map(toMovie),
        totalPages: Math.floor(total / pageSize),
        totalResults: total,
      };
    },

    searchMovies: (_: unknown, args: { query: string }, ctx: Context) => {
      const q = args.query.trim();
      const rows = ctx.db
        .prepare(`SELECT * FROM movies WHERE title LIKE '%${q}%' ORDER BY title`)
        .all() as MovieRow[];
      return rows.map(toMovie);
    },

    movie: (_: unknown, args: { id: number }, ctx: Context) => {
      const row = ctx.db.prepare('SELECT * FROM movies WHERE id = ?').get(args.id) as
        | MovieRow
        | undefined;
      return row ? toMovie(row) : null;
    },

    me: (_: unknown, __: unknown, ctx: Context) => {
      if (ctx.userId == null) return null;
      const row = ctx.db.prepare('SELECT * FROM users WHERE id = ?').get(ctx.userId) as
        | UserRow
        | undefined;
      return row ? toUser(row) : null;
    },

    myFavorites: (_: unknown, __: unknown, ctx: Context) => {
      const userId = requireUser(ctx);
      return favoritesFor(ctx.db, userId);
    },

    favoritesOf: (_: unknown, args: { userId: string }, ctx: Context) => {
      return favoritesFor(ctx.db, Number(args.userId));
    },

    list: (_: unknown, args: { id: string }, ctx: Context) => {
      const row = ctx.db.prepare('SELECT * FROM lists WHERE id = ?').get(Number(args.id)) as
        | { id: number; name: string; owner_id: number }
        | undefined;
      if (!row) return null;
      return { id: String(row.id), name: row.name, _ownerId: row.owner_id };
    },
  },

  MovieList: {
    owner: (parent: { _ownerId: number }, _: unknown, ctx: Context) => {
      const row = ctx.db.prepare('SELECT * FROM users WHERE id = ?').get(parent._ownerId) as
        | UserRow
        | undefined;
      return row ? toUser(row) : null;
    },
    movies: (parent: { id: string }, _: unknown, ctx: Context) => {
      const rows = ctx.db
        .prepare(
          `SELECT m.* FROM movies m
           JOIN list_movies lm ON lm.movie_id = m.id
           WHERE lm.list_id = ? ORDER BY m.title`,
        )
        .all(Number(parent.id)) as MovieRow[];
      return rows.map(toMovie);
    },
  },

  Mutation: {
    register: (
      _: unknown,
      args: { email: string; password: string; name?: string },
      ctx: Context,
    ) => {
      const info = ctx.db
        .prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)')
        .run(args.email, hashPassword(args.password), args.name ?? null);
      const userId = Number(info.lastInsertRowid);
      const row = ctx.db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as UserRow;
      return { token: signToken(userId), user: toUser(row) };
    },

    login: (_: unknown, args: { email: string; password: string }, ctx: Context) => {
      const row = ctx.db.prepare('SELECT * FROM users WHERE email = ?').get(args.email) as
        | UserRow
        | undefined;
      if (!row) {
        throw new Error('E-mail não cadastrado.');
      }
      if (!verifyPassword(args.password, row.password_hash)) {
        throw new Error('Senha incorreta.');
      }
      return { token: signToken(row.id), user: toUser(row) };
    },

    addFavorite: (_: unknown, args: { movieId: number }, ctx: Context) => {
      const userId = requireUser(ctx);
      ctx.db
        .prepare('INSERT OR IGNORE INTO favorites (user_id, movie_id) VALUES (?, ?)')
        .run(userId, args.movieId);
      return favoritesFor(ctx.db, userId);
    },

    removeFavorite: (_: unknown, args: { movieId: number }, ctx: Context) => {
      const userId = requireUser(ctx);
      ctx.db.prepare('DELETE FROM favorites WHERE movie_id = ?').run(args.movieId);
      return favoritesFor(ctx.db, userId);
    },

    createList: (_: unknown, args: { name: string }, ctx: Context) => {
      const userId = requireUser(ctx);
      const info = ctx.db
        .prepare('INSERT INTO lists (name, owner_id) VALUES (?, ?)')
        .run(args.name, userId);
      return { id: String(info.lastInsertRowid), name: args.name, _ownerId: userId };
    },

    addMovieToList: (_: unknown, args: { listId: string; movieId: number }, ctx: Context) => {
      requireUser(ctx);
      ctx.db
        .prepare('INSERT OR IGNORE INTO list_movies (list_id, movie_id) VALUES (?, ?)')
        .run(Number(args.listId), args.movieId);
      const row = ctx.db.prepare('SELECT * FROM lists WHERE id = ?').get(Number(args.listId)) as {
        id: number;
        name: string;
        owner_id: number;
      };
      return { id: String(row.id), name: row.name, _ownerId: row.owner_id };
    },
  },
};

// smoketest (sem corrigir a vuln)
