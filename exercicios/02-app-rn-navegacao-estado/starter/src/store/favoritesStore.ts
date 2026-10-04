import { create } from "zustand";
import { mmkvStorage } from "@/storage/mmkv";

type FavoritesState = {
  ids: number[];
  add: (id: number) => void;
  remove: (id: number) => void;
  toggle: (id: number) => void;
  clear: () => void;
  isFavorite: (id: number) => boolean;
};

const STORAGE_KEY = "favorites-ids";
const loadInitial = (): number[] => {
  try {
    const raw = mmkvStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) && parsed.every((id) => typeof id === "number") ? parsed : [];
  } catch {
    return [];
  }
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: loadInitial(),
  add: (id) =>
    set((state) => ({
      ids: state.ids.includes(id) ? state.ids : [...state.ids, id],
    })),
  remove: (id) =>
    set((state) => ({
      ids: state.ids.filter((favoriteId) => favoriteId !== id),
    })),
  toggle: (id) => {
    const isAlreadyFavorite = get().isFavorite(id);
    set({ ids: isAlreadyFavorite ? get().ids.filter((favoriteId) => favoriteId !== id) : [...get().ids, id] });
  },
  isFavorite: (id) => get().ids.includes(id),
  clear: () => set({ ids: [] }),
}));

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
