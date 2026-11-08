// src/store/favoritesStore.ts
//
// ATIVIDADE 2 — TASK 5 (Zustand favorites) + TASK 7 (persist manual + MMKV)
//
// Doc: https://github.com/pmndrs/zustand
//
// Persistência manual via subscribe: o starter evita o middleware `persist`
// porque o bundle web do Metro tem problema com import.meta.env. Aqui o fluxo
// é explícito: toda mudança em `ids` grava o array serializado no MMKV.

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

/** Lê o estado persistido na criação do store (app abrindo/reabrindo). */
const loadInitial = (): number[] => {
  try {
    const raw = mmkvStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Sanitiza: só ids numéricos válidos.
    return parsed.filter((id): id is number => typeof id === 'number' && Number.isFinite(id));
  } catch {
    return [];
  }
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: loadInitial(),
  add: (id) =>
    set((s) => (s.ids.includes(id) ? s : { ids: [...s.ids, id] })),
  remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
  toggle: (id) => {
    const current = get().ids;
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    set({ ids: next });
  },
  clear: () => set({ ids: [] }),
  isFavorite: (id) => get().ids.includes(id),
}));

// Persist manual: salva no storage sempre que `ids` mudar.
useFavoritesStore.subscribe((state) => {
  try {
    mmkvStorage.setItem(STORAGE_KEY, JSON.stringify(state.ids));
  } catch {
    // Falha de storage não deve derrubar a UI.
  }
});
