import type { Movie } from '@/types/movie';
export const demoMode = process.env.EXPO_PUBLIC_DEMO_MODE === 'true';
export const demoMovies: Movie[] = [
 {id: 101, title: 'Viagem às estrelas', overview: 'Dados fictícios para testar navegação e favoritos sem token. Configure a TMDB para a entrega real.', poster_path: null, release_date: '2026-01-01', vote_average: 8.2},
 {id: 102, title: 'O último verão', overview: 'Uma história fictícia de amizade.', poster_path: null, release_date: '2026-02-01', vote_average: 7.5},
 {id: 103, title: 'Além do horizonte', overview: 'Uma aventura fictícia.', poster_path: null, release_date: '2026-03-01', vote_average: 8.7},
];
