// src/storage/mmkv.ts
//
// ATIVIDADE 2 — TASK 7 (storage síncrono)
//
// MMKV (C++ via JSI) é ~30x mais rápido que AsyncStorage.
// Funciona em iOS/Android nativo. Em web (testes/dev), polyfill com localStorage.
//
// Doc: https://github.com/mrousavy/react-native-mmkv

import { Platform } from 'react-native';

type KeyValueStorage = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
};

// Fallback em memória: usado no Jest e no Expo Go (que não traz o módulo nativo
// do MMKV — pra persistir de verdade é preciso um development build).
const createMemoryStorage = (): KeyValueStorage => {
  const map = new Map<string, string>();
  return {
    getString: (k) => map.get(k),
    set: (k, v) => {
      map.set(k, v);
    },
    delete: (k) => {
      map.delete(k);
    },
  };
};

const createStorage = (): KeyValueStorage => {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined' || !window.localStorage) return createMemoryStorage();
    return {
      getString: (k) => window.localStorage.getItem(k) ?? undefined,
      set: (k, v) => window.localStorage.setItem(k, v),
      delete: (k) => window.localStorage.removeItem(k),
    };
  }

  try {
    // require (e não import) pra não quebrar o bundle web/Jest, onde o JSI não existe.
    const { MMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
    return new MMKV({ id: 'favorites-store' });
  } catch (e) {
    console.warn('[mmkv] módulo nativo indisponível (Expo Go?) — usando storage em memória', e);
    return createMemoryStorage();
  }
};

export const storage = createStorage();

// Adapter no formato getItem/setItem/removeItem (mesmo contrato do Web Storage),
// consumido pelo favoritesStore.
export const mmkvStorage = {
  getItem: (name: string): string | null => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};
