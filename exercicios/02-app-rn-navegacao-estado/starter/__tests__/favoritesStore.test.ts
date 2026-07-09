// __tests__/favoritesStore.test.ts
//
// ATIVIDADE 2 — TASK 9 — testes do useFavoritesStore (gerados com auxílio de IA).

import { useFavoritesStore } from '../src/store/favoritesStore';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona id quando não existe', () => {
    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().ids).toEqual([42]);
  });

  test('toggle remove id quando já existe', () => {
    const { toggle } = useFavoritesStore.getState();
    toggle(42);
    toggle(42);
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('isFavorite retorna true após add e false após remove', () => {
    const { add, remove, isFavorite } = useFavoritesStore.getState();
    add(7);
    expect(useFavoritesStore.getState().isFavorite(7)).toBe(true);
    remove(7);
    expect(useFavoritesStore.getState().isFavorite(7)).toBe(false);
  });

  test('add é idempotente (não duplica id)', () => {
    const { add } = useFavoritesStore.getState();
    add(1);
    add(1);
    expect(useFavoritesStore.getState().ids).toEqual([1]);
  });

  test('clear esvazia ids', () => {
    const { add, clear } = useFavoritesStore.getState();
    add(1);
    add(2);
    clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });
});
