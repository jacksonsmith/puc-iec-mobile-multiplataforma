// src/store/favoritesStore.ts
//
// ATIVIDADE 2 — TASK 5 (Zustand favorites) + TASK 7 (persist manual + MMKV)

import { create } from 'zustand';
import { mmkvStorage } from '@/storage/mmkv';

type FavoritesState = {
  ids: number[];
  add: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  toggle: (id: number) => void;
  isFavorite: (id: number) => boolean;
};

const STORAGE_KEY = 'favorites-ids';

const loadInitial = (): number[] => {
  try {
    const raw = mmkvStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: loadInitial(),
  add: (id) =>
    set((state) => ({
      ids: state.ids.includes(id) ? state.ids : [...state.ids, id],
    })),
  remove: (id) =>
    set((state) => ({
      ids: state.ids.filter((item) => item !== id),
    })),
  clear: () => set({ ids: [] }),
  toggle: (id) => {
    const current = get().ids;
    if (current.includes(id)) {
      set({ ids: current.filter((item) => item !== id) });
      return;
    }

    set({ ids: [...current, id] });
  },
  isFavorite: (id) => get().ids.includes(id),
}));

useFavoritesStore.subscribe((state) => {
  try {
    mmkvStorage.setItem(STORAGE_KEY, JSON.stringify(state.ids));
  } catch {
    // noop para evitar quebrar em teste/web
  }
});
