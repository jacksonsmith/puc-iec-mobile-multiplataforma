import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { toggleFavorite } from '@/domain/favorites';

const STORAGE_KEY = 'ghibli:favorites:v1';

type FavoritesState = {
  favoriteIds: string[];
  toggle: (filmId: string) => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      favoriteIds: [],
      toggle: (filmId) =>
        set((state) => ({ favoriteIds: toggleFavorite(state.favoriteIds, filmId) })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export function useFavoritesHydrated() {
  return useSyncExternalStore(
    useFavoritesStore.persist.onFinishHydration,
    useFavoritesStore.persist.hasHydrated,
  );
}
