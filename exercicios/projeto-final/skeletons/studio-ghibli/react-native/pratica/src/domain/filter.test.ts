import { describe, expect, it } from 'vitest';

import type { Film } from './film';
import { filterFilms, normalize } from './filter';

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

const spirited = makeFilm({
  id: 'spirited',
  title: 'Spirited Away',
  originalTitle: '千と千尋の神隠し',
});
const grave = makeFilm({
  id: 'grave',
  title: 'Grave of the Fireflies',
  originalTitle: '火垂るの墓',
  director: 'Isao Takahata',
});
const films = [spirited, grave];

describe('normalize', () => {
  it('remove acentos, maiúsculas e espaços nas pontas', () => {
    expect(normalize('  CHÍHIRO ')).toBe('chihiro');
  });
});

describe('filterFilms', () => {
  it('encontra pelo título sem diferenciar maiúsculas e acentos', () => {
    expect(filterFilms(films, { query: 'SPÍRITED' })).toEqual([spirited]);
  });

  it('encontra pelo título original', () => {
    expect(filterFilms(films, { query: '火垂る' })).toEqual([grave]);
  });

  it('retorna todos com a busca vazia', () => {
    expect(filterFilms(films, { query: '   ' })).toEqual(films);
  });

  it('retorna lista vazia sem correspondência', () => {
    expect(filterFilms(films, { query: 'xyz' })).toEqual([]);
  });

  it('combina busca e diretor', () => {
    expect(filterFilms(films, { query: 'f', director: 'Isao Takahata' })).toEqual([grave]);
    expect(filterFilms(films, { query: 'spirited', director: 'Isao Takahata' })).toEqual([]);
  });
});
