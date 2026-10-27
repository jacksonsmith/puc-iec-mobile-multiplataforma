import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { MoviesResponse } from '@/types/movie';

const fetchPopularMovies = async (page = 1) => {
  const res = await api.get<MoviesResponse>('/movie/popular', { params: { page } });
  return res.data;
};

export const usePopularMovies = (page = 1) =>
  useQuery({
    queryKey: ['movies', 'popular', page],
    queryFn: () => fetchPopularMovies(page),
    staleTime: 1000 * 60 * 5,
  });
