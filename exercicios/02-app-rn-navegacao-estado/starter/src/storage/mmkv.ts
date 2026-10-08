// src/storage/mmkv.ts
//
// ATIVIDADE 2 — TASK 7 (storage síncrono)
//
// MMKV (C++ via JSI) é ~30x mais rápido que AsyncStorage.
// Funciona em iOS/Android nativo. Em web (testes/dev), polyfill com localStorage.
//
// Doc: https://github.com/mrousavy/react-native-mmkv

type KeyValueStore = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
};

const STORE_ID = 'favorites-store';

const isWeb = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function createStore(): KeyValueStore {
  // Web: MMKV não roda no navegador -> localStorage (também síncrono).
  if (isWeb) {
    const ls = window.localStorage;
    return {
      getString: (key) => ls.getItem(key) ?? undefined,
      set: (key, value) => ls.setItem(key, value),
      delete: (key) => ls.removeItem(key),
    };
  }

  // Nativo: MMKV. O require fica dentro do try pra que, se o módulo nativo
  // não estiver disponível (ex.: Expo Go), o app NÃO quebre — só perde a persistência.
  // No Jest, o react-native-mmkv v3 usa um mock em memória automaticamente.
  try {
    const { MMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
    const mmkv = new MMKV({ id: STORE_ID });
    return {
      getString: (key) => mmkv.getString(key),
      set: (key, value) => mmkv.set(key, value),
      delete: (key) => mmkv.delete(key),
    };
  } catch {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(
        '[storage] MMKV indisponível — usando memória (favoritos NÃO persistem). ' +
          'Use um dev build: npx expo run:android | run:ios.'
      );
    }
    const memory = new Map<string, string>();
    return {
      getString: (key) => memory.get(key),
      set: (key, value) => void memory.set(key, value),
      delete: (key) => void memory.delete(key),
    };
  }
}

export const storage = createStore();

// Adapter no formato esperado pelo store: tudo síncrono, getItem devolve string | null.
export const mmkvStorage = {
  getItem: (name: string): string | null => storage.getString(name) ?? null,
  setItem: (name: string, value: string): void => storage.set(name, value),
  removeItem: (name: string): void => storage.delete(name),
};
