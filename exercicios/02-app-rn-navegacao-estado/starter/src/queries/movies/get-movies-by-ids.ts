// src/queries/movies/get-movies-by-ids.ts
//
// CAMADA QUERIES — busca vários filmes por id (usado na aba Favoritos).
//
// Usa a MESMA queryKey de useMovieById (['movie', id]): se o usuário já abriu o
// detalhe de um filme, o TanStack Query reaproveita o cache em vez de refazer a request.

import { useQueries } from '@tanstack/react-query';
import type { Movie } from '@/types/movie';
import { fetchMovieById } from './get-movie-by-id';

export const useMoviesByIds = (ids: number[]) => {
  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['movie', id],
      queryFn: () => fetchMovieById(id),
      staleTime: 1000 * 60 * 5, // 5 minutos
    })),
  });

  return {
    movies: results.map((r) => r.data).filter((m): m is Movie => !!m),
    isLoading: results.some((r) => r.isLoading),
    error: results.find((r) => r.error)?.error ?? null,
  };
};
