import { useQuery } from '@tanstack/react-query';

import { fetchFilms } from '@/data/ghibli-api';

export const FILMS_QUERY_KEY = ['films'];

export function useFilms() {
  return useQuery({
    queryKey: FILMS_QUERY_KEY,
    queryFn: ({ signal }) => fetchFilms(signal),
  });
}
