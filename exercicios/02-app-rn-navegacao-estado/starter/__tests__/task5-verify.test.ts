import { useFavoritesStore } from '../src/store/favoritesStore';

describe('task5 favoritesStore verify', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona e remove id', () => {
    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().isFavorite(42)).toBe(true);
    expect(useFavoritesStore.getState().ids).toEqual([42]);
    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().isFavorite(42)).toBe(false);
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('add e remove', () => {
    useFavoritesStore.getState().add(1);
    useFavoritesStore.getState().add(2);
    expect(useFavoritesStore.getState().ids).toEqual([1, 2]);
    useFavoritesStore.getState().remove(1);
    expect(useFavoritesStore.getState().ids).toEqual([2]);
  });

  test('clear esvazia ids', () => {
    useFavoritesStore.getState().add(10);
    useFavoritesStore.getState().clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
    expect(useFavoritesStore.getState().isFavorite(10)).toBe(false);
  });
});
