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

// Estado inicial lido do storage (persist load síncrono — vantagem do MMKV).
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
  add: (id) =>
    set((s) => (s.ids.includes(id) ? s : { ids: [...s.ids, id] })),
  remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
  toggle: (id) =>
    set((s) =>
      s.ids.includes(id)
        ? { ids: s.ids.filter((x) => x !== id) }
        : { ids: [...s.ids, id] }
    ),
  clear: () => set({ ids: [] }),
  isFavorite: (id) => get().ids.includes(id),
}));

// Persist manual — salva no storage sempre que `ids` mudar.
//
// Por que persist manual em vez de middleware?
// Zustand devtools middleware usa import.meta.env (Vite-style) que quebra
// no Metro web bundler. Persist via subscribe evita o problema e é cleaner
// pedagogicamente — você vê exatamente quando o save acontece.
useFavoritesStore.subscribe((state) => {
  try {
    mmkvStorage.setItem(STORAGE_KEY, JSON.stringify(state.ids));
  } catch {}
});
