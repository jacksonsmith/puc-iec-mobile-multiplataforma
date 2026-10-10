// src/store/favoritesStore.ts
//
// ATIVIDADE 2 — TASK 5 (Zustand favorites) + TASK 7 (persist com MMKV)

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

const STORAGE_KEY = 'favorites-ids';

const loadInitial = (): number[] => {
  try {
    const raw = mmkvStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: loadInitial(),

  add: (id) =>
    set((s) => (s.ids.includes(id) ? s : { ids: [...s.ids, id] })),

  remove: (id) =>
    set((s) => ({ ids: s.ids.filter((x) => x !== id) })),

  toggle: (id) => {
    const current = get().ids;
    if (current.includes(id)) {
      set({ ids: current.filter((x) => x !== id) });
    } else {
      set({ ids: [...current, id] });
    }
  },

  clear: () => set({ ids: [] }),

  isFavorite: (id) => get().ids.includes(id),
}));

// Persistência síncrona via subscribe do Zustand com MMKV
useFavoritesStore.subscribe((state) => {
  try {
    mmkvStorage.setItem(STORAGE_KEY, JSON.stringify(state.ids));
  } catch {}
});
