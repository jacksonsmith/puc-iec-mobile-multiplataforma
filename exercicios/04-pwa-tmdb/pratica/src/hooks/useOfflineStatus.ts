// src/hooks/useOfflineStatus.ts
// Status de conexão do browser: navigator.onLine + eventos 'online'/'offline' do window.
// Teste manual: DevTools → Network → Throttling → "Offline" → banner na aba Favoritos.

import { useState, useEffect } from 'react';

export function useOfflineStatus(): { isOnline: boolean } {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    // Handlers nomeados: removeEventListener precisa da MESMA referência usada no add
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline };
}
