// src/hooks/useTmdb.ts — React wrapper em cima do service

import { useState, useEffect, useCallback } from 'react';
import { fetchPopularMovies, isTokenMissing, posterUrl } from '../services/tmdb';
import type { Movie } from '../types/movie';

export { isTokenMissing, posterUrl };

export function usePopularMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    // ── TODO 2 ─────────────────────────────────────────────────────────────
    // Use useEffect para chamar fetchPopularMovies(page) ao montar e a cada
    // vez que `page` mudar. Gerencie loading e error adequadamente.
    // Acumule os filmes: page 1 substitui, page > 1 concatena.
    // Use hasMore = page < total_pages pra saber se tem mais.
    // ───────────────────────────────────────────────────────────────────────
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetchPopularMovies(page);
        if (!cancelled) {
          setMovies(prev => page === 1 ? response.results : [...prev, ...response.results]);
          setHasMore(page < response.total_pages);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [page]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) setPage(p => p + 1);
  }, [loading, hasMore]);

  return { movies, loading, error, hasMore, loadMore };
}
