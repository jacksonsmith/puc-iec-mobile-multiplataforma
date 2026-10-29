// __tests__/favoritesStore.test.ts
//
// ATIVIDADE 2 — testar useFavoritesStore.
//
// [TASK 9] — Testes com IA (favorites)
// Gerado/expandido com auxílio de IA. Prompt sugerido:
//   "Gere testes Jest pra useFavoritesStore (Zustand) cobrindo:
//    - toggle adiciona id se não existe
//    - toggle remove id se existe
//    - isFavorite retorna true após add
//    - clear esvazia ids
//    Use describe + beforeEach pra resetar state."
//
// Mínimo 3 testes verdes pra CI passar (somados aos 4 de counterStore = 8 total ≥ 6).

import { useFavoritesStore } from '../src/store/favoritesStore';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona id quando não existe', () => {
    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().ids).toEqual([42]);
  });

  test('toggle remove id quando já existe', () => {
    useFavoritesStore.setState({ ids: [42, 7, 99] });
    useFavoritesStore.getState().toggle(7);
    expect(useFavoritesStore.getState().ids).toEqual([42, 99]);
  });

  test('isFavorite retorna true após adicionar via toggle', () => {
    expect(useFavoritesStore.getState().isFavorite(123)).toBe(false);
    useFavoritesStore.getState().toggle(123);
    expect(useFavoritesStore.getState().isFavorite(123)).toBe(true);
  });

  test('clear esvazia ids após múltiplos toggles', () => {
    const { toggle, clear } = useFavoritesStore.getState();
    toggle(1);
    toggle(2);
    toggle(3);
    expect(useFavoritesStore.getState().ids).toEqual([1, 2, 3]);

    clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('edge case: toggle alterna id (add → remove → add)', () => {
    const { toggle } = useFavoritesStore.getState();

    toggle(5);
    expect(useFavoritesStore.getState().ids).toEqual([5]);

    toggle(5);
    expect(useFavoritesStore.getState().ids).toEqual([]);

    toggle(5);
    expect(useFavoritesStore.getState().ids).toEqual([5]);
  });
});