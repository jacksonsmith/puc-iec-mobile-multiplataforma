// src/storage/mmkv.ts
//
// ATIVIDADE 2 — TASK 7 (storage síncrono)
//
// MMKV (C++ via JSI) é ~30x mais rápido que AsyncStorage.
// Funciona em iOS/Android nativo. Em web (testes/dev), polyfill com localStorage.
//
// Doc: https://github.com/mrousavy/react-native-mmkv

import { Platform } from 'react-native';

type NativeStorage = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
};

const memoryStorage = new Map<string, string>();
const isWeb = Platform.OS === 'web';
let nativeStorage: NativeStorage | undefined;

if (!isWeb) {
  try {
    const { MMKV } = require('react-native-mmkv') as {
      MMKV: new (options: { id: string }) => NativeStorage;
    };
    nativeStorage = new MMKV({ id: 'favorites-store' });
  } catch {
    // Permite executar os testes sem o módulo nativo instalado no runtime de teste.
  }
}

const getString = (key: string): string | undefined => {
  if (isWeb && typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem(key) ?? undefined;
  }
  return nativeStorage?.getString(key) ?? memoryStorage.get(key);
};

const setString = (key: string, value: string): void => {
  if (isWeb && typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(key, value);
  } else if (nativeStorage) {
    nativeStorage.set(key, value);
  } else {
    memoryStorage.set(key, value);
  }
};

const deleteString = (key: string): void => {
  if (isWeb && typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(key);
  } else if (nativeStorage) {
    nativeStorage.delete(key);
  } else {
    memoryStorage.delete(key);
  }
};

export const mmkvStorage = {
  getItem: (name: string) => getString(name) ?? null,
  setItem: (name: string, value: string) => setString(name, value),
  removeItem: (name: string) => deleteString(name),
};
