// src/screens/HomeScreen.tsx

import { useState, useRef } from 'react';
import { usePopularMovies, isTokenMissing } from '../hooks/useTmdb';
import { useFavorites } from '../hooks/useFavorites';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { MovieCard } from '../components/MovieCard';
import { InstallButton } from '../components/InstallButton';
import { ErrorScreen } from './ErrorScreen';

export function HomeScreen() {
  const { movies, loading, error, hasMore, loadMore } = usePopularMovies();
  const { isFavorite, toggle, count } = useFavorites();
  const [search, setSearch] = useState('');
  const sentinelRef = useRef<HTMLDivElement>(null);

  useInfiniteScroll(sentinelRef, loadMore);

  if (isTokenMissing) {
    return (
      <main style={styles.center}>
        <h2>Token TMDB não configurado</h2>
        <p>
          Copie <code>.env.example</code> para <code>.env.local</code> e preencha{' '}
          <code>VITE_TMDB_TOKEN</code>.
        </p>
        <p>
          Gere em:{' '}
          <a href="https://www.themoviedb.org/settings/api" style={{ color: '#01b4e4' }}>
            themoviedb.org/settings/api
          </a>
        </p>
      </main>
    );
  }

  if (error) return <ErrorScreen error={error} />;

  const visible = search.trim()
    ? movies.filter((m) => m.title.toLowerCase().includes(search.toLowerCase()))
    : movies;

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.h1}>🎬 Filmes Populares</h1>
          {count > 0 && (
            <p style={styles.badge}>★ {count} favorito{count !== 1 ? 's' : ''}</p>
          )}
        </div>
        <InstallButton />
      </header>

      <input
        type="search"
        placeholder="Buscar filme…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.searchInput}
        aria-label="Buscar filme"
      />

      <section>
        {visible.length === 0 && search && (
          <p style={{ color: '#90a4ae', textAlign: 'center', padding: 24 }}>
            Nenhum resultado para "{search}"
          </p>
        )}
        {visible.map((m) => (
          <MovieCard
            key={m.id}
            movie={m}
            isFavorite={isFavorite(m.id)}
            onToggleFavorite={toggle}
          />
        ))}
      </section>

      {/* Sentinel — IntersectionObserver dispara loadMore quando chegar aqui */}
      {hasMore && <div ref={sentinelRef} style={{ height: 1 }} />}
      {loading && <p style={styles.loadingMore}>Carregando mais…</p>}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: { maxWidth: 720, margin: '0 auto', padding: '0 16px 40px' },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 40 },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px 0 12px',
  },
  h1: { color: '#01b4e4', margin: 0 },
  badge: { margin: '4px 0 0', color: '#e4a001', fontSize: 13 },
  searchInput: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 14px',
    borderRadius: 6,
    border: '1px solid #2a3f55',
    background: '#1c2d40',
    color: '#e5e5e5',
    fontSize: 14,
    marginBottom: 16,
    outline: 'none',
  },
  loadingMore: { textAlign: 'center', color: '#90a4ae', padding: '16px 0' },
};
