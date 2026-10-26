// src/queries/movies/get-movie-by-id.ts
//
// CAMADA QUERIES — detalhe de 1 filme.
//
// Doc TanStack: https://tanstack.com/query/latest/docs/framework/react/guides/dependent-queries

import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Movie } from '@/types/movie';

const fetchMovieById = async (id: number) => {
  const res = await api.get<Movie>(`/movie/${id}`);
  return res.data;
};

// Opções compartilhadas: o mesmo objeto serve para useQuery, useQueries
// (aba Favoritos) e prefetchQuery (MovieCard), então todos usam o MESMO cache.
export const movieQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['movie', id],
    queryFn: () => fetchMovieById(id),
    enabled: Number.isFinite(id),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

export const useMovieById = (id: number) => useQuery(movieQueryOptions(id));
