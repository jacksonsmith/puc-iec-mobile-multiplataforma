// src/queries/movies/get-movie-by-id.ts
//
// CAMADA QUERIES — detalhe de 1 filme.
//
// Doc TanStack: https://tanstack.com/query/latest/docs/framework/react/guides/dependent-queries

import { QueryClient, useQuery, useQueries } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Movie } from '@/types/movie';

const fetchMovieById = async (id: number) => {
  const res = await api.get<Movie>(`/movie/${id}`);
  return res.data;
};

// Mesma config usada por useQuery, useQueries e prefetch → todos compartilham o cache.
export const movieByIdQuery = (id: number) => ({
  queryKey: ['movie', id] as const,
  queryFn: () => fetchMovieById(id),
  staleTime: 1000 * 60 * 10, // detalhe muda pouco: 10 min
});

export const useMovieById = (id: number) =>
  useQuery({ ...movieByIdQuery(id), enabled: Number.isFinite(id) });

// Bonus: aba Favoritos busca N filmes em paralelo (só temos os ids no store).
export const useMoviesByIds = (ids: number[]) =>
  useQueries({ queries: ids.map((id) => movieByIdQuery(id)) });

// Bonus: dispara o fetch do detalhe ANTES de navegar → tela abre com cache quente.
export const prefetchMovieById = (queryClient: QueryClient, id: number) =>
  queryClient.prefetchQuery(movieByIdQuery(id));
