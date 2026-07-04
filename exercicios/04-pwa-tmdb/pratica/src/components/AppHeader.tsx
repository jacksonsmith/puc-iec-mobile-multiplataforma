// src/components/AppHeader.tsx

import { InstallButton } from './InstallButton';
import { styles } from './AppHeader.styles';

type Props = { favoritesCount: number };

export function AppHeader({ favoritesCount }: Props) {
  return (
    <header style={styles.header}>
      <div>
        <h1 style={styles.h1}>🎬 Filmes Populares</h1>
        {favoritesCount > 0 && (
          <p style={styles.badge}>★ {favoritesCount} favorito{favoritesCount !== 1 ? 's' : ''}</p>
        )}
      </div>
      <InstallButton />
    </header>
  );
}
