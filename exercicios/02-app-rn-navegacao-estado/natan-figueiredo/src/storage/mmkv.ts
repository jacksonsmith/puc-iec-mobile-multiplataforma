// src/storage/mmkv.ts
//
// ATIVIDADE 2 — TASK 7 (storage síncrono)
//
// MMKV (C++ via JSI) é ~30x mais rápido que AsyncStorage e SÍNCRONO:
// dá pra ler o estado inicial do store sem await nem tela de "hydrating".
//
// react-native-mmkv v3 já resolve as plataformas sozinho:
// - iOS/Android: instância nativa via JSI (precisa dev build — não roda no Expo Go)
// - web: implementação própria em cima de localStorage (createMMKV.web)
// - Jest: mock em memória (detecta JEST_WORKER_ID)
//
// Doc: https://github.com/mrousavy/react-native-mmkv

import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({ id: 'favorites-store' });

// Adapter com a mesma interface do StateStorage do Zustand —
// o store não conhece MMKV, só getItem/setItem/removeItem.
export const mmkvStorage = {
  getItem: (name: string): string | null => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};
