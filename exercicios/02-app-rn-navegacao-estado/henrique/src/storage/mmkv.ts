// src/storage/mmkv.ts
//
// ATIVIDADE 2 — TASK 7 (storage síncrono com MMKV + polyfill para web/testes)

const isWeb = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

let getString: (k: string) => string | undefined;
let setItem: (k: string, v: string) => void;
let deleteItem: (k: string) => void;

if (isWeb) {
  getString = (k) => window.localStorage.getItem(k) ?? undefined;
  setItem = (k, v) => window.localStorage.setItem(k, v);
  deleteItem = (k) => window.localStorage.removeItem(k);
} else {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { MMKV } = require('react-native-mmkv');
    const storage = new MMKV({ id: 'favorites-store' });
    getString = (k) => storage.getString(k);
    setItem = (k, v) => storage.set(k, v);
    deleteItem = (k) => storage.delete(k);
  } catch {
    // Memory fallback para ambiente de testes Jest ou ambientes sem JSI nativo
    const memoryStorage = new Map<string, string>();
    getString = (k) => memoryStorage.get(k);
    setItem = (k, v) => memoryStorage.set(k, v);
    deleteItem = (k) => memoryStorage.delete(k);
  }
}

export const mmkvStorage = {
  getItem: (name: string) => getString(name) ?? null,
  setItem: (name: string, value: string) => setItem(name, value),
  removeItem: (name: string) => deleteItem(name),
};
