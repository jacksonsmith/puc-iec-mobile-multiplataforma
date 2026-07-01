// src/screens/TokenMissingScreen.tsx

import { styles } from './TokenMissingScreen.styles';

export function TokenMissingScreen() {
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
