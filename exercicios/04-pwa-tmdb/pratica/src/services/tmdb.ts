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

// Simulador de offline — usado pelo NetworkToggle (só em dev)
// Persiste em sessionStorage pra sobreviver ao reload
const OFFLINE_KEY = 'dev:simulate-offline';
let _simulateOffline = sessionStorage.getItem(OFFLINE_KEY) === 'true';

export const setSimulateOffline = (v: boolean) => {
  _simulateOffline = v;
  sessionStorage.setItem(OFFLINE_KEY, String(v));
};
export const isSimulatingOffline = () => _simulateOffline;

tmdbClient.interceptors.request.use((config) => {
  if (_simulateOffline) throw new Error('Rede desligada (simulado)');
  return config;
});

// TODO 1 — GET /movie/popular?language=pt-BR&page=N.
// O axios monta a query string a partir de `params`; o token e a baseURL já vêm do tmdbClient.
// Retorna só o `data` (o corpo JSON): quem chama não precisa saber que existe axios.
// Erros (401 de token inválido, falta de rede) sobem para o repositório decidir o fallback.
export async function fetchPopularMovies(page = 1): Promise<MoviesResponse> {
  const { data } = await tmdbClient.get<MoviesResponse>('/movie/popular', {
    params: { language: 'pt-BR', page },
  });
  return data;
}
