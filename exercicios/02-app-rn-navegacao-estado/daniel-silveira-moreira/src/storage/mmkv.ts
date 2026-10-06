// src/storage/mmkv.ts
//
// ATIVIDADE 2 — TASK 7 (storage síncrono)
//
// MMKV (C++ via JSI) é ~30x mais rápido que AsyncStorage e síncrono:
// dá pra ler o estado inicial do store sem await nem tela de loading.
// - iOS/Android: storage nativo via JSI (exige development build, não roda no Expo Go)
// - Web: o próprio react-native-mmkv v3 usa localStorage por baixo
// - Jest: o react-native-mmkv v3 troca automaticamente por um mock em memória
//
// Doc: https://github.com/mrousavy/react-native-mmkv

import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({ id: 'favorites-store' });

// Adapter no formato getItem/setItem/removeItem (mesma interface do
// AsyncStorage/localStorage), usado pelo favoritesStore.
export const mmkvStorage = {
  getItem: (name: string): string | null => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};
