// __tests__/favoritesStore.test.ts
//
// ATIVIDADE 2 — testar useFavoritesStore.
//
// DONE [TASK 9]: gerar testes pra favoritesStore usando IA.
//
// Prompt sugerido:
//   "Gere testes Jest pra useFavoritesStore (Zustand) cobrindo:
//    - toggle adiciona id se não existe
//    - toggle remove id se existe
//    - isFavorite retorna true após add
//    - clear esvazia ids
//    Use describe + beforeEach pra resetar state."
//
// Mínimo 3 testes verdes pra CI passar (somados aos 3 de counterStore = 6 total).

import { useFavoritesStore } from '../src/store/favoritesStore';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  // DONE [TASK 9]: adicione 3+ testes aqui (use IA).
  test('toggle adiciona id se não existe e remove se existe', () => {
    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().isFavorite(42)).toBe(true);
    expect(useFavoritesStore.getState().ids).toEqual([42]);
    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().isFavorite(42)).toBe(false);
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('isFavorite retorna true após add', () => {
    useFavoritesStore.getState().add(7);
    expect(useFavoritesStore.getState().isFavorite(7)).toBe(true);
    expect(useFavoritesStore.getState().isFavorite(99)).toBe(false);
  });

  test('clear esvazia ids', () => {
    useFavoritesStore.getState().add(10);
    useFavoritesStore.getState().add(20);
    useFavoritesStore.getState().clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
    expect(useFavoritesStore.getState().isFavorite(10)).toBe(false);
  });
});
