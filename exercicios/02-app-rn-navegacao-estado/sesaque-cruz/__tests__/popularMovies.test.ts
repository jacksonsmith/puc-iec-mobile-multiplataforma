// __tests__/popularMovies.test.ts
//
// Regras de paginação infinita dos filmes populares.

import { flattenUniqueMovies, getNextPopularPage } from '../src/queries/movies/get-popular-movies';
import type { Movie, MoviesResponse } from '../src/types/movie';

const movie = (id: number): Movie => ({
  id,
  title: `Filme ${id}`,
  overview: '',
  poster_path: null,
  release_date: '2026-01-01',
  vote_average: 7,
});

const page = (n: number, ids: number[], totalPages = 10): MoviesResponse => ({
  page: n,
  results: ids.map(movie),
  total_pages: totalPages,
  total_results: totalPages * 20,
});

describe('popular movies pagination', () => {
  test('getNextPopularPage avança até a última página', () => {
    expect(getNextPopularPage(page(1, [1], 3))).toBe(2);
    expect(getNextPopularPage(page(3, [1], 3))).toBeUndefined();
  });

  test('getNextPopularPage respeita o limite de 500 páginas da TMDB', () => {
    expect(getNextPopularPage(page(499, [1], 50000))).toBe(500);
    expect(getNextPopularPage(page(500, [1], 50000))).toBeUndefined();
  });

  test('flattenUniqueMovies junta as páginas sem repetir filmes', () => {
    const movies = flattenUniqueMovies([page(1, [1, 2, 3]), page(2, [3, 4])]);
    expect(movies.map((m) => m.id)).toEqual([1, 2, 3, 4]);
    expect(flattenUniqueMovies(undefined)).toEqual([]);
  });
});
