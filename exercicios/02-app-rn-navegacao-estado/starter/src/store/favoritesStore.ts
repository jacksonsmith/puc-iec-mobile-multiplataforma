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
      add: (id) =>
        set((state) => (state.ids.includes(id) ? state : { ids: [...state.ids, id] })),
      remove: (id) => set((state) => ({ ids: state.ids.filter((favoriteId) => favoriteId !== id) })),
      toggle: (id) => {
        if (get().ids.includes(id)) {
          set((state) => ({ ids: state.ids.filter((favoriteId) => favoriteId !== id) }));
        } else {
          set((state) => ({ ids: [...state.ids, id] }));
        }
      },
      clear: () => set({ ids: [] }),
      isFavorite: (id) => get().ids.includes(id),
    }),
    {
      name: 'favorites',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
