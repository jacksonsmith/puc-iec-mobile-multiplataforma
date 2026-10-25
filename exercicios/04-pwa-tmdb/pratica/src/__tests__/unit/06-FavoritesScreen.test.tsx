import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { HomeScreen } from '../../screens/HomeScreen';

const data = vi.hoisted(() => ({
  movies: [{ id: 1, title: 'Matrix', overview: 'Neo.', poster_path: null,
    release_date: '1999-03-31', vote_average: 8.7 }],
  isOnline: true,
}));
vi.mock('../../hooks/useTmdb', () => ({
  isTokenMissing: false,
  posterUrl: () => null,
  usePopularMovies: () => ({ movies: data.movies, loading: false, error: null,
    hasMore: false, loadMore: vi.fn() }),
}));
vi.mock('../../hooks/useInfiniteScroll', () => ({ useInfiniteScroll: vi.fn() }));
vi.mock('../../hooks/useOfflineStatus', () => ({
  useOfflineStatus: () => ({ isOnline: data.isOnline }),
}));
afterEach(cleanup);

it('mostra apenas favoritos e permite remover o filme', () => {
  const toggle = vi.fn();
  render(<HomeScreen activeTab="favorites" isFavorite={(id) => id === 1} toggleFavorite={toggle} count={1} />);
  expect(screen.getByRole('heading', { name: 'Matrix' })).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Remover favorito' }));
  expect(toggle).toHaveBeenCalledWith(1);
});
it('distingue catálogo sem favoritos de catálogo vazio', () => {
  const props = { activeTab: 'favorites' as const, isFavorite: () => false, toggleFavorite: vi.fn(), count: 0 };
  const { rerender } = render(<HomeScreen {...props} />);
  expect(screen.getByText('Nenhum favorito ainda — toque ★ em um filme.')).toBeVisible();
  const movies = data.movies;
  data.movies = [];
  rerender(<HomeScreen {...props} />);
  expect(screen.getByText('Nenhum filme carregado ainda.')).toBeVisible();
  data.movies = movies;
});
it('exibe o banner offline na aba Favoritos', () => {
  data.isOnline = false;
  render(<HomeScreen activeTab="favorites" isFavorite={() => true} toggleFavorite={vi.fn()} count={1} />);
  expect(screen.getByText('📡 Offline — exibindo dados do cache')).toBeVisible();
  data.isOnline = true;
});
