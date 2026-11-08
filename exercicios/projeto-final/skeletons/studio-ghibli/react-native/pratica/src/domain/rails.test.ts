import { describe, expect, it } from 'vitest';

import type { Film } from './film';
import { buildRails } from './rails';

function makeFilm(overrides: Partial<Film>): Film {
  return {
    id: 'id',
    title: 'Film',
    originalTitle: '映画',
    director: 'Hayao Miyazaki',
    producer: 'Toshio Suzuki',
    releaseYear: 2001,
    runningTimeMin: 120,
    rtScore: 90,
    description: '',
    imageUrl: '',
    bannerUrl: '',
    ...overrides,
  };
}

const totoro = makeFilm({ id: 'totoro', releaseYear: 1988, rtScore: 93 });
const grave = makeFilm({
  id: 'grave',
  releaseYear: 1988,
  rtScore: 97,
  director: 'Isao Takahata',
});
const spirited = makeFilm({ id: 'spirited', releaseYear: 2001, rtScore: 97 });
const marnie = makeFilm({ id: 'marnie', releaseYear: 2014, rtScore: 92 });

describe('buildRails', () => {
  it('coloca os favoritos primeiro, depois os aclamados e as décadas', () => {
    const slugs = buildRails([marnie, spirited, totoro], []).map((rail) => rail.slug);

    expect(slugs).toEqual(['favorites', 'acclaimed', '1980s', '2000s', '2010s']);
  });

  it('mantém Seus favoritos mesmo sem favoritos', () => {
    const [favorites] = buildRails([totoro], []);

    expect(favorites.slug).toBe('favorites');
    expect(favorites.films).toEqual([]);
  });

  it('preserva a ordem dos favoritos', () => {
    const [favorites] = buildRails([totoro, spirited], ['spirited', 'totoro']);

    expect(favorites.films.map((film) => film.id)).toEqual(['spirited', 'totoro']);
  });

  it('limita os aclamados às 10 maiores notas', () => {
    const films = Array.from({ length: 12 }, (_, index) =>
      makeFilm({ id: String(index), rtScore: index }),
    );

    const acclaimed = buildRails(films, [])[1];

    expect(acclaimed.films).toHaveLength(10);
    expect(acclaimed.films[0].rtScore).toBe(11);
    expect(acclaimed.films[9].rtScore).toBe(2);
  });

  it('coloca filmes de 2010 em diante na última fileira', () => {
    const lastRail = buildRails([marnie], []).at(-1);

    expect(lastRail?.slug).toBe('2010s');
    expect(lastRail?.films).toEqual([marnie]);
  });

  it('com diretor, some com as décadas vazias e mantém Seus favoritos', () => {
    const rails = buildRails([grave, spirited], ['spirited'], 'Isao Takahata');

    expect(rails.map((rail) => rail.slug)).toEqual(['favorites', 'acclaimed', '1980s']);
    expect(rails[0].films).toEqual([]);
  });
});
