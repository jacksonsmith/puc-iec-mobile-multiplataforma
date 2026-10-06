// __tests__/favoritesStore.test.ts

import { useFavoritesStore } from '../src/store/favoritesStore';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona id se não existe', () => {
    useFavoritesStore.getState().toggle(101);
    expect(useFavoritesStore.getState().ids).toContain(101);
    expect(useFavoritesStore.getState().isFavorite(101)).toBe(true);
  });

  test('toggle remove id se já existe', () => {
    useFavoritesStore.getState().toggle(101);
    useFavoritesStore.getState().toggle(101);
    expect(useFavoritesStore.getState().ids).not.toContain(101);
    expect(useFavoritesStore.getState().isFavorite(101)).toBe(false);
  });

  test('add adiciona id e evita duplicatas', () => {
    useFavoritesStore.getState().add(202);
    useFavoritesStore.getState().add(202);
    expect(useFavoritesStore.getState().ids).toEqual([202]);
  });

  test('remove remove um id específico', () => {
    useFavoritesStore.getState().add(1);
    useFavoritesStore.getState().add(2);
    useFavoritesStore.getState().remove(1);
    expect(useFavoritesStore.getState().ids).toEqual([2]);
  });

  test('clear limpa todos os favoritos', () => {
    useFavoritesStore.getState().add(1);
    useFavoritesStore.getState().add(2);
    useFavoritesStore.getState().clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });
});
