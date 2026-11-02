// src/hooks/useOfflineStatus.ts
// ✅ AVALIATIVO — TODO 5
//
// Status de conexão do navegador: navigator.onLine dá o valor inicial e os eventos
// 'online'/'offline' do window avisam as mudanças.
//
// Atenção: o botão "📵 Offline" do NetworkToggle NÃO dispara esses eventos. Ele só faz o
// axios falhar. Para ver o banner, use DevTools → Network → Offline (ou o modo avião).

import { useState, useEffect } from 'react';

export function useOfflineStatus(): { isOnline: boolean } {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Funções com nome: o removeEventListener precisa da MESMA referência do add.
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup ao desmontar: sem ele, cada montagem deixaria listeners órfãos
    // chamando setState de um componente que já saiu da tela.
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline };
}
