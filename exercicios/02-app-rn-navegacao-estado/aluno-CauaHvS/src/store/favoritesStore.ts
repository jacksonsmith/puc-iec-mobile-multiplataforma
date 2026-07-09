// src/store/favoritesStore.ts
//
// ATIVIDADE 2 — TASK 5 (Zustand favorites) + TASK 7 (persist manual + MMKV)
//
// Doc: https://github.com/pmndrs/zustand

import { create } from 'zustand';
import { mmkvStorage } from '@/storage/mmkv';

type FavoritesState = {
  ids: number[];
  toggle: (id: number) => void;
  isFavorite: (id: number) => boolean;
  add: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
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

  toggle: (id) => {
    const { ids } = get();
    if (ids.includes(id)) {
      set({ ids: ids.filter((i) => i !== id) });
    } else {
      set({ ids: [...ids, id] });
    }
  },

  isFavorite: (id) => get().ids.includes(id),

  add: (id) => {
    const { ids } = get();
    if (!ids.includes(id)) {
      set({ ids: [...ids, id] });
    }
  },

  remove: (id) => {
    set({ ids: get().ids.filter((i) => i !== id) });
  },

  clear: () => set({ ids: [] }),
}));

// Persist manual — salva no storage sempre que ids mudar.
// Usamos subscribe em vez do middleware persist do Zustand porque
// o middleware usa import.meta.env (Vite-style) que quebra no Metro bundler.
useFavoritesStore.subscribe((state) => {
  try {
    mmkvStorage.setItem(STORAGE_KEY, JSON.stringify(state.ids));
  } catch {}
});