// src/storage/mmkv.ts
//
// ATIVIDADE 2 — TASK 7 (storage síncrono)
//
// MMKV (C++ via JSI) é ~30x mais rápido que AsyncStorage.
// Funciona em iOS/Android nativo. Em web (testes/dev), polyfill com localStorage.
//
// Doc: https://github.com/mrousavy/react-native-mmkv

type StorageOperations = {
  getString: (key: string) => string | undefined;
  setItem: (key: string, value: string) => void;
  deleteItem: (key: string) => void;
};

const createStorageOperations = (): StorageOperations => {
  const isWeb = typeof window !== 'undefined' && window.localStorage != null;

  if (isWeb) {
    return {
      getString: (key) => window.localStorage.getItem(key) ?? undefined,
      setItem: (key, value) => window.localStorage.setItem(key, value),
      deleteItem: (key) => window.localStorage.removeItem(key),
    };
  }

  try {
    const { MMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
    const storage = new MMKV({ id: 'favorites-store' });

    return {
      getString: (key) => storage.getString(key),
      setItem: (key, value) => storage.set(key, value),
      deleteItem: (key) => storage.delete(key),
    };
  } catch {
    // Fallback síncrono para ambientes sem JSI, como os testes Jest.
    const memory = new Map<string, string>();
    return {
      getString: (key) => memory.get(key),
      setItem: (key, value) => memory.set(key, value),
      deleteItem: (key) => memory.delete(key),
    };
  }
};

const operations = createStorageOperations();

export const mmkvStorage = {
  getItem: (name: string): string | null => operations.getString(name) ?? null,
  setItem: (name: string, value: string): void => operations.setItem(name, value),
  removeItem: (name: string): void => operations.deleteItem(name),
};
