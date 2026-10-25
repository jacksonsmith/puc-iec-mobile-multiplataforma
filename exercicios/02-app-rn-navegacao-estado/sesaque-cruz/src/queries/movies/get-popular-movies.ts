// src/queries/movies/get-popular-movies.ts
//
// CAMADA QUERIES: gerencia cache + ciclo de vida dos dados do servidor.
// "Como gerenciar o ciclo de vida dos dados"
//
// HANDS-ON AULA 2: Passo 4 (TanStack Query)
//
// Doc TanStack: https://tanstack.com/query/latest/docs/framework/react/overview
//
// Conceitos:
// - queryKey = identidade do cache (TanStack dedupe + invalidate por essa key)
// - queryFn = função pura que retorna Promise<dados>
// - staleTime = quanto tempo cache fica fresco antes de refetch background
//
// BÔNUS ATIVIDADE 2 (TASK 10): paginação infinita com useInfiniteQuery.

import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Movie, MoviesResponse } from '@/types/movie';

// A TMDB não serve páginas além da 500, mesmo quando total_pages é maior.
const TMDB_MAX_PAGE = 500;

const fetchPopularMovies = async (page = 1) => {
  const res = await api.get<MoviesResponse>('/movie/popular', { params: { page } });
  return res.data;
};

export const getNextPopularPage = (lastPage: MoviesResponse) =>
  lastPage.page < Math.min(lastPage.total_pages, TMDB_MAX_PAGE) ? lastPage.page + 1 : undefined;

// A ordem de popularidade muda entre requisições, então o mesmo filme pode
// aparecer em duas páginas. Remove repetidos pra não duplicar key na FlatList.
export const flattenUniqueMovies = (pages: MoviesResponse[] = []): Movie[] => {
  const seen = new Set<number>();
  return pages
    .flatMap((page) => page.results)
    .filter((movie) => (seen.has(movie.id) ? false : (seen.add(movie.id), true)));
};

export const usePopularMovies = () =>
  useInfiniteQuery({
    queryKey: ['movies', 'popular', 'infinite'],
    queryFn: ({ pageParam }) => fetchPopularMovies(pageParam),
    initialPageParam: 1,
    getNextPageParam: getNextPopularPage,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
