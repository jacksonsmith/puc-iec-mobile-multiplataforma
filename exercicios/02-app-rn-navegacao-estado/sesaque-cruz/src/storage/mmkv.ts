// src/storage/mmkv.ts
//
// ATIVIDADE 2: TASK 7 (storage síncrono)
//
// MMKV (C++ via JSI) é ~30x mais rápido que AsyncStorage.
// No web o próprio react-native-mmkv usa localStorage e no Jest usa um mock em memória.
// No Expo Go o módulo nativo não existe: cai num Map em memória (sem persistência)
// pra o app continuar rodando. Persistência real exige development build.
//
// Doc: https://github.com/mrousavy/react-native-mmkv

import { MMKV } from 'react-native-mmkv';

type KeyValueStorage = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
};

const createMemoryStorage = (): KeyValueStorage => {
  const memory = new Map<string, string>();
  return {
    getString: (key) => memory.get(key),
    set: (key, value) => void memory.set(key, value),
    delete: (key) => void memory.delete(key),
  };
};

const createStorage = (): KeyValueStorage => {
  try {
    return new MMKV({ id: 'favorites-store' });
  } catch (error) {
    console.warn('MMKV indisponível (Expo Go?), usando storage em memória.', error);
    return createMemoryStorage();
  }
};

export const storage = createStorage();

export const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};
