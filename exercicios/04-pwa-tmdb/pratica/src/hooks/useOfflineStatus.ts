// src/hooks/useOfflineStatus.ts
// ✅ AVALIATIVO — TODO 5
//
// Rastreia o status de conexão do browser (navigator.onLine + eventos online/offline).
//
// Como testar manualmente:
//   DevTools → Network → Throttling → "Offline"
//   O banner "📡 Offline — exibindo dados do cache" deve aparecer na aba Favoritos.

import { useState, useEffect } from 'react';

export function useOfflineStatus(): { isOnline: boolean } {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
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
