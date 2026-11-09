// src/storage/mmkv.ts
//
// ATIVIDADE 2 — TASK 7 (storage síncrono)
//
// MMKV (C++ via JSI) é ~30x mais rápido que AsyncStorage.
// Funciona em iOS/Android nativo. Em web (testes/dev), polyfill com localStorage.
//
// Doc: https://github.com/mrousavy/react-native-mmkv

const isWeb =
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

let getString: (key: string) => string | undefined;
let setItem: (key: string, value: string) => void;
let deleteItem: (key: string) => void;

if (isWeb) {
  getString = (key) => window.localStorage.getItem(key) ?? undefined;
  setItem = (key, value) => window.localStorage.setItem(key, value);
  deleteItem = (key) => window.localStorage.removeItem(key);
} else {
  const { MMKV } = require("react-native-mmkv");
  const storage = new MMKV({ id: "favorites-store" });
  getString = (key) => storage.getString(key);
  setItem = (key, value) => storage.set(key, value);
  deleteItem = (key) => storage.delete(key);
}

export const mmkvStorage = {
  getItem: (name: string) => getString(name) ?? null,
  setItem: (name: string, value: string) => setItem(name, value),
  removeItem: (name: string) => deleteItem(name),
};
