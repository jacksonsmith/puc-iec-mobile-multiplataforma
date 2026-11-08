import { describe, expect, it } from 'vitest';

import { mapFilm, type FilmDto } from './mappers';

const dto: FilmDto = {
  id: 'dc2e6bd1',
  title: 'Spirited Away',
  original_title: '千と千尋の神隠し',
  description: 'Chihiro',
  director: 'Hayao Miyazaki',
  producer: 'Toshio Suzuki',
  release_date: '2001',
  running_time: '124',
  rt_score: '97',
  image: 'https://example.com/poster.jpg',
  movie_banner: 'https://example.com/banner.jpg',
};

describe('mapFilm', () => {
  it('converte os campos da API para o modelo do app', () => {
    expect(mapFilm(dto)).toEqual({
      id: 'dc2e6bd1',
      title: 'Spirited Away',
      originalTitle: '千と千尋の神隠し',
      description: 'Chihiro',
      director: 'Hayao Miyazaki',
      producer: 'Toshio Suzuki',
      releaseYear: 2001,
      runningTimeMin: 124,
      rtScore: 97,
      imageUrl: 'https://example.com/poster.jpg',
      bannerUrl: 'https://example.com/banner.jpg',
    });
  });
});
