// src/hooks/useOfflineStatus.ts
// Rastreia o status de conexão do browser (eventos 'online'/'offline' do window).
//
// Teste manual: DevTools → Network → Throttling → "Offline"
// O banner "📡 Offline — exibindo dados do cache" aparece na aba Favoritos.

import { useState, useEffect } from 'react';

export function useOfflineStatus(): { isOnline: boolean } {
  // Valor inicial real: o app pode já abrir sem rede (ex.: PWA em modo avião).
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    // Funções nomeadas: o removeEventListener precisa da MESMA referência do add.
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup: roda ao desmontar o componente — sem ele, os listeners vazam.
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // [] → registra uma única vez, na montagem

  return { isOnline };
}
