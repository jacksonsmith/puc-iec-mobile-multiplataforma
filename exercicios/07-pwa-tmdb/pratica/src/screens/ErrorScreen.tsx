// src/screens/ErrorScreen.tsx

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

const styles: Record<string, React.CSSProperties> = {
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: 24 },
  card: { maxWidth: 440, background: '#1c2d40', borderRadius: 12, padding: 32, textAlign: 'center' },
  icon: { fontSize: 40, margin: '0 0 12px' },
  title: { color: '#e57373', margin: '0 0 12px', fontSize: 20 },
  message: { color: '#cfd8dc', fontSize: 14, lineHeight: 1.6, margin: '0 0 16px', wordBreak: 'break-word' },
  hint: { color: '#90a4ae', fontSize: 13, margin: '0 0 20px', lineHeight: 1.6 },
  link: { color: '#01b4e4' },
  btn: { background: '#01b4e4', color: '#0d253f', border: 'none', borderRadius: 6, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 14 },
};
