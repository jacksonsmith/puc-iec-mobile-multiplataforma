// src/storage/mmkv.ts
//
// ATIVIDADE 2 — TASK 7 (storage síncrono)
//
// MMKV (C++ via JSI) é ~30x mais rápido que AsyncStorage.
// Funciona em iOS/Android nativo. Em web (testes/dev), polyfill com localStorage.
//
// Doc: https://github.com/mrousavy/react-native-mmkv

type LocalStorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

type MMKVConstructor = new (config: { id: string }) => {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
};

type GlobalWithStorage = typeof globalThis & { localStorage?: LocalStorageLike };

const localStorageRef = (globalThis as GlobalWithStorage).localStorage;
const memoryStorage = new Map<string, string>();

let getString: (key: string) => string | undefined;
let setString: (key: string, value: string) => void;
let deleteItem: (key: string) => void;

if (localStorageRef) {
  getString = (key) => localStorageRef.getItem(key) ?? undefined;
  setString = (key, value) => localStorageRef.setItem(key, value);
  deleteItem = (key) => localStorageRef.removeItem(key);
} else {
  try {
    const { MMKV } = require('react-native-mmkv') as { MMKV: MMKVConstructor };
    const storage = new MMKV({ id: 'favorites-store' });

    getString = (key) => storage.getString(key);
    setString = (key, value) => storage.set(key, value);
    deleteItem = (key) => storage.delete(key);
  } catch {
    getString = (key) => memoryStorage.get(key);
    setString = (key, value) => {
      memoryStorage.set(key, value);
    };
    deleteItem = (key) => {
      memoryStorage.delete(key);
    };
  }
}

export const mmkvStorage = {
  getItem: (name: string) => getString(name) ?? null,
  setItem: (name: string, value: string) => setString(name, value),
  removeItem: (name: string) => deleteItem(name),
};
