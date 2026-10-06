import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Movie, MoviesResponse } from '../types/movie';

export const usePopularMovies = () =>
    useQuery({
        queryKey: ['movies', 'popular'],
        queryFn: async () => (await api.get<MoviesResponse>('/movie/popular')).data,
        staleTime: 5 * 60 * 1000,
    });

export const useMovieById = (id: number) =>
    useQuery({
        queryKey: ['movies', 'detail', id],
        queryFn: async () => (await api.get<Movie>(`/movie/${id}`)).data,
        enabled: Number.isInteger(id),
        staleTime: 5 * 60 * 1000,
    });
