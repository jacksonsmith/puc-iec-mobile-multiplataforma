// src/services/tmdb.ts — chamadas TMDB sem React

import axios from 'axios';
import type { Movie, MoviesResponse } from '../types/movie';

const TOKEN = import.meta.env.VITE_TMDB_TOKEN as string | undefined;

export const isTokenMissing = !TOKEN || TOKEN === 'cole_seu_token_aqui';

export const posterUrl = (path: string | null) =>
  path ? `https://image.tmdb.org/t/p/w342${path}` : null;

// Cliente axios pré-configurado — baseURL e token já prontos
export const tmdbClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: { Authorization: `Bearer ${TOKEN}` },
});

// ── TODO 1 ─────────────────────────────────────────────────────────────────
// Implemente fetchPopularMovies usando tmdbClient.
//
// Endpoint: GET /movie/popular
// Params  : { language: 'pt-BR', page }
//
// Dica: const { data } = await tmdbClient.get<MoviesResponse>(...)
//       retorne data (MoviesResponse completo — o hook precisa de total_pages)
// ───────────────────────────────────────────────────────────────────────────

export async function fetchPopularMovies(page = 1): Promise<MoviesResponse> {
  // TODO 1: substitua o stub abaixo pela chamada real
  const { data } = await tmdbClient.get<MoviesResponse>('/movie/popular', {
    params: { language: 'pt-BR', page },
  });
  return data;
}
