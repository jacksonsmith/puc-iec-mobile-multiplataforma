// Tipos do domínio compartilhados entre server e apps (mobile/web).

export type Movie = {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
};

export type MoviePage = {
  page: number;
  results: Movie[];
  totalPages: number;
  totalResults: number;
};

export type User = {
  id: string;
  email: string;
  name: string | null;
};

export type AuthPayload = {
  token: string;
  user: User;
};
