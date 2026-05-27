// src/store/favoritesStore.ts
//
// ATIVIDADE 2 — Passo 1 (Zustand favorites) + Passo 2 (persist + MMKV)
//
// Doc:
// - Zustand persist: https://docs.pmnd.rs/zustand/integrations/persisting-store-data
// - MMKV: https://github.com/mrousavy/react-native-mmkv

import { create } from 'zustand';
// TODO [TASK 7]: descomente os 2 imports abaixo (depois de fazer TASK 6 e TASK 7 do mmkv.ts)
// import { persist, createJSONStorage } from 'zustand/middleware';
// import { mmkvStorage } from '../storage/mmkv';

type FavoritesState = {
  ids: number[];
  toggle: (id: number) => void;
  isFavorite: (id: number) => boolean;
  // TODO [TASK 5]: declarar tipos das actions add, remove, clear
  //   add: (id: number) => void;
  //   remove: (id: number) => void;
  //   clear: () => void;
};

// TODO [TASK 5]: implementar action toggle (e add, remove, clear)
// TODO [TASK 7]: envolver create((set, get) => ...) com persist(..., {
//                name: 'favorites', storage: createJSONStorage(() => mmkvStorage) })
export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: [],
  toggle: (id) => {
    // TODO [TASK 5]: implementar
    // - se id já existe em ids → remover
    // - se não existe → adicionar
    // Dica: usa get() pra ler ids atual, set({ ids: ... }) pra atualizar
  },
  isFavorite: (id) => get().ids.includes(id),
}));
