// src/store/favoritesStore.ts
//
// ATIVIDADE 2 — TASK 5 (Zustand favorites) + TASK 7 (persist manual + MMKV)
//
// Doc: https://github.com/pmndrs/zustand

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '@/storage/mmkv';

type FavoritesState = {
  ids: number[];
  toggle: (id: number) => void;
  isFavorite: (id: number) => boolean;

  add: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],

      add: (id) => {
        const ids = get().ids;

        if (!ids.includes(id)) {
          set({ ids: [...ids, id] });
        }
      },

      remove: (id) => {
        const ids = get().ids;

        set({
          ids: ids.filter((favoriteId) => favoriteId !== id),
        });
      },

      clear: () => {
        set({ ids: [] });
      },

      toggle: (id) => {
        const ids = get().ids;

        if (ids.includes(id)) {
          get().remove(id);
        } else {
          get().add(id);
        }
      },

      isFavorite: (id) => get().ids.includes(id),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);