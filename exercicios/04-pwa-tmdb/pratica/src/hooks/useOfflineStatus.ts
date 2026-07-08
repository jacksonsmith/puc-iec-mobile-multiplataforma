// src/hooks/useOfflineStatus.ts
// smoke-test do autograder (PR de teste) — só TODO 3 Passo 3 resolvido, de propósito

import { useState, useEffect } from 'react';

export function useOfflineStatus(): { isOnline: boolean } {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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
