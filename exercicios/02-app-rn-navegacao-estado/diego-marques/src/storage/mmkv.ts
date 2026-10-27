import { Platform } from 'react-native';
import { MMKV } from 'react-native-mmkv';

type KeyValueStore = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
};

const createWebStore = (): KeyValueStore => ({
  getString: (k) => window.localStorage.getItem(k) ?? undefined,
  set: (k, v) => window.localStorage.setItem(k, v),
  delete: (k) => window.localStorage.removeItem(k),
});

const createMemoryStore = (): KeyValueStore => {
  const map = new Map<string, string>();
  return {
    getString: (k) => map.get(k),
    set: (k, v) => void map.set(k, v),
    delete: (k) => void map.delete(k),
  };
};

const createStore = (): KeyValueStore => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    return createWebStore();
  }
  try {
    return new MMKV({ id: 'favorites-store' });
  } catch (e) {
    console.warn('[mmkv] módulo nativo indisponível (Expo Go?) — usando memória:', e);
    return createMemoryStore();
  }
};

export const storage = createStore();

export const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};
