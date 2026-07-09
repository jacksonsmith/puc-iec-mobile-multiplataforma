// src/storage/mmkv.ts
//
// ATIVIDADE 2 — TASK 7 (storage síncrono)
//
// MMKV (C++ via JSI) é ~30x mais rápido que AsyncStorage.
// Funciona em iOS/Android nativo. Em web (testes/dev), polyfill com localStorage.
//
// Doc: https://github.com/mrousavy/react-native-mmkv

// MMKV storage polyfill: localStorage on web, native MMKV on device,
// and an in-memory fallback for test/node environments.

const isWeb = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

let getString: (k: string) => string | undefined;
let setString: (k: string, v: string) => void;
let deleteString: (k: string) => void;

if (isWeb) {
  getString = (k) => window.localStorage.getItem(k) ?? undefined;
  setString = (k, v) => window.localStorage.setItem(k, v);
  deleteString = (k) => window.localStorage.removeItem(k);
} else {
  // Try native MMKV if available (React Native). If not, fallback to in-memory map for tests/node.
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { MMKV } = require('react-native-mmkv');
    const storage = new MMKV({ id: 'favorites-store' });
    getString = (k) => storage.getString(k) ?? undefined;
    setString = (k, v) => storage.set(k, v);
    deleteString = (k) => storage.delete(k);
  } catch {
    const mem = new Map<string, string>();
    getString = (k) => mem.get(k);
    setString = (k, v) => mem.set(k, v);
    deleteString = (k) => mem.delete(k);
  }
}

export const mmkvStorage = {
  getItem: (name: string) => getString(name) ?? null,
  setItem: (name: string, value: string) => setString(name, value),
  removeItem: (name: string) => deleteString(name),
};
