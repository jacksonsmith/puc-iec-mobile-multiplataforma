// __tests__/favoritesStore.test.ts
//
// ATIVIDADE 2 — testar useFavoritesStore.

import { useFavoritesStore } from '../src/store/favoritesStore';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona id se não existe', () => {
    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().ids).toEqual([42]);
  });

  test('toggle remove id se já existe', () => {
    useFavoritesStore.setState({ ids: [1, 42, 3] });
    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().ids).toEqual([1, 3]);
  });

  test('isFavorite retorna true após add e false para id ausente', () => {
    useFavoritesStore.getState().toggle(7);
    expect(useFavoritesStore.getState().isFavorite(7)).toBe(true);
    expect(useFavoritesStore.getState().isFavorite(8)).toBe(false);
  });

  test('isFavorite volta a false após toggle duplo', () => {
    useFavoritesStore.getState().toggle(7);
    useFavoritesStore.getState().toggle(7);
    expect(useFavoritesStore.getState().isFavorite(7)).toBe(false);
  });

  test('clear esvazia ids', () => {
    useFavoritesStore.setState({ ids: [1, 2, 3] });
    useFavoritesStore.getState().clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });
});
