import { QueryClient, useQuery, useQueries } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Movie } from '@/types/movie';

const fetchMovieById = async (id: number) => {
  const res = await api.get<Movie>(`/movie/${id}`);
  return res.data;
};

export const movieByIdQuery = (id: number) => ({
  queryKey: ['movie', id] as const,
  queryFn: () => fetchMovieById(id),
  staleTime: 1000 * 60 * 10,
});

export const useMovieById = (id: number) =>
  useQuery({ ...movieByIdQuery(id), enabled: Number.isFinite(id) });

export const useMoviesByIds = (ids: number[]) =>
  useQueries({ queries: ids.map((id) => movieByIdQuery(id)) });

export const prefetchMovieById = (queryClient: QueryClient, id: number) =>
  queryClient.prefetchQuery(movieByIdQuery(id));
