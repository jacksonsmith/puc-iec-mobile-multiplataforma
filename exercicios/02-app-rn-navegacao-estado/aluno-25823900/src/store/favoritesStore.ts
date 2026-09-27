// src/store/favoritesStore.ts
//
// ATIVIDADE 2 — TASK 5 (Zustand favorites) + TASK 7 (persist manual + MMKV)
//
// Doc: https://github.com/pmndrs/zustand

import { create } from 'zustand';
import { mmkvStorage } from '@/storage/mmkv';

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
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return [...new Set(parsed.filter((id): id is number => Number.isSafeInteger(id) && id > 0))];
  } catch {
    return [];
  }
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: loadInitial(),
  add: (id) =>
    set((state) => (state.ids.includes(id) ? state : { ids: [...state.ids, id] })),
  remove: (id) => set((state) => ({ ids: state.ids.filter((favoriteId) => favoriteId !== id) })),
  toggle: (id) =>
    set((state) => ({
      ids: state.ids.includes(id)
        ? state.ids.filter((favoriteId) => favoriteId !== id)
        : [...state.ids, id],
    })),
  clear: () => set({ ids: [] }),
  isFavorite: (id) => get().ids.includes(id),
}));

useFavoritesStore.subscribe((state, previousState) => {
  if (state.ids === previousState.ids) return;

  try {
    mmkvStorage.setItem(STORAGE_KEY, JSON.stringify(state.ids));
  } catch (error) {
    console.warn('[favoritesStore] Não foi possível persistir os favoritos:', error);
  }
});
