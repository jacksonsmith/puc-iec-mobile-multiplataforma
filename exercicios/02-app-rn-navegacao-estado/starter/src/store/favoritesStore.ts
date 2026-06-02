// src/store/favoritesStore.ts
//
// ATIVIDADE 2 — TASK 5 (Zustand favorites) + TASK 7 (persist manual + MMKV)
//
// Doc: https://github.com/pmndrs/zustand

import { create } from 'zustand';
// DONE [TASK 7]: descomentar quando implementar persist (depois de mmkv.ts pronto)
import { mmkvStorage } from '@/storage/mmkv';

type FavoritesState = {
  ids: number[];
  toggle: (id: number) => void;
  isFavorite: (id: number) => boolean;
  // DONE [TASK 5]: declarar tipos das actions add, remove, clear
  add: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

// DONE [TASK 7]: ler estado inicial do storage (persist load)
const STORAGE_KEY = 'favorites-ids';
const loadInitial = (): number[] => {
  try {
    const raw = mmkvStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// DONE [TASK 5]: implementar actions abaixo
export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: loadInitial(), // DONE [TASK 7]: trocar por loadInitial() pra carregar do storage
  add: (id) => set((s) => ({ ids: [...s.ids, id] })),
  remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
  toggle: (id) => {
    // DONE [TASK 5]: implementar
    // - se id já existe em ids → remover
    // - se não existe → adicionar
    // Dica: usa get() pra ler ids atual, set({ ids: ... }) pra atualizar
    const current = get().ids;
    if (current.includes(id)) {
      set({ ids: current.filter((x) => x !== id) });
    } else {
      set({ ids: [...current, id] });
    }
  },
  clear: () => set({ ids: [] }),
  isFavorite: (id) => get().ids.includes(id),
}));

// DONE [TASK 7]: persist manual — salva no storage sempre que ids mudar
useFavoritesStore.subscribe((state) => {
  try {
    mmkvStorage.setItem(STORAGE_KEY, JSON.stringify(state.ids));
  } catch {}
});
//
// Por que persist manual em vez de middleware?
// Zustand devtools middleware usa import.meta.env (Vite-style) que quebra
// no Metro web bundler. Persist via subscribe evita o problema e é cleaner
// pedagogicamente — você vê exatamente quando o save acontece.
