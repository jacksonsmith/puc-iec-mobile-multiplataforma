import { describe, expect, it } from 'vitest';

import { getDirectors, slugify } from './directors';
import type { Film } from './film';

function makeFilm(director: string): Film {
  return {
    id: director,
    title: 'Film',
    originalTitle: '映画',
    director,
    producer: 'Toshio Suzuki',
    releaseYear: 2001,
    runningTimeMin: 120,
    rtScore: 90,
    description: '',
    imageUrl: '',
    bannerUrl: '',
  };
}

describe('slugify', () => {
  it('usa o sobrenome sem acentos', () => {
    expect(slugify('Isao Takahata')).toBe('takahata');
    expect(slugify('Yoshifumi Kondō')).toBe('kondo');
  });

  it('usa o nome completo quando o sobrenome se repete', () => {
    const names = ['Hayao Miyazaki', 'Gorō Miyazaki'];

    expect(slugify('Hayao Miyazaki', names)).toBe('hayao-miyazaki');
    expect(slugify('Gorō Miyazaki', names)).toBe('goro-miyazaki');
  });
});

describe('getDirectors', () => {
  const films = [
    makeFilm('Isao Takahata'),
    makeFilm('Hayao Miyazaki'),
    makeFilm('Hayao Miyazaki'),
    makeFilm('Gorō Miyazaki'),
  ];

  it('conta os filmes e ordena do maior para o menor', () => {
    expect(getDirectors(films).map(({ name, count }) => [name, count])).toEqual([
      ['Hayao Miyazaki', 2],
      ['Gorō Miyazaki', 1],
      ['Isao Takahata', 1],
    ]);
  });

  it('gera um slug diferente para cada diretor', () => {
    const slugs = getDirectors(films).map((director) => director.slug);

    expect(slugs).toEqual(['hayao-miyazaki', 'goro-miyazaki', 'takahata']);
  });
});
