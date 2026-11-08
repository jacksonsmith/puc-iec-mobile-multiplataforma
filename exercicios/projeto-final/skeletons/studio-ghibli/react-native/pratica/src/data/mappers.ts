import type { Film } from '@/domain/film';

export type FilmDto = {
  id: string;
  title: string;
  original_title: string;
  description: string;
  director: string;
  producer: string;
  release_date: string;
  running_time: string;
  rt_score: string;
  image: string;
  movie_banner: string;
};

export function mapFilm(dto: FilmDto): Film {
  return {
    id: dto.id,
    title: dto.title,
    originalTitle: dto.original_title,
    director: dto.director,
    producer: dto.producer,
    releaseYear: Number(dto.release_date),
    runningTimeMin: Number(dto.running_time),
    rtScore: Number(dto.rt_score),
    description: dto.description,
    imageUrl: dto.image,
    bannerUrl: dto.movie_banner,
  };
}
