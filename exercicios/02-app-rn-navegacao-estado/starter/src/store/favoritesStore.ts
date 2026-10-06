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

  add: (id) => {
    const ids = get().ids;

    if (!ids.includes(id)) {
      set({
        ids: [...ids, id],
      });
    }
  },

  remove: (id) => {
    set({
      ids: get().ids.filter((favoriteId) => favoriteId !== id),
    });
  },

  clear: () => {
    set({
      ids: [],
    });
  },

  toggle: (id) => {
    const ids = get().ids;

    if (ids.includes(id)) {
      set({
        ids: ids.filter((favoriteId) => favoriteId !== id),
      });
    } else {
      set({
        ids: [...ids, id],
      });
    }
  },

  isFavorite: (id) => get().ids.includes(id),
}));

useFavoritesStore.subscribe((state) => {
  try {
    mmkvStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state.ids)
    );
  } catch {
    // Evita que uma falha de storage quebre a aplicação
  }
});