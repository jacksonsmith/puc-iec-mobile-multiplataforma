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

// Lê os ids salvos no MMKV. Se o JSON estiver corrompido, começa vazio.
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
  toggle: (id) => {
    if (get().ids.includes(id)) get().remove(id);
    else get().add(id);
  },
  add: (id) => {
    if (get().ids.includes(id)) return;
    set({ ids: [...get().ids, id] });
  },
  remove: (id) => set({ ids: get().ids.filter((x) => x !== id) }),
  clear: () => set({ ids: [] }),
  isFavorite: (id) => get().ids.includes(id),
}));

// Persist manual: salva no MMKV toda vez que ids muda.
// Por que não middleware persist? Ver nota no README (import.meta no Metro web).
useFavoritesStore.subscribe((state) => {
  try {
    mmkvStorage.setItem(STORAGE_KEY, JSON.stringify(state.ids));
  } catch {
    // falha de escrita não deve derrubar a UI
  }
});
