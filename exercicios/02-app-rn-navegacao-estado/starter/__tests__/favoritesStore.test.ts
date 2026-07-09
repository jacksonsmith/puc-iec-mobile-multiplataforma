// __tests__/favoritesStore.test.ts
//
// ATIVIDADE 2 — testar useFavoritesStore.

import { useFavoritesStore } from '../src/store/favoritesStore';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona id se nao existe', () => {
    useFavoritesStore.getState().toggle(10);

    expect(useFavoritesStore.getState().ids).toEqual([10]);
  });

  test('toggle remove id se existe', () => {
    useFavoritesStore.setState({ ids: [10] });

    useFavoritesStore.getState().toggle(10);

    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('isFavorite retorna true apos add', () => {
    useFavoritesStore.getState().add(20);

    expect(useFavoritesStore.getState().isFavorite(20)).toBe(true);
  });

  test('clear esvazia ids', () => {
    useFavoritesStore.setState({ ids: [10, 20] });

    useFavoritesStore.getState().clear();

    expect(useFavoritesStore.getState().ids).toEqual([]);
  });
});
