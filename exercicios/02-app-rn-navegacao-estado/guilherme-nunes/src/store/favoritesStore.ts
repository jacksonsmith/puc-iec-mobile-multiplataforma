// src/store/favoritesStore.ts
//
// ATIVIDADE 2 — TASK 5 (Zustand favorites) + TASK 7 (persist manual + MMKV)
//
// Doc: https://github.com/pmndrs/zustand

import { create } from 'zustand';
import { mmkvStorage } from '@/storage/mmkv';

export type FavoritesState = {
  ids: number[];
  add: (id: number) => void;
  remove: (id: number) => void;
  toggle: (id: number) => void;
  clear: () => void;
  isFavorite: (id: number) => boolean;
};

const STORAGE_KEY = 'favorites-ids';

const loadInitialIds = (): number[] => {
  try {
    const raw = mmkvStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((id): id is number => Number.isSafeInteger(id) && id > 0))];
  } catch {
    return [];
  }
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: loadInitialIds(),
  add: (id) => {
    if (!Number.isSafeInteger(id) || id <= 0) return;
    set((state) => (state.ids.includes(id) ? state : { ids: [...state.ids, id] }));
  },
  remove: (id) => set((state) => ({ ids: state.ids.filter((favoriteId) => favoriteId !== id) })),
  toggle: (id) => {
    if (!Number.isSafeInteger(id) || id <= 0) return;
    const ids = get().ids;
    set({ ids: ids.includes(id) ? ids.filter((favoriteId) => favoriteId !== id) : [...ids, id] });
  },
  clear: () => set({ ids: [] }),
  isFavorite: (id) => get().ids.includes(id),
}));

useFavoritesStore.subscribe((state) => {
  mmkvStorage.setItem(STORAGE_KEY, JSON.stringify(state.ids));
});
