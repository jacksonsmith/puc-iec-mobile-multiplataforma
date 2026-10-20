// src/storage/mmkv.ts
//
// ATIVIDADE 2 — TASK 7 (storage síncrono)
//
// MMKV (C++ via JSI) é ~30x mais rápido que AsyncStorage.
// - iOS/Android: chamada direta ao C++ pelo JSI, sem bridge.
// - Web: a própria lib (v3) troca a implementação por localStorage
//   (createMMKV.web), então não precisa de polyfill manual.
// - Jest: a lib detecta o ambiente de teste e usa um mock em memória.
//
// Doc: https://github.com/mrousavy/react-native-mmkv

import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({ id: 'favorites-store' });

// Adapter com a mesma interface do Web Storage (getItem/setItem/removeItem),
// pra quem consome não depender da API específica do MMKV.
export const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};
