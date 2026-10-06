// src/store/counterStore.ts
//
// HANDS-ON AULA 2 — Passo 3 (Zustand counter)
//
// Doc Zustand: https://github.com/pmndrs/zustand
//
// Conceitos:
// - Store = singleton fora da árvore React
// - Hook gerado pelo create() consumido direto em componentes
// - Sem Provider, sem configureStore (diferente do Redux)

import { create } from 'zustand';

// Estado + actions no mesmo tipo: o store guarda os dados e as funções que os alteram.
type CounterState = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

// set() faz merge raso: só a chave devolvida muda, as actions continuam no store.
// - set((s) => ...) quando o próximo valor depende do atual (lê o estado mais recente)
// - set({ ... }) quando o valor é fixo
export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  decrement: () => set((s) => ({ count: s.count - 1 })),
  reset: () => set({ count: 0 }),
}));
