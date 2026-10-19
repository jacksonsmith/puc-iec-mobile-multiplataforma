// __tests__/favoritesStore.test.ts
//
// ATIVIDADE 2 — testes do useFavoritesStore (Zustand).

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
    useFavoritesStore.setState({ ids: [42, 7] });
    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().ids).toEqual([7]);
  });

  test('isFavorite retorna true após add e false após remove', () => {
    const { add, remove, isFavorite } = useFavoritesStore.getState();
    add(10);
    expect(isFavorite(10)).toBe(true);
    remove(10);
    expect(isFavorite(10)).toBe(false);
  });

  test('add não duplica ids', () => {
    const { add } = useFavoritesStore.getState();
    add(5);
    add(5);
    expect(useFavoritesStore.getState().ids).toEqual([5]);
  });

  test('clear esvazia ids', () => {
    useFavoritesStore.setState({ ids: [1, 2, 3] });
    useFavoritesStore.getState().clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });
});
