// src/storage/mmkv.ts
//
// ATIVIDADE 2 — TASK 7 (storage síncrono)
//
// MMKV (C++ via JSI) é ~30x mais rápido que AsyncStorage.
// Funciona em iOS/Android nativo. Em web (dev) faz polyfill com localStorage e,
// em ambiente sem JSI (Jest/node), cai num Map em memória — assim os testes
// rodam sem mockar o módulo nativo.
//
// Doc: https://github.com/mrousavy/react-native-mmkv

const isWeb =
  typeof window !== 'undefined' &&
  typeof window.localStorage !== 'undefined';

let getString: (k: string) => string | undefined;
let setString: (k: string, v: string) => void;
let deleteItem: (k: string) => void;

if (isWeb) {
  getString = (k) => window.localStorage.getItem(k) ?? undefined;
  setString = (k, v) => window.localStorage.setItem(k, v);
  deleteItem = (k) => window.localStorage.removeItem(k);
} else {
  try {
    // require lazy: só carrega o nativo fora do web.
    const { MMKV } = require('react-native-mmkv');
    const storage = new MMKV({ id: 'favorites-store' });
    getString = (k) => storage.getString(k);
    setString = (k, v) => storage.set(k, v);
    deleteItem = (k) => storage.delete(k);
  } catch {
    // Sem JSI disponível (ex.: Jest em node) → fallback em memória.
    const mem = new Map<string, string>();
    getString = (k) => mem.get(k);
    setString = (k, v) => {
      mem.set(k, v);
    };
    deleteItem = (k) => {
      mem.delete(k);
    };
  }
}

// Adapter genérico (getItem/setItem/removeItem) — formato que o store consome.
export const mmkvStorage = {
  getItem: (name: string): string | null => getString(name) ?? null,
  setItem: (name: string, value: string): void => setString(name, value),
  removeItem: (name: string): void => deleteItem(name),
};
