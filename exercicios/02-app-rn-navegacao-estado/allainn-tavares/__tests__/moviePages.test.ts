// __tests__/moviePages.test.ts
//
// BONUS — paginação infinita: testes das funções puras usadas pelo
// useInfiniteQuery (getNextPage) e pela MovieList (flattenUniqueMovies).
// Gerados com auxílio de IA (Claude) e revisados.

import { flattenUniqueMovies, getNextPage, TMDB_MAX_PAGE } from '../src/utils/movie-pages';
import type { Movie, MoviesResponse } from '../src/types/movie';

const movie = (id: number): Movie => ({
  id,
  title: `Filme ${id}`,
  overview: '',
  poster_path: null,
  release_date: '2026-01-01',
  vote_average: 7,
});

const page = (n: number, ids: number[], totalPages = 3): MoviesResponse => ({
  page: n,
  results: ids.map(movie),
  total_pages: totalPages,
  total_results: totalPages * 20,
});

describe('getNextPage', () => {
  test('devolve a página seguinte enquanto não chegou na última', () => {
    expect(getNextPage(page(1, [1], 3))).toBe(2);
  });

  test('devolve undefined na última página (hasNextPage = false)', () => {
    expect(getNextPage(page(3, [1], 3))).toBeUndefined();
  });

  test('para no limite de 500 do TMDB mesmo com total_pages maior', () => {
    expect(getNextPage(page(TMDB_MAX_PAGE - 1, [1], 50000))).toBe(TMDB_MAX_PAGE);
    expect(getNextPage(page(TMDB_MAX_PAGE, [1], 50000))).toBeUndefined();
  });
});

describe('flattenUniqueMovies', () => {
  test('sem páginas devolve lista vazia', () => {
    expect(flattenUniqueMovies(undefined)).toEqual([]);
    expect(flattenUniqueMovies([])).toEqual([]);
  });

  test('junta as páginas na ordem em que chegaram', () => {
    const ids = flattenUniqueMovies([page(1, [1, 2]), page(2, [3, 4])]).map((m) => m.id);
    expect(ids).toEqual([1, 2, 3, 4]);
  });

  test('remove filme repetido entre páginas, mantendo a 1ª ocorrência', () => {
    const ids = flattenUniqueMovies([page(1, [1, 2, 3]), page(2, [3, 4])]).map((m) => m.id);
    expect(ids).toEqual([1, 2, 3, 4]);
  });
});
