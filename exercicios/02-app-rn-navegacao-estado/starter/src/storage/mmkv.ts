// src/storage/mmkv.ts
//
// ATIVIDADE 2 — TASK 7 (storage síncrono)
//
// MMKV (C++ via JSI) é ~30x mais rápido que AsyncStorage.
// Funciona em iOS/Android nativo. Em web (testes/dev), polyfill com localStorage.
//
// Doc: https://github.com/mrousavy/react-native-mmkv

type StorageBackend = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
};

const memoryStorage = new Map<string, string>();
const isWeb = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

let backend: StorageBackend;

if (isWeb) {
  backend = {
    getString: (key) => window.localStorage.getItem(key) ?? undefined,
    set: (key, value) => window.localStorage.setItem(key, value),
    delete: (key) => window.localStorage.removeItem(key),
  };
} else {
  try {
    const { MMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
    backend = new MMKV({ id: 'favorites-store' });
  } catch {
    backend = {
      getString: (key) => memoryStorage.get(key),
      set: (key, value) => memoryStorage.set(key, value),
      delete: (key) => memoryStorage.delete(key),
    };
  }
}

export const mmkvStorage = {
  getItem: (name: string) => backend.getString(name) ?? null,
  setItem: (name: string, value: string) => backend.set(name, value),
  removeItem: (name: string) => backend.delete(name),
};
