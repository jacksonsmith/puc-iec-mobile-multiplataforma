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

const isWeb = Platform.OS === 'web';
const memory = new Map<string, string>();
let nativeStorage: NativeStorage | undefined;

function getNativeStorage(): NativeStorage | undefined {
  if (nativeStorage) return nativeStorage;

  try {
    const { MMKV } = require('react-native-mmkv') as {
      MMKV: new (options: { id: string }) => NativeStorage;
    };
    nativeStorage = new MMKV({ id: 'favorites-store' });
    return nativeStorage;
  } catch {
    // Jest and non-native previews do not provide the JSI runtime required by MMKV.
    return undefined;
  }
}

function getString(key: string): string | undefined {
  if (isWeb) return window.localStorage.getItem(key) ?? undefined;
  return getNativeStorage()?.getString(key) ?? memory.get(key);
}

function setItem(key: string, value: string): void {
  if (isWeb) {
    window.localStorage.setItem(key, value);
    return;
  }

  const storage = getNativeStorage();
  if (storage) storage.set(key, value);
  else memory.set(key, value);
}

function deleteItem(key: string): void {
  if (isWeb) {
    window.localStorage.removeItem(key);
    return;
  }

  const storage = getNativeStorage();
  if (storage) storage.delete(key);
  else memory.delete(key);
}

export const mmkvStorage = {
  getItem: (name: string) => getString(name) ?? null,
  setItem,
  removeItem: deleteItem,
};
