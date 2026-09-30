// src/queries/movies/get-popular-movies.ts
//
// CAMADA QUERIES — gerencia cache + ciclo de vida dos dados do servidor.
// "Como gerenciar o ciclo de vida dos dados"
//
// HANDS-ON AULA 2 — Passo 4 (TanStack Query)
//
// Doc TanStack: https://tanstack.com/query/latest/docs/framework/react/overview
//
// Conceitos:
// - queryKey = identidade do cache (TanStack dedupe + invalidate por essa key)
// - queryFn = função pura que retorna Promise<dados>
// - staleTime = quanto tempo cache fica fresco antes de refetch background

import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { MoviesResponse } from '@/types/movie';

const fetchPopularMovies = async (page = 1) => {
  const res = await api.get<MoviesResponse>('/movie/popular', { params: { page } });
  return res.data;
};

// Cada página tem sua própria entrada no cache (a page faz parte da key).
// staleTime de 5 min sobrescreve o padrão de 1 min do QueryClient (App.tsx):
// dentro dessa janela, voltar pra lista usa o cache sem nova request.
export const usePopularMovies = (page = 1) =>
  useQuery({
    queryKey: ['movies', 'popular', page],
    queryFn: () => fetchPopularMovies(page),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
