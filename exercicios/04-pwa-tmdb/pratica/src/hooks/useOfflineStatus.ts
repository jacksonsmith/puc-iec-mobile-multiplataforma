// src/hooks/useOfflineStatus.ts
// ✅ AVALIATIVO — TODO 5
//
// Status de conexão do browser: começa em navigator.onLine e acompanha os eventos
// 'online'/'offline' do window (com cleanup ao desmontar).
//
// Como testar manualmente:
//   DevTools → Network → Throttling → "Offline"
//   O banner "📡 Offline — exibindo dados do cache" deve aparecer na aba Favoritos.

import { useState, useEffect } from 'react';

export function useOfflineStatus(): { isOnline: boolean } {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return { isOnline };
}
