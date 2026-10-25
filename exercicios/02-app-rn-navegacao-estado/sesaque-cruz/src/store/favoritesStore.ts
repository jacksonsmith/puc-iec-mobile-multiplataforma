// src/store/favoritesStore.ts
//
// ATIVIDADE 2: TASK 5 (Zustand favorites) + TASK 7 (persist manual + MMKV)
//
// Doc: https://github.com/pmndrs/zustand

import { create } from 'zustand';
import { mmkvStorage } from '@/storage/mmkv';

export const STORAGE_KEY = 'favorites-ids';

const loadInitial = (): number[] => {
  try {
    const raw = mmkvStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'number') : [];
  } catch {
    return [];
  }
};

type FavoritesState = {
  ids: number[];
  add: (id: number) => void;
  remove: (id: number) => void;
  toggle: (id: number) => void;
  clear: () => void;
  isFavorite: (id: number) => boolean;
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: loadInitial(),
  add: (id) => {
    if (!get().ids.includes(id)) set({ ids: [...get().ids, id] });
  },
  remove: (id) => set({ ids: get().ids.filter((fav) => fav !== id) }),
  toggle: (id) => (get().isFavorite(id) ? get().remove(id) : get().add(id)),
  clear: () => set({ ids: [] }),
  isFavorite: (id) => get().ids.includes(id),
}));

// Persist manual: MMKV é síncrono, então salva a cada mudança de ids sem await.
// Via subscribe em vez de importar zustand/middleware, cujo módulo inclui o
// devtools com import.meta.env, que quebra no bundler web do Metro.
useFavoritesStore.subscribe((state, prev) => {
  if (state.ids === prev.ids) return;
  try {
    mmkvStorage.setItem(STORAGE_KEY, JSON.stringify(state.ids));
  } catch (error) {
    console.warn('Falha ao salvar favoritos.', error);
  }
});
