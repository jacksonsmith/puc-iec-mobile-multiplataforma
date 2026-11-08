// src/storage/mmkv.ts
//
// ATIVIDADE 2 — TASK 7 (storage síncrono)
//
// MMKV (C++ via JSI) é ~30x mais rápido que AsyncStorage.
// Funciona em iOS/Android nativo. Em web (testes/dev), polyfill com localStorage.
//
// Doc: https://github.com/mrousavy/react-native-mmkv
//
// Estratégia:
// - Nativo (iOS/Android): MMKV de verdade, importado só no branch nativo.
// - Web: localStorage (mesma API síncrona).
// - Node/Jest ou qualquer ambiente sem módulo nativo: fallback em memória,
//   para que os testes do store rodem sem depender de JSI.

type StorageAdapter = {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
  removeItem: (name: string) => void;
};

const memory = new Map<string, string>();

const isWeb =
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function createNativeStorage(): StorageAdapter | null {
  try {
    // require dinâmico: evita carregar o módulo nativo em web/Jest.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { MMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
    const storage = new MMKV({ id: 'favorites-store' });

    return {
      getItem: (name) => storage.getString(name) ?? null,
      setItem: (name, value) => storage.set(name, value),
      removeItem: (name) => storage.delete(name),
    };
  } catch {
    return null;
  }
}

const memoryStorage: StorageAdapter = {
  getItem: (name) => memory.get(name) ?? null,
  setItem: (name, value) => {
    memory.set(name, value);
  },
  removeItem: (name) => {
    memory.delete(name);
  },
};

const webStorage: StorageAdapter = {
  getItem: (name) => window.localStorage.getItem(name),
  setItem: (name, value) => window.localStorage.setItem(name, value),
  removeItem: (name) => window.localStorage.removeItem(name),
};

export const mmkvStorage: StorageAdapter = isWeb
  ? webStorage
  : (createNativeStorage() ?? memoryStorage);

// Exposto para testes que precisam simular "reabrir o app".
export const __resetMemoryStorage = () => memory.clear();
