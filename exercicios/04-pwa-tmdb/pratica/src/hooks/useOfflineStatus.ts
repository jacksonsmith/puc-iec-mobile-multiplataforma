// src/hooks/useOfflineStatus.ts
// ✅ AVALIATIVO — TODO 3, Passo 3
//
// Implemente este hook pra rastrear o status de conexão do browser.
//
// O que fazer:
//   1. useState com valor inicial = navigator.onLine  (true = online)
//   2. useEffect: adicione dois listeners em window:
//        window.addEventListener('online',  () => setIsOnline(true))
//        window.addEventListener('offline', () => setIsOnline(false))
//      Retorne uma função de cleanup que remove esses listeners.
//   3. Retorne { isOnline }
//
// Como testar manualmente:
//   DevTools → Network → Throttling → "Offline"
//   O banner "📡 Offline — exibindo dados do cache" deve aparecer na aba Favoritos.

import { useState, useEffect } from 'react';

export function useOfflineStatus(): { isOnline: boolean } {
  // TODO 3 — Passo 3: substitua o useState e o useEffect abaixo pela implementação real
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // implemente aqui
    void isOnline; // remove esta linha quando implementar (evita warning de lint)
  }, [isOnline]);

  return { isOnline };
}
