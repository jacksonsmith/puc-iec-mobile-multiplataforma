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

// Options compartilhadas entre useQuery (MovieDetail/Favorites) e prefetchQuery (MovieCard),
// pra queryKey e staleTime nunca divergirem.
export const movieByIdQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['movie', id],
    queryFn: () => fetchMovieById(id),
    enabled: Number.isFinite(id),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

export const useMovieById = (id: number) => useQuery(movieByIdQueryOptions(id));
