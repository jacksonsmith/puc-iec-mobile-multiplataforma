// src/queries/movies/get-movie-by-id.ts
//
// CAMADA QUERIES: detalhe de 1 filme.
//
// Doc TanStack: https://tanstack.com/query/latest/docs/framework/react/guides/dependent-queries

import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { MovieDetails } from '@/types/movie';

const fetchMovieById = async (id: number) => {
  const res = await api.get<MovieDetails>(`/movie/${id}`);
  return res.data;
};

// Compartilhado entre MovieDetail (useQuery) e Favorites (useQueries): mesmo cache.
export const movieByIdQuery = (id: number) =>
  queryOptions({
    queryKey: ['movie', id],
    queryFn: () => fetchMovieById(id),
    enabled: Number.isFinite(id),
  });

export const useMovieById = (id: number) => useQuery(movieByIdQuery(id));
