import type Database from 'better-sqlite3';
import { getDb } from './db.js';
import { verifyToken } from './auth.js';

export type Context = {
  db: Database.Database;
  userId: number | null;
};

// Monta o contexto por request: resolve o usuário a partir do header Authorization: Bearer <token>.
export function buildContext(authHeader?: string): Context {
  let userId: number | null = null;
  if (authHeader?.startsWith('Bearer ')) {
    const payload = verifyToken(authHeader.slice('Bearer '.length).trim());
    userId = payload?.userId ?? null;
  }
  return { db: getDb(), userId };
}

export function requireUser(ctx: Context): number {
  if (ctx.userId == null) {
    throw new Error('NÃO AUTENTICADO: esta operação exige um token válido.');
  }
  return ctx.userId;
}
