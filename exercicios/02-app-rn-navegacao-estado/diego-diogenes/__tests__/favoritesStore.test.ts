// __tests__/favoritesStore.test.ts
//
// ATIVIDADE 2 — TASK 9
//
// Testes do useFavoritesStore (Zustand) e do adapter de storage.
// Cobrem add, remove, toggle, isFavorite, clear e persistência.

import { useFavoritesStore } from '../src/store/favoritesStore';
import { mmkvStorage } from '../src/storage/mmkv';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('add adiciona um id à lista', () => {
    useFavoritesStore.getState().add(603);
    expect(useFavoritesStore.getState().ids).toEqual([603]);
  });

  test('add não duplica um id já favoritado', () => {
    useFavoritesStore.getState().add(603);
    useFavoritesStore.getState().add(603);
    expect(useFavoritesStore.getState().ids).toEqual([603]);
  });

  test('remove tira o id existente e ignora id inexistente', () => {
    useFavoritesStore.setState({ ids: [1, 2, 3] });
    useFavoritesStore.getState().remove(2);
    useFavoritesStore.getState().remove(99);
    expect(useFavoritesStore.getState().ids).toEqual([1, 3]);
  });

  test('toggle adiciona quando o id não existe', () => {
    useFavoritesStore.getState().toggle(10);
    expect(useFavoritesStore.getState().ids).toEqual([10]);
  });

  test('toggle remove quando o id já existe', () => {
    useFavoritesStore.setState({ ids: [10] });
    useFavoritesStore.getState().toggle(10);
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('isFavorite reflete o estado atual', () => {
    useFavoritesStore.getState().add(7);
    expect(useFavoritesStore.getState().isFavorite(7)).toBe(true);
    expect(useFavoritesStore.getState().isFavorite(8)).toBe(false);
  });

  test('clear esvazia a lista de favoritos', () => {
    useFavoritesStore.setState({ ids: [1, 2, 3] });
    useFavoritesStore.getState().clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('persiste os ids no storage após uma mudança', () => {
    useFavoritesStore.getState().add(42);
    expect(mmkvStorage.getItem('favorites-ids')).toBe('[42]');
  });

  test('adapter de storage mantém valores até serem removidos', () => {
    mmkvStorage.setItem('test-key', 'test-value');
    expect(mmkvStorage.getItem('test-key')).toBe('test-value');
    mmkvStorage.removeItem('test-key');
    expect(mmkvStorage.getItem('test-key')).toBeNull();
  });
});
