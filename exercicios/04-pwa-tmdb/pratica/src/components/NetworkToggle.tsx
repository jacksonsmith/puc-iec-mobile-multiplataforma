// src/components/NetworkToggle.tsx — dev tool pra simular offline

import { useState } from 'react';
import { setSimulateOffline, isSimulatingOffline } from '../services/tmdb';
import { clearMovies } from '../services/db';

export function NetworkToggle() {
  const [offline, setOffline] = useState(isSimulatingOffline);

  const toggle = () => {
    const next = !offline;
    setSimulateOffline(next);
    setOffline(next);
    // Reload em ambos os casos:
    // → offline: reload mostra cache (fetch falha → IndexedDB)
    // → online:  reload dispara fetch fresco
    window.location.reload();
  };

  const clearCache = async () => {
    await clearMovies();
    window.location.reload();
  };

  return (
    <div style={styles.wrap}>
      <button onClick={toggle} style={{ ...styles.btn, ...(offline ? styles.offline : styles.online) }}>
        {offline ? '📵 Offline' : '🌐 Online'}
      </button>
      <button onClick={clearCache} style={{ ...styles.btn, ...styles.clear }}>
        🗑 Limpar cache
      </button>
      {offline && (
        <span style={styles.hint}>Reload feito — dados vêm do IndexedDB</span>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' },
  btn: {
    border: 'none',
    borderRadius: 4,
    padding: '4px 10px',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
  },
  online:  { background: '#2e7d32', color: '#fff' },
  offline: { background: '#b71c1c', color: '#fff' },
  clear:   { background: '#37474f', color: '#fff' },
  hint: { color: '#90a4ae', fontSize: 11 },
};
