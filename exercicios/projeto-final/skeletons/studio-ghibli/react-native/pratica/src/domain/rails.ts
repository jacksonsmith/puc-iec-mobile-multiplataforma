import type { Film } from './film';

export type Rail = {
  slug: string;
  title: string;
  films: Film[];
};

const ACCLAIMED_LIMIT = 10;

const DECADES = [
  { slug: '1980s', title: 'Anos 80', from: 1980, to: 1989 },
  { slug: '1990s', title: 'Anos 90', from: 1990, to: 1999 },
  { slug: '2000s', title: 'Anos 2000', from: 2000, to: 2009 },
  { slug: '2010s', title: 'De 2010 em diante', from: 2010, to: Infinity },
];

function getFavoriteFilms(films: Film[], favoriteIds: string[]): Film[] {
  return favoriteIds.flatMap((id) => films.filter((film) => film.id === id));
}

function getAcclaimedFilms(films: Film[]): Film[] {
  return [...films].sort((a, b) => b.rtScore - a.rtScore).slice(0, ACCLAIMED_LIMIT);
}

function getDecadeRails(films: Film[]): Rail[] {
  return DECADES.map(({ slug, title, from, to }) => ({
    slug,
    title,
    films: films
      .filter((film) => film.releaseYear >= from && film.releaseYear <= to)
      .sort((a, b) => a.releaseYear - b.releaseYear),
  })).filter((rail) => rail.films.length > 0);
}

export function buildRails(
  films: Film[],
  favoriteIds: string[],
  director: string | null = null,
): Rail[] {
  const visibleFilms = director ? films.filter((film) => film.director === director) : films;
  const acclaimedFilms = getAcclaimedFilms(visibleFilms);

  return [
    {
      slug: 'favorites',
      title: 'Seus favoritos',
      films: getFavoriteFilms(visibleFilms, favoriteIds),
    },
    ...(acclaimedFilms.length > 0
      ? [{ slug: 'acclaimed', title: 'Mais aclamados', films: acclaimedFilms }]
      : []),
    ...getDecadeRails(visibleFilms),
  ];
}
