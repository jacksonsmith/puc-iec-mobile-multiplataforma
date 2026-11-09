import { onlineManager } from '@tanstack/react-query';
import { useSyncExternalStore } from 'react';

function subscribe(listener: () => void) {
  return onlineManager.subscribe(listener);
}

function getIsOnline() {
  return onlineManager.isOnline();
}

/** Simula o modo avião só para as chamadas à API, para testar o cache sem desligar a rede. */
export function useOfflineSimulation() {
  const isOnline = useSyncExternalStore(subscribe, getIsOnline);

  return {
    isOffline: !isOnline,
    toggleOffline: () => onlineManager.setOnline(!isOnline),
  };
}
