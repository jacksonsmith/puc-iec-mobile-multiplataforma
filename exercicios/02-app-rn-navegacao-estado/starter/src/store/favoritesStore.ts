// src/store/favoritesStore.ts
//
// ATIVIDADE 2 — TASK 5 (Zustand favorites) + TASK 7 (persist manual + MMKV)
//
// Doc: https://github.com/pmndrs/zustand

import { create } from "zustand";
// TODO [TASK 7]: descomentar quando implementar persist (depois de mmkv.ts pronto)
import { mmkvStorage } from "@/storage/mmkv";

type FavoritesState = {
  ids: number[];
  toggle: (id: number) => void;
  isFavorite: (id: number) => boolean;
  add: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

// TODO [TASK 7]: ler estado inicial do storage (persist load)
const STORAGE_KEY = "favorites-ids";
const loadInitial = (): number[] => {
  try {
    const raw = mmkvStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// TODO [TASK 5]: implementar actions abaixo
export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: loadInitial(),
  toggle: (id) => {
    const { ids, remove, add } = get();
    const exists = ids.includes(id);

    exists ? remove(id) : add(id);
  },
  isFavorite: (id) => get().ids.includes(id),
  add: (id) => {
    const ids = get().ids;

    set({
      ids: ids.includes(id) ? ids : [...ids, id],
    });
  },
  remove: (id) => {
    const ids = get().ids;

    set({
      ids: ids.filter((i) => i !== id),
    });
  },
  clear: () => {
    set({
      ids: [],
    });
  },
}));

// TODO [TASK 7]: persist manual — salva no storage sempre que ids mudar
useFavoritesStore.subscribe((state) => {
  try {
    mmkvStorage.setItem("favorites-ids", JSON.stringify(state.ids));
  } catch {}
});
//
// Por que persist manual em vez de middleware?
// Zustand devtools middleware usa import.meta.env (Vite-style) que quebra
// no Metro web bundler. Persist via subscribe evita o problema e é cleaner
// pedagogicamente — você vê exatamente quando o save acontece.
