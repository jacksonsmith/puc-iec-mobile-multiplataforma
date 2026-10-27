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
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) && parsed.every((id) => Number.isInteger(id)) ? parsed : [];
  } catch {
    return [];
  }
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: loadInitial(),
  toggle: (id) => {
    const ids = get().ids;
    set({ ids: ids.includes(id) ? ids.filter((favoriteId) => favoriteId !== id) : [...ids, id] });
  },
  isFavorite: (id) => get().ids.includes(id),
  add: (id) => {
    if (!get().ids.includes(id)) set({ ids: [...get().ids, id] });
  },
  remove: (id) => set({ ids: get().ids.filter((favoriteId) => favoriteId !== id) }),
  clear: () => set({ ids: [] }),
}));

useFavoritesStore.subscribe((state) => {
  try {
    mmkvStorage.setItem(STORAGE_KEY, JSON.stringify(state.ids));
  } catch {
    // Storage failures should not prevent in-memory favorites from working.
  }
});
