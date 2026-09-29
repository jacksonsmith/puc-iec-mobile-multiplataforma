// __tests__/favoritesStore.test.ts
//
// Tests for useFavoritesStore (Zustand)

import { useFavoritesStore } from '../src/store/favoritesStore';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });
  test('toggle adiciona id se não existe', () => {
    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().ids).toContain(42);
  });

  test('toggle remove id se existe', () => {
    useFavoritesStore.setState({ ids: [7] });
    useFavoritesStore.getState().toggle(7);
    expect(useFavoritesStore.getState().ids).not.toContain(7);
  });

  test('isFavorite retorna true após add', () => {
    useFavoritesStore.getState().add(5);
    expect(useFavoritesStore.getState().isFavorite(5)).toBe(true);
  });

  test('clear esvazia ids', () => {
    useFavoritesStore.setState({ ids: [1, 2, 3] });
    useFavoritesStore.getState().clear();
    expect(useFavoritesStore.getState().ids.length).toBe(0);
  });
});
