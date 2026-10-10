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

export const STORAGE_KEY = 'favorites-ids';

const loadInitial = (): number[] => {
  try {
    const raw = mmkvStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is number => typeof x === 'number') : [];
  } catch {
    return [];
  }
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: loadInitial(),
  add: (id) => set((s) => (s.ids.includes(id) ? s : { ids: [...s.ids, id] })),
  remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
  toggle: (id) => (get().ids.includes(id) ? get().remove(id) : get().add(id)),
  clear: () => set({ ids: [] }),
  isFavorite: (id) => get().ids.includes(id),
}));

useFavoritesStore.subscribe((state, prev) => {
  if (state.ids === prev.ids) return;
  try {
    mmkvStorage.setItem(STORAGE_KEY, JSON.stringify(state.ids));
  } catch (e) {
    console.warn('[favorites] falha ao salvar:', e);
  }
});
