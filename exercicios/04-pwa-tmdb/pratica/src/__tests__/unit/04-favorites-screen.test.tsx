import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { HomeScreen } from '../../screens/HomeScreen';
import { useOfflineStatus } from '../../hooks/useOfflineStatus';
import type { Movie } from '../../types/movie';

const data = vi.hoisted(() => ({ movies: [] as Movie[] }));
vi.mock('../../hooks/useTmdb', () => ({
  isTokenMissing: false,
  posterUrl: () => null,
  usePopularMovies: () => ({ movies: data.movies, loading: false, error: null, hasMore: false, loadMore: vi.fn() }),
}));
vi.mock('../../hooks/useInfiniteScroll', () => ({ useInfiniteScroll: vi.fn() }));

const movie = (id: number, title: string): Movie => ({
  id, title, overview: 'Sinopse', poster_path: null, release_date: '1999-01-01', vote_average: 8.7,
});

beforeEach(() => {
  data.movies = [movie(1, 'Matrix'), movie(2, 'Inception')];
  vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function renderFavorites(toggleFavorite = vi.fn(), isFavorite: (id: number) => boolean = (id) => id === 1) {
  return render(<HomeScreen activeTab="favorites" isFavorite={isFavorite} toggleFavorite={toggleFavorite} count={1} />);
}

describe('aba Favoritos', () => {
  it('mostra apenas favoritos e permite removê-los', () => {
    const toggle = vi.fn();
    renderFavorites(toggle);
    expect(screen.getByText('Matrix')).toBeInTheDocument();
    expect(screen.queryByText('Inception')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Remover favorito' }));
    expect(toggle).toHaveBeenCalledWith(1);
  });

  it('distingue filmes carregados sem favoritos', () => {
    renderFavorites(vi.fn(), () => false);
    expect(screen.getByText('Nenhum favorito ainda — toque ★ em um filme.')).toBeInTheDocument();
  });

  it('informa quando nenhum filme foi carregado', () => {
    data.movies = [];
    renderFavorites();
    expect(screen.getByText('Nenhum filme carregado ainda.')).toBeInTheDocument();
  });

  it('mostra o banner offline sem esconder os favoritos e remove ao reconectar', () => {
    renderFavorites();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    act(() => window.dispatchEvent(new Event('offline')));
    expect(screen.getByRole('status')).toHaveTextContent('📡 Offline — exibindo dados do cache');
    expect(screen.getByText('Matrix')).toBeInTheDocument();
    act(() => window.dispatchEvent(new Event('online')));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

describe('useOfflineStatus', () => {
  it('inicia com navigator.onLine e remove os mesmos listeners ao desmontar', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    const add = vi.spyOn(window, 'addEventListener');
    const remove = vi.spyOn(window, 'removeEventListener');
    const { result, unmount } = renderHook(() => useOfflineStatus());
    expect(result.current.isOnline).toBe(false);
    const online = add.mock.calls.find(([event]) => event === 'online')![1];
    const offline = add.mock.calls.find(([event]) => event === 'offline')![1];
    unmount();
    expect(remove).toHaveBeenCalledWith('online', online);
    expect(remove).toHaveBeenCalledWith('offline', offline);
  });
});
