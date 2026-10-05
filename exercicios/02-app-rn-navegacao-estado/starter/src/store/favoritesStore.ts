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
  add: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  isFavorite: (id: number) => boolean;
};

const STORAGE_KEY = 'favorites-ids';

const loadInitial = (): number[] => {
  try {
    const raw = mmkvStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed)
      ? [...new Set(parsed.filter((id): id is number => typeof id === 'number'))]
      : [];
  } catch {
    return [];
  }
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: loadInitial(),
  toggle: (id) => (get().isFavorite(id) ? get().remove(id) : get().add(id)),
  add: (id) => set((state) => ({
    ids: state.ids.includes(id) ? state.ids : [...state.ids, id],
  })),
  remove: (id) => set((state) => ({
    ids: state.ids.filter((favoriteId) => favoriteId !== id),
  })),
  clear: () => set({ ids: [] }),
  isFavorite: (id) => get().ids.includes(id),
}));

useFavoritesStore.subscribe((state, previousState) => {
  if (state.ids === previousState.ids) return;

  try {
    mmkvStorage.setItem(STORAGE_KEY, JSON.stringify(state.ids));
  } catch {
    // A store continua funcional se o dispositivo estiver sem storage disponível.
  }
});
//
// Por que persist manual em vez de middleware?
// Zustand devtools middleware usa import.meta.env (Vite-style) que quebra
// no Metro web bundler. Persist via subscribe evita o problema e é cleaner
// pedagogicamente — você vê exatamente quando o save acontece.
