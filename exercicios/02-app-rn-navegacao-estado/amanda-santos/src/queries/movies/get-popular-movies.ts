import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { demoMode, demoMovies } from '@/services/demo';
import type { MoviesResponse } from '@/types/movie';
export const usePopularMovies = (page = 1) => useQuery({
 queryKey: ['movies', 'popular', page, demoMode],
 queryFn: async (): Promise<MoviesResponse> => demoMode
 ? {page: 1, results: demoMovies, total_pages: 1, total_results: demoMovies.length}
 : (await api.get<MoviesResponse>('/movie/popular', {params: {page}})).data,
 staleTime: 1000 * 60 * 5,
});
