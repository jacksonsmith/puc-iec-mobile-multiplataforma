// src/store/favoritesStore.ts
//
// ATIVIDADE 2 — TASK 5 (Zustand favorites) + TASK 7 (persist manual + MMKV)
//
// Doc: https://github.com/pmndrs/zustand

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { persistedStorage } from '../storage/mmkv';

type FavoritesState = {
  ids: number[];
  toggle: (id: number) => void;
  isFavorite: (id: number) => boolean;
  add: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

// TODO [TASK 7]: ler estado inicial do storage (persist load)
// const STORAGE_KEY = 'favorites-ids';
// const loadInitial = (): number[] => {
//   try {
//     const raw = mmkvStorage.getItem(STORAGE_KEY);
//     return raw ? JSON.parse(raw) : [];
//   } catch { return []; }
// };

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) => set((s) => ({ ids: [...s.ids, id] })),
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
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
    }),
    {
      name: 'favorites',
      storage: createJSONStorage(() => persistedStorage),
    }
  )
);

// TODO [TASK 7]: persist manual — salva no storage sempre que ids mudar
// useFavoritesStore.subscribe((state) => {
//   try {
//     mmkvStorage.setItem('favorites-ids', JSON.stringify(state.ids));
//   } catch {}
// });
//
// Por que persist manual em vez de middleware?
// Zustand devtools middleware usa import.meta.env (Vite-style) que quebra
// no Metro web bundler. Persist via subscribe evita o problema e é cleaner
// pedagogicamente — você vê exatamente quando o save acontece.
