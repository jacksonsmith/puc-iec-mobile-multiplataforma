// src/storage/mmkv.ts
//
// ATIVIDADE 2 — TASK 7 (storage síncrono)
//
// MMKV (C++ via JSI) é ~30x mais rápido que AsyncStorage.
// Funciona em iOS/Android nativo. Em web (testes/dev), polyfill com localStorage.
//
// Doc: https://github.com/mrousavy/react-native-mmkv

import { Platform } from 'react-native';

type MMKVInstance = import('react-native-mmkv').MMKV;

let nativeStorage: MMKVInstance | undefined;

const getNativeStorage = (): MMKVInstance => {
  if (!nativeStorage) {
    // Require sob demanda para que o bundle web não tente carregar o módulo nativo.
    const { MMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
    nativeStorage = new MMKV({ id: 'favorites-store' });
  }

  return nativeStorage;
};

const isWeb = Platform.OS === 'web';

const getString = (key: string): string | undefined => {
  if (isWeb) {
    return typeof window !== 'undefined' ? window.localStorage.getItem(key) ?? undefined : undefined;
  }

  return getNativeStorage().getString(key);
};

const setString = (key: string, value: string): void => {
  if (isWeb) {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
    return;
  }

  getNativeStorage().set(key, value);
};

const deleteString = (key: string): void => {
  if (isWeb) {
    if (typeof window !== 'undefined') window.localStorage.removeItem(key);
    return;
  }

  getNativeStorage().delete(key);
};

export const mmkvStorage = {
  getItem: (name: string) => getString(name) ?? null,
  setItem: (name: string, value: string) => setString(name, value),
  removeItem: (name: string) => deleteString(name),
};
