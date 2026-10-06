// src/store/favoritesStore.ts
//
// ATIVIDADE 2 — TASK 5 (Zustand favorites) + TASK 7 (persist manual + MMKV)
//
// Doc: https://github.com/pmndrs/zustand

import { create } from 'zustand';
import { mmkvStorage } from '@/storage/mmkv';

type FavoritesState = {
  ids: number[];
  add: (id: number) => void;
  remove: (id: number) => void;
  toggle: (id: number) => void;
  clear: () => void;
  isFavorite: (id: number) => boolean;
};

export const STORAGE_KEY = 'favorites-ids';

// Leitura síncrona do MMKV: o store já nasce com os favoritos salvos,
// sem hidratação assíncrona (diferente de AsyncStorage).
const loadInitial = (): number[] => {
  try {
    const raw = mmkvStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'number') : [];
  } catch {
    return [];
  }
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: loadInitial(),
  add: (id) => {
    if (get().ids.includes(id)) return; // evita duplicado
    set((s) => ({ ids: [...s.ids, id] }));
  },
  remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
  toggle: (id) => {
    if (get().ids.includes(id)) get().remove(id);
    else get().add(id);
  },
  clear: () => set({ ids: [] }),
  isFavorite: (id) => get().ids.includes(id),
}));

// Persist manual — salva no MMKV sempre que ids mudar.
//
// Por que persist manual em vez de middleware?
// Zustand devtools middleware usa import.meta.env (Vite-style) que quebra
// no Metro web bundler. Persist via subscribe evita o problema e deixa
// explícito quando o save acontece.
useFavoritesStore.subscribe((state, prev) => {
  if (state.ids === prev.ids) return;
  try {
    mmkvStorage.setItem(STORAGE_KEY, JSON.stringify(state.ids));
  } catch {
    // falha de storage não deve derrubar a UI
  }
});
