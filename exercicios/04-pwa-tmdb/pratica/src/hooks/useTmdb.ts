// src/hooks/useTmdb.ts — React wrapper em cima do service

import { useState, useEffect, useCallback } from 'react';
import { isTokenMissing, posterUrl } from '../services/tmdb';
import { moviesRepository } from '../repositories/moviesRepository';
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

    const load = async () => {
      try {
        setLoading(true);
        const results = await moviesRepository.getPopularMovies(page, 'NetworkFirst');
        if (!cancelled) {
          setMovies(prev => page === 1 ? results : [...prev, ...results]);
          setHasMore(results.length > 0);
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
