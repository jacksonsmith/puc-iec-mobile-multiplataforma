// src/store/favoritesStore.ts
//
// ATIVIDADE 2 — TASK 5 (Zustand favorites) + TASK 7 (persist manual + MMKV)
//
// Doc: https://github.com/pmndrs/zustand

import { create } from "zustand";
// TODO [TASK 7]: descomentar quando implementar persist (depois de mmkv.ts pronto)
// import { mmkvStorage } from '@/storage/mmkv';

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

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: [], // TODO [TASK 7]: trocar por loadInitial() pra carregar do storage
  add: (id) => {
    if (get().ids.includes(id)) return;
    set({ ids: [...get().ids, id] });
  },
  remove: (id) => set({ ids: get().ids.filter((favId) => favId !== id) }),
  toggle: (id) => {
    if (get().isFavorite(id)) {
      get().remove(id);
    } else {
      get().add(id);
    }
  },
  clear: () => set({ ids: [] }),
  isFavorite: (id) => get().ids.includes(id),
}));

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
