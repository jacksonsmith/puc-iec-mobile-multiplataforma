// src/screens/ErrorScreen.tsx

import { styles } from './ErrorScreen.styles';

type Props = {
  error: Error;
  onRetry?: () => void;
};

export function ErrorScreen({ error, onRetry }: Props) {
  const message = error.message;
  const isAuthError = message.toLowerCase().includes('api key') || message.toLowerCase().includes('invalid');

  return (
    <main style={styles.center}>
      <div style={styles.card}>
        <p style={styles.icon}>⚠️</p>
        <h2 style={styles.title}>Algo deu errado</h2>
        <p style={styles.message}>{message}</p>
        {isAuthError && (
          <p style={styles.hint}>
            Verifique seu <code>VITE_TMDB_TOKEN</code> no arquivo <code>.env.local</code>.{' '}
            <a href="https://www.themoviedb.org/settings/api" style={styles.link}>
              Gerar token →
            </a>
          </p>
        )}
        {onRetry && (
          <button onClick={onRetry} style={styles.btn}>
            Tentar novamente
          </button>
        )}
      </div>
    </main>
  );
}
