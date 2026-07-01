// src/components/MovieCard.tsx

import type { Movie } from '../types/movie';
import { posterUrl } from '../hooks/useTmdb';
import { styles } from './MovieCard.styles';

type Props = {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
};

export function MovieCard({ movie, isFavorite, onToggleFavorite }: Props) {
  const img = posterUrl(movie.poster_path);
  const year = movie.release_date?.slice(0, 4) ?? '—';

  const handleShare = async () => {
    if (!navigator.share) return;
    await navigator.share({
      title: movie.title,
      text: `${movie.title} (${year}) — ⭐ ${movie.vote_average.toFixed(1)}`,
      url: window.location.href,
    });
  };

  return (
    <article style={styles.card}>
      {img && (
        <img
          src={img}
          alt={movie.title}
          width={80}
          height={120}
          loading="lazy"
          style={styles.poster}
        />
      )}
      <div style={styles.info}>
        <h3 style={styles.title}>{movie.title}</h3>
        <p style={styles.meta}>⭐ {movie.vote_average.toFixed(1)} · {year}</p>
        <p style={styles.overview}>{movie.overview.slice(0, 120)}…</p>
        <div style={styles.actions}>
          <button
            onClick={() => onToggleFavorite(movie.id)}
            style={{ ...styles.btn, background: isFavorite ? '#e4a001' : '#1c2d40', border: '1px solid #2a3f55' }}
            aria-label={isFavorite ? 'Remover favorito' : 'Favoritar'}
          >
            {isFavorite ? '★ Favorito' : '☆ Favoritar'}
          </button>
          {typeof navigator.share === 'function' && (
            <button onClick={handleShare} style={{ ...styles.btn, border: '1px solid #2a3f55' }} aria-label="Compartilhar">
              ↗ Compartilhar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
