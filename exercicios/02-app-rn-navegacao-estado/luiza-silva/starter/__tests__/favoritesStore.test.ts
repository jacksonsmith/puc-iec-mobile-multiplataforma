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

  // TODO [TASK 9]: adicione 3+ testes aqui (use IA).
  test.skip('placeholder — remova quando implementar', () => {
    expect(true).toBe(true);
  });

  describe('toggle', () => {
    test('adiciona id se não existe', () => {
      useFavoritesStore.getState().toggle(1);
      expect(useFavoritesStore.getState().ids).toContain(1);
    });

    test('remove id se já existe', () => {
      useFavoritesStore.setState({ ids: [1] });
      useFavoritesStore.getState().toggle(1);
      expect(useFavoritesStore.getState().ids).not.toContain(1);
    });

    test('não afeta outros ids ao remover', () => {
      useFavoritesStore.setState({ ids: [1, 2, 3] });
      useFavoritesStore.getState().toggle(2);
      expect(useFavoritesStore.getState().ids).toEqual([1, 3]);
    });
  });

  describe('isFavorite', () => {
    test('retorna true após add', () => {
      useFavoritesStore.getState().add(42);
      expect(useFavoritesStore.getState().isFavorite(42)).toBe(true);
    });

    test('retorna false se id não existe', () => {
      expect(useFavoritesStore.getState().isFavorite(99)).toBe(false);
    });

    test('retorna false após remove', () => {
      useFavoritesStore.setState({ ids: [5] });
      useFavoritesStore.getState().remove(5);
      expect(useFavoritesStore.getState().isFavorite(5)).toBe(false);
    });
  });

  describe('add', () => {
    test('não duplica id já existente', () => {
      useFavoritesStore.getState().add(1);
      useFavoritesStore.getState().add(1);
      expect(useFavoritesStore.getState().ids).toEqual([1]);
    });
  });

  describe('clear', () => {
    test('esvazia ids', () => {
      useFavoritesStore.setState({ ids: [1, 2, 3] });
      useFavoritesStore.getState().clear();
      expect(useFavoritesStore.getState().ids).toHaveLength(0);
    });
  });
});
