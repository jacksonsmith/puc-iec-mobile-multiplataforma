// src/services/db.ts — IndexedDB via idb (sem React)

import { openDB } from 'idb';
import type { Movie } from '../types/movie';

const DB_NAME = 'tmdb-cache';
const DB_VERSION = 1;
const STORE = 'movies';

const getDB = () =>
  openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore(STORE);
    },
  });

export async function saveMovies(page: number, movies: Movie[]): Promise<void> {
  await (await getDB()).put(STORE, movies, `page-${page}`);
}

export async function loadMovies(page: number): Promise<Movie[] | undefined> {
  return (await getDB()).get(STORE, `page-${page}`);
}

export async function clearMovies(): Promise<void> {
  await (await getDB()).clear(STORE);
}
