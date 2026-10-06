// src/store/favoritesStore.ts
//
// ATIVIDADE 2 — TASK 5 (Zustand favorites) + TASK 7 (persist manual + MMKV)
//
// Doc: https://github.com/pmndrs/zustand

import { create } from 'zustand';
import { mmkvStorage } from '@/storage/mmkv';

type FavoritesState = {
  ids: number[];
  toggle: (id: number) => void;
  isFavorite: (id: number) => boolean;
  add: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const STORAGE_KEY = 'favorites-ids';

// Leitura síncrona (MMKV/localStorage): o 1º render já sai com os favoritos,
// sem estado de "carregando" como seria com o AsyncStorage (assíncrono).
const loadInitial = (): number[] => {
  try {
    const raw = mmkvStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    // o storage pode ter lixo (versão antiga, edição manual): só aceita números
    return Array.isArray(parsed) ? parsed.filter((x): x is number => typeof x === 'number') : [];
  } catch {
    return [];
  }
};

// ids nunca é mutado (push/splice): cada mudança cria um array novo, porque
// Zustand e React detectam mudança por referência. Quando não há o que mudar,
// set devolve o próprio estado e ninguém é notificado.
export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: loadInitial(),
  add: (id) => set((s) => (s.ids.includes(id) ? s : { ids: [...s.ids, id] })),
  remove: (id) =>
    set((s) => (s.ids.includes(id) ? { ids: s.ids.filter((x) => x !== id) } : s)),
  clear: () => set({ ids: [] }),
  toggle: (id) => {
    const { isFavorite, add, remove } = get();
    if (isFavorite(id)) remove(id);
    else add(id);
  },
  isFavorite: (id) => get().ids.includes(id),
}));

// Persist manual: grava sempre que ids muda. Como add/remove sem efeito não
// notificam (ver acima), não há escrita à toa.
useFavoritesStore.subscribe((state, prev) => {
  if (state.ids === prev.ids) return;
  try {
    mmkvStorage.setItem(STORAGE_KEY, JSON.stringify(state.ids));
  } catch {
    // storage cheio/bloqueado: os favoritos seguem em memória, o app não cai
  }
});

// Por que persist manual em vez de middleware?
// Zustand devtools middleware usa import.meta.env (Vite-style) que quebra
// no Metro web bundler. Persist via subscribe evita o problema e é cleaner
// pedagogicamente — você vê exatamente quando o save acontece.
