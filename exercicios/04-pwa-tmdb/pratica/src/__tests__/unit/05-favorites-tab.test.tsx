// src/__tests__/unit/05-favorites-tab.test.tsx
// Autoral — valida o TODO 4 (lista + estado vazio) e o banner do TODO 5 na aba Favoritos

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Movie } from '../../types/movie';

const movies: Movie[] = [
  { id: 1, title: 'Matrix', overview: 'Neo.', poster_path: null, release_date: '1999-03-31', vote_average: 8.7 },
  { id: 2, title: 'Inception', overview: 'Dom.', poster_path: null, release_date: '2010-07-16', vote_average: 8.8 },
];

// A tela só lê o hook: substituímos rede/IndexedDB por um estado controlado em cada teste
const tmdb = vi.hoisted(() => ({ movies: [] as Movie[], loading: false }));
const net = vi.hoisted(() => ({ isOnline: true }));

vi.mock('../../hooks/useTmdb', () => ({
  isTokenMissing: false,
  posterUrl: () => null,
  usePopularMovies: () => ({ ...tmdb, error: null, hasMore: false, loadMore: () => {} }),
}));
vi.mock('../../hooks/useOfflineStatus', () => ({ useOfflineStatus: () => net }));

const { HomeScreen } = await import('../../screens/HomeScreen');

const renderFavorites = (favIds: number[]) =>
  render(
    <HomeScreen
      activeTab="favorites"
      isFavorite={(id) => favIds.includes(id)}
      toggleFavorite={() => {}}
      count={favIds.length}
    />,
  );

beforeEach(() => {
  tmdb.movies = movies;
  tmdb.loading = false;
  net.isOnline = true;
});

describe('aba Favoritos', () => {
  it('1. lista só os filmes favoritados', () => {
    renderFavorites([2]);
    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.queryByText('Matrix')).not.toBeInTheDocument();
  });

  it('2. sem favoritos, orienta a tocar na ★', () => {
    renderFavorites([]);
    expect(screen.getByText('Nenhum favorito ainda — toque ★ em um filme.')).toBeInTheDocument();
  });

  it('3. sem filmes carregados, avisa que não há dados', () => {
    tmdb.movies = [];
    renderFavorites([1]);
    expect(screen.getByText('Nenhum filme carregado ainda.')).toBeInTheDocument();
  });

  it('4. offline, mostra o banner do cache acima da lista', () => {
    net.isOnline = false;
    renderFavorites([1]);
    expect(screen.getByText('📡 Offline — exibindo dados do cache')).toBeInTheDocument();
    expect(screen.getByText('Matrix')).toBeInTheDocument();
  });

  it('5. online, não mostra o banner', () => {
    renderFavorites([1]);
    expect(screen.queryByText(/Offline — exibindo dados do cache/)).not.toBeInTheDocument();
  });
});
