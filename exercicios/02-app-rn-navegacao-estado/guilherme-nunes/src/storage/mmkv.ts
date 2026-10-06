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

let nativeStorage: NativeStorage | undefined;

const getNativeStorage = () => {
  if (!nativeStorage) {
    const { MMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
    nativeStorage = new MMKV({ id: 'favorites-store' });
  }
  return nativeStorage;
};

const webStorageAvailable = () =>
  Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const mmkvStorage = {
  getItem: (name: string): string | null => {
    if (webStorageAvailable()) return window.localStorage.getItem(name);
    if (Platform.OS === 'web') return null;
    return getNativeStorage().getString(name) ?? null;
  },
  setItem: (name: string, value: string): void => {
    if (webStorageAvailable()) {
      window.localStorage.setItem(name, value);
      return;
    }
    if (Platform.OS === 'web') return;
    getNativeStorage().set(name, value);
  },
  removeItem: (name: string): void => {
    if (webStorageAvailable()) {
      window.localStorage.removeItem(name);
      return;
    }
    if (Platform.OS === 'web') return;
    getNativeStorage().delete(name);
  },
};
