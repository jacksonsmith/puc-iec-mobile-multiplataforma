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
  // TODO [TASK 5]: declarar tipos das actions add, remove, clear
    add: (id: number) => void;
    remove: (id: number) => void;
    clear: () => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => set((state) => ({
        ids: state.ids.includes(id)
          ? state.ids.filter((favoriteId) => favoriteId !== id)
          : [...state.ids, id],
      })),
      isFavorite: (id) => get().ids.includes(id),
      add: (id) => set((state) => ({
        ids: state.ids.includes(id) ? state.ids : [...state.ids, id],
      })),
      remove: (id) => set((state) => ({
        ids: state.ids.filter((favoriteId) => favoriteId !== id),
      })),
      clear: () => set({ ids: [] }),
    }),
    {
      name: 'favorites-ids',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ ids: state.ids }),
    },
  ),
);
