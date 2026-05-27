// src/store/favoritesStore.ts
//
// ATIVIDADE 2 — Passo 1 (Zustand favorites) + Passo 2 (persist + MMKV)
//
// Doc:
// - Zustand persist: https://docs.pmnd.rs/zustand/integrations/persisting-store-data
// - MMKV: https://github.com/mrousavy/react-native-mmkv

import { create } from 'zustand';
// TODO [Atv2 — Passo 2.1]: descomente os 2 imports abaixo
// import { persist, createJSONStorage } from 'zustand/middleware';
// import { mmkvStorage } from '../storage/mmkv';

type FavoritesState = {
  ids: number[];
  toggle: (id: number) => void;
  isFavorite: (id: number) => boolean;
  // TODO [Atv2 — Passo 1.1]: declarar tipos das actions add, remove, clear
  //   add: (id: number) => void;
  //   remove: (id: number) => void;
  //   clear: () => void;
};

// TODO [Atv2 — Passo 1.2]: implementar actions abaixo
// TODO [Atv2 — Passo 2.2]: envolver create((set, get) => ...) com persist(..., {
//                          name: 'favorites', storage: createJSONStorage(() => mmkvStorage) })
export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: [],
  toggle: (id) => {
    // TODO [Atv2 — Passo 1.2]: implementar
    // - se id já existe em ids → remover
    // - se não existe → adicionar
    // Dica: usa get() pra ler ids atual, set({ ids: ... }) pra atualizar
  },
  isFavorite: (id) => get().ids.includes(id),
}));
