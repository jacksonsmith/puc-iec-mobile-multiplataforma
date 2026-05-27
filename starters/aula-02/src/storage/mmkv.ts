// src/storage/mmkv.ts
//
// ATIVIDADE 2 — Passo 2 (MMKV storage síncrono)
//
// Doc: https://github.com/mrousavy/react-native-mmkv
//
// Conceito: MMKV é storage síncrono em C++ (via JSI), ~30x mais rápido
// que AsyncStorage. Funciona em iOS/Android nativo (NÃO em web).

// TODO [Atv2 — Passo 2.1]: descomente as 3 linhas abaixo
// import { MMKV } from 'react-native-mmkv';
//
// const storage = new MMKV({ id: 'favorites-store' });

// TODO [Atv2 — Passo 2.2]: implementar adapter compatível com Zustand persist
//
// Zustand persist espera interface { getItem, setItem, removeItem }.
// MMKV tem API diferente (getString, set, delete) — precisa adapter.
//
// export const mmkvStorage = {
//   getItem: (name: string) => {
//     const value = storage.getString(name);
//     return value ?? null;
//   },
//   setItem: (name: string, value: string) => storage.set(name, value),
//   removeItem: (name: string) => storage.delete(name),
// };

export {};
