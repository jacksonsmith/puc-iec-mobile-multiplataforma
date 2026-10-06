// __tests__/favoritesStore.test.ts
//
// ATIVIDADE 2 — testar useFavoritesStore.
//
// TODO [TASK 9]: gerar testes pra favoritesStore usando IA.
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

  test('toggle adiciona id se não existe', () => {
    useFavoritesStore.getState().toggle(10);
    expect(useFavoritesStore.getState().ids).toEqual([10]);
  });

  test('toggle remove id se existe', () => {
    useFavoritesStore.setState({ ids: [10, 20] });
    useFavoritesStore.getState().toggle(10);
    expect(useFavoritesStore.getState().ids).toEqual([20]);
  });

  test('isFavorite retorna true após add e false após remove', () => {
    const { add, remove, isFavorite } = useFavoritesStore.getState();
    expect(isFavorite(42)).toBe(false);

    add(42);
    expect(useFavoritesStore.getState().isFavorite(42)).toBe(true);

    remove(42);
    expect(isFavorite(42)).toBe(false);
  });

  test('add não duplica id já favoritado', () => {
    const { add } = useFavoritesStore.getState();
    add(7);
    add(7);
    expect(useFavoritesStore.getState().ids).toEqual([7]);
  });

  test('clear esvazia ids', () => {
    useFavoritesStore.setState({ ids: [1, 2, 3] });
    useFavoritesStore.getState().clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });
});
