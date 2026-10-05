// __tests__/favoritesStore.test.ts
//
// ATIVIDADE 2 — testar useFavoritesStore.

import { useFavoritesStore } from '../src/store/favoritesStore';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona o id quando ele ainda não existe', () => {
    useFavoritesStore.getState().toggle(42);

    expect(useFavoritesStore.getState().ids).toEqual([42]);
    expect(useFavoritesStore.getState().isFavorite(42)).toBe(true);
  });

  test('toggle remove o id quando ele já existe', () => {
    useFavoritesStore.setState({ ids: [42] });

    useFavoritesStore.getState().toggle(42);

    expect(useFavoritesStore.getState().ids).toEqual([]);
    expect(useFavoritesStore.getState().isFavorite(42)).toBe(false);
  });

  test('clear remove todos os ids favoritos', () => {
    useFavoritesStore.setState({ ids: [1, 2, 3] });

    useFavoritesStore.getState().clear();

    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('isFavorite retorna true para ids salvos', () => {
    useFavoritesStore.setState({ ids: [7] });

    expect(useFavoritesStore.getState().isFavorite(7)).toBe(true);
    expect(useFavoritesStore.getState().isFavorite(99)).toBe(false);
  });
});
