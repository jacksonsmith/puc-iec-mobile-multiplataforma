// src/queries/movies/get-popular-movies.ts
//
// CAMADA QUERIES — gerencia cache + ciclo de vida dos dados do servidor.
// "Como gerenciar o ciclo de vida dos dados"
//
// HANDS-ON AULA 2 — Passo 4 (TanStack Query)
// BONUS ATIVIDADE 2 — paginação infinita com useInfiniteQuery
//
// Doc TanStack: https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries
//
// Conceitos:
// - queryKey = identidade do cache (TanStack dedupe + invalidate por essa key)
// - queryFn = função pura que retorna Promise<dados>; aqui recebe a página em pageParam
// - staleTime = quanto tempo cache fica fresco antes de refetch background
// - getNextPageParam = olha a última página e diz qual é a próxima (undefined = acabou)

import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { MoviesResponse } from '@/types/movie';
import { getNextPage } from '@/utils/movie-pages';

const fetchPopularMovies = async (page = 1) => {
  const res = await api.get<MoviesResponse>('/movie/popular', { params: { page } });
  return res.data;
};

// Uma entrada só no cache para a lista toda: data.pages guarda as páginas
// já carregadas, em ordem. fetchNextPage() busca a próxima e anexa no fim.
// staleTime de 5 min sobrescreve o padrão de 1 min do QueryClient (App.tsx):
// dentro dessa janela, voltar pra lista usa o cache sem nova request.
export const usePopularMovies = () =>
  useInfiniteQuery({
    queryKey: ['movies', 'popular'],
    queryFn: ({ pageParam }) => fetchPopularMovies(pageParam),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
