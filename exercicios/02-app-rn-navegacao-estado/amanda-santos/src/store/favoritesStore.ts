import { create } from 'zustand';
import { mmkvStorage } from '@/storage/mmkv';
export const STORAGE_KEY = 'favorites-ids';
export function loadFavorites(): number[] {
 try {
  const parsed: unknown = JSON.parse(mmkvStorage.getItem(STORAGE_KEY) ?? '[]');
  return Array.isArray(parsed) ? [...new Set(parsed.filter((id): id is number => typeof id === 'number' && Number.isInteger(id) && id > 0))] : [];
 } catch { return []; }
}
type FavoritesState = {
 ids: number[]; add: (id: number) => void; remove: (id: number) => void;
 toggle: (id: number) => void; clear: () => void; isFavorite: (id: number) => boolean;
};
export const useFavoritesStore = create<FavoritesState>((set, get) => ({
 ids: loadFavorites(),
 add: id => set(s => ({ids: s.ids.includes(id) ? s.ids : [...s.ids, id]})),
 remove: id => set(s => ({ids: s.ids.filter(x => x !== id)})),
 toggle: id => get().isFavorite(id) ? get().remove(id) : get().add(id),
 clear: () => set({ids: []}), isFavorite: id => get().ids.includes(id),
}));
useFavoritesStore.subscribe((state, previous) => {
 if (state.ids === previous.ids) return;
 try { mmkvStorage.setItem(STORAGE_KEY, JSON.stringify(state.ids)); }
 catch { console.warn('Não foi possível persistir os favoritos neste dispositivo.'); }
});
