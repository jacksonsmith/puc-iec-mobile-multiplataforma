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

export const STORAGE_KEY = 'favorites-ids';

// MMKV é síncrono → dá pra ler o valor salvo já na criação do store,
// sem estado de "carregando" (com AsyncStorage isso seria uma Promise).
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
  // Devolver o próprio estado (s) quando nada muda faz o Zustand não notificar
  // ninguém — nem re-render, nem escrita no storage.
  add: (id) => set((s) => (s.ids.includes(id) ? s : { ids: [...s.ids, id] })),
  remove: (id) => set((s) => ({ ids: s.ids.filter((favId) => favId !== id) })),
  toggle: (id) => (get().isFavorite(id) ? get().remove(id) : get().add(id)),
  clear: () => set({ ids: [] }),
  isFavorite: (id) => get().ids.includes(id),
}));

// Persist manual: salva no storage sempre que ids mudar.
//
// Por que persist manual em vez de middleware?
// Zustand devtools middleware usa import.meta.env (Vite-style) que quebra
// no Metro web bundler. Persist via subscribe evita o problema e é cleaner
// pedagogicamente — você vê exatamente quando o save acontece.
useFavoritesStore.subscribe((state, prev) => {
  if (state.ids === prev.ids) return;
  try {
    mmkvStorage.setItem(STORAGE_KEY, JSON.stringify(state.ids));
  } catch {}
});
