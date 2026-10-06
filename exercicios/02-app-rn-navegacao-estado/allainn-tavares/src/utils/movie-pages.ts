// src/utils/movie-pages.ts
//
// Funções puras da paginação (bonus: paginação infinita).
// Ficam fora do arquivo da query para poderem ser testadas sem axios/rede.

import type { Movie, MoviesResponse } from '@/types/movie';

// O TMDB informa total_pages bem acima de 500, mas recusa page > 500
// ("Invalid page: Pages start at 1 and max at 500").
export const TMDB_MAX_PAGE = 500;

// Próxima página a buscar, ou undefined quando acabou.
// Para o useInfiniteQuery, undefined = hasNextPage false.
export const getNextPage = (last: MoviesResponse): number | undefined => {
  const lastPage = Math.min(last.total_pages, TMDB_MAX_PAGE);
  return last.page < lastPage ? last.page + 1 : undefined;
};

// Junta as páginas numa lista só, sem filmes repetidos.
// A ordem de "populares" muda enquanto o usuário rola: um filme pode subir
// ou descer e aparecer em duas páginas. Id repetido quebra a key da FlatList.
export const flattenUniqueMovies = (pages: MoviesResponse[] | undefined): Movie[] => {
  if (!pages) return [];
  const seen = new Set<number>();
  const movies: Movie[] = [];
  for (const page of pages) {
    for (const movie of page.results) {
      if (seen.has(movie.id)) continue;
      seen.add(movie.id);
      movies.push(movie);
    }
  }
  return movies;
};
