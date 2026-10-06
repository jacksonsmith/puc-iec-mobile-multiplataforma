// src/storage/mmkv.ts
//
// ATIVIDADE 2 — TASK 7 (storage síncrono)
//
// MMKV (C++ via JSI) é ~30x mais rápido que AsyncStorage.
// Funciona em iOS/Android nativo. Em web (testes/dev), polyfill com localStorage.
//
// Doc: https://github.com/mrousavy/react-native-mmkv

import { Platform } from 'react-native';
import { MMKV } from 'react-native-mmkv';

type KeyValueStore = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
};

// Web: react-native-mmkv não tem suporte web → localStorage (também síncrono).
const createWebStore = (): KeyValueStore => ({
  getString: (k) => window.localStorage.getItem(k) ?? undefined,
  set: (k, v) => window.localStorage.setItem(k, v),
  delete: (k) => window.localStorage.removeItem(k),
});

// Fallback em memória: Expo Go não inclui o módulo nativo do MMKV, então
// `new MMKV()` lança erro. O app continua funcionando, mas sem persistir.
// Pra persistir de verdade: `npx expo run:android` (development build).
const createMemoryStore = (): KeyValueStore => {
  const map = new Map<string, string>();
  return {
    getString: (k) => map.get(k),
    set: (k, v) => void map.set(k, v),
    delete: (k) => void map.delete(k),
  };
};

const createStore = (): KeyValueStore => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    return createWebStore();
  }
  try {
    return new MMKV({ id: 'favorites-store' });
  } catch (e) {
    console.warn('[mmkv] módulo nativo indisponível (Expo Go?) — usando memória:', e);
    return createMemoryStore();
  }
};

export const storage = createStore();

// Adapter com a mesma interface do Web Storage (getItem/setItem/removeItem).
export const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};
