// src/queries/movies/get-movie-by-id.ts
//
// CAMADA QUERIES — detalhe de 1 filme.
//
// Doc TanStack: https://tanstack.com/query/latest/docs/framework/react/guides/dependent-queries

import { QueryClient, useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Movie } from '@/types/movie';

const fetchMovieById = async (id: number) => {
  const res = await api.get<Movie>(`/movie/${id}`);
  return res.data;
};

const MOVIE_QUERY_KEY = 'movie';

export const useMovieById = (id: number) =>
  useQuery({
    queryKey: [MOVIE_QUERY_KEY, id],
    queryFn: () => fetchMovieById(id),
    enabled: Number.isFinite(id),
  });

export const prefetchMovieById = (queryClient: QueryClient, id: number) =>
  queryClient.prefetchQuery({
    queryKey: [MOVIE_QUERY_KEY, id],
    queryFn: () => fetchMovieById(id),
  });