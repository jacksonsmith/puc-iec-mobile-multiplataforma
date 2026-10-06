// src/store/favoritesStore.ts
//
// ATIVIDADE 2 — TASK 5 (Zustand favorites) + TASK 7 (persist manual + MMKV)
//
// Doc: https://github.com/pmndrs/zustand

import { mmkvStorage } from '@/storage/mmkv';
import { create } from 'zustand';

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
    const ids = raw ? JSON.parse(raw) : [];
    return Array.isArray(ids) && ids.every((id) => typeof id === 'number') ? ids : [];
  } catch {
    return [];
  }
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: loadInitial(),
  add: (id) =>
    set((state) => (state.ids.includes(id) ? state : { ids: [...state.ids, id] })),
  remove: (id) => set((state) => ({ ids: state.ids.filter((favoriteId) => favoriteId !== id) })),
  toggle: (id) => {
    const ids = get().ids;
    set({ ids: ids.includes(id) ? ids.filter((favoriteId) => favoriteId !== id) : [...ids, id] });
  },
  clear: () => set({ ids: [] }),
  isFavorite: (id) => get().ids.includes(id),
}));

useFavoritesStore.subscribe((state) => {
  try {
    mmkvStorage.setItem(STORAGE_KEY, JSON.stringify(state.ids));
  } catch {
  }
});
