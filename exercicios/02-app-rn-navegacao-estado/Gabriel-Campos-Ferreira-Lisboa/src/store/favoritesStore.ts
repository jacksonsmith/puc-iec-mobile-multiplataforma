import { create } from 'zustand';
import { mmkvStorage } from '../storage/mmkv';

const STORAGE_KEY = 'favorites-ids';

type FavoritesState = {
    ids: number[];
    add: (id: number) => void;
    remove: (id: number) => void;
    toggle: (id: number) => void;
    clear: () => void;
    isFavorite: (id: number) => boolean;
};

const loadInitialIds = (): number[] => {
    try {
        const raw = mmkvStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const value: unknown = JSON.parse(raw);
        if (!Array.isArray(value)) return [];
        return [...new Set(value.filter((id): id is number => Number.isInteger(id)))];
    } catch {
        return [];
    }
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
    ids: loadInitialIds(),
    add: (id) => {
        if (!Number.isInteger(id)) return;
        set((state) => (state.ids.includes(id) ? state : { ids: [...state.ids, id] }));
    },
    remove: (id) => set((state) => ({ ids: state.ids.filter((favoriteId) => favoriteId !== id) })),
    toggle: (id) => {
        if (!Number.isInteger(id)) return;
        set((state) => ({
            ids: state.ids.includes(id)
                ? state.ids.filter((favoriteId) => favoriteId !== id)
                : [...state.ids, id],
        }));
    },
    clear: () => set({ ids: [] }),
    isFavorite: (id) => get().ids.includes(id),
}));

// MMKV é síncrono: cada alteração do estado grava imediatamente os IDs.
useFavoritesStore.subscribe(({ ids }) => {
    try {
        mmkvStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
        // A falha de persistência não deve interromper a interação no app.
    }
});
