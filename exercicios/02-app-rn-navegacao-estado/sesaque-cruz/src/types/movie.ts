// src/types/movie.ts
//
// Tipos do domínio "Movie" (TMDB API).

export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
};

export type Genre = {
  id: number;
  name: string;
};

// GET /movie/{id} devolve os campos da lista + detalhes.
export type MovieDetails = Movie & {
  backdrop_path: string | null;
  genres: Genre[];
  runtime: number | null;
  tagline: string | null;
};

export type MoviesResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};
