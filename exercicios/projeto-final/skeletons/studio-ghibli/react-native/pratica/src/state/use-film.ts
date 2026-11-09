import { useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchFilm } from '@/data/ghibli-api';
import type { Film } from '@/domain/film';

import { FILMS_QUERY_KEY } from './use-films';

export function useFilm(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['film', id],
    queryFn: ({ signal }) => fetchFilm(id, signal),
    initialData: () =>
      queryClient.getQueryData<Film[]>(FILMS_QUERY_KEY)?.find((film) => film.id === id),
    initialDataUpdatedAt: () => queryClient.getQueryState(FILMS_QUERY_KEY)?.dataUpdatedAt,
  });
}
