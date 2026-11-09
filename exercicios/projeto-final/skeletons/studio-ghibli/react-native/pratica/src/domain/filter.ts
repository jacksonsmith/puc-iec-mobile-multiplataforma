import type { Film } from './film';

type FilmFilters = {
  query?: string;
  director?: string | null;
};

const DIACRITICS = /[̀-ͯ]/g;

export function normalize(text: string): string {
  return text.normalize('NFD').replace(DIACRITICS, '').toLowerCase().trim();
}

export function filterFilms(films: Film[], { query = '', director = null }: FilmFilters): Film[] {
  const normalizedQuery = normalize(query);

  return films.filter((film) => {
    const matchesDirector = !director || film.director === director;
    const matchesQuery =
      normalize(film.title).includes(normalizedQuery) ||
      normalize(film.originalTitle).includes(normalizedQuery);

    return matchesDirector && matchesQuery;
  });
}
