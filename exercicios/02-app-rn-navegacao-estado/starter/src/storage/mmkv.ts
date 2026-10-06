// src/storage/mmkv.ts
//
// ATIVIDADE 2 — TASK 7 (storage síncrono)
//
// MMKV (C++ via JSI) é ~30x mais rápido que AsyncStorage.
// Funciona em iOS/Android nativo. Em web (testes/dev), polyfill com localStorage.
//
// Doc: https://github.com/mrousavy/react-native-mmkv

const isWeb = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

let getString: (key: string) => string | undefined;
let setValue: (key: string, value: string) => void;
let deleteValue: (key: string) => void;

if (isWeb) {
  getString = (key) => window.localStorage.getItem(key) ?? undefined;
  setValue = (key, value) => window.localStorage.setItem(key, value);
  deleteValue = (key) => window.localStorage.removeItem(key);
} else {
  const { MMKV } = require('react-native-mmkv');
  const storage = new MMKV({ id: 'favorites-store' });
  getString = (key) => storage.getString(key);
  setValue = (key, value) => storage.set(key, value);
  deleteValue = (key) => storage.delete(key);
}

export const mmkvStorage = {
  getItem: (name: string) => getString(name) ?? null,
  setItem: (name: string, value: string) => setValue(name, value),
  removeItem: (name: string) => deleteValue(name),
};
