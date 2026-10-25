// __tests__/favoritesStore.test.ts
//
// Testes do useFavoritesStore (Zustand + persistência). Gerados com auxílio
// de IA a partir do favoritesStore.ts e revisados à mão.

import { useFavoritesStore, STORAGE_KEY } from '../src/store/favoritesStore';
import { mmkvStorage } from '../src/storage/mmkv';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('começa sem favoritos', () => {
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('toggle adiciona id se não existe', () => {
    useFavoritesStore.getState().toggle(10);
    expect(useFavoritesStore.getState().ids).toEqual([10]);
  });

  test('toggle remove id se existe', () => {
    useFavoritesStore.setState({ ids: [10, 20] });
    useFavoritesStore.getState().toggle(10);
    expect(useFavoritesStore.getState().ids).toEqual([20]);
  });

  test('isFavorite retorna true após add e false após remove', () => {
    const { add, remove, isFavorite } = useFavoritesStore.getState();
    add(42);
    expect(isFavorite(42)).toBe(true);
    remove(42);
    expect(isFavorite(42)).toBe(false);
  });

  test('add não duplica id já favoritado', () => {
    const { add } = useFavoritesStore.getState();
    add(7);
    add(7);
    expect(useFavoritesStore.getState().ids).toEqual([7]);
  });

  test('remove de id inexistente não altera a lista', () => {
    useFavoritesStore.setState({ ids: [1, 2] });
    useFavoritesStore.getState().remove(99);
    expect(useFavoritesStore.getState().ids).toEqual([1, 2]);
  });

  test('clear esvazia ids', () => {
    useFavoritesStore.setState({ ids: [1, 2, 3] });
    useFavoritesStore.getState().clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('cada mudança é salva no storage', () => {
    const { add, toggle, clear } = useFavoritesStore.getState();
    add(5);
    toggle(8);
    expect(JSON.parse(mmkvStorage.getItem(STORAGE_KEY) ?? 'null')).toEqual([5, 8]);
    clear();
    expect(JSON.parse(mmkvStorage.getItem(STORAGE_KEY) ?? 'null')).toEqual([]);
  });

  test('favoritos salvos são carregados quando o store é criado (simula reload)', () => {
    jest.isolateModules(() => {
      // Mesmo registry isolado → mesma instância de storage pros dois módulos.
      const { mmkvStorage: storage } = require('../src/storage/mmkv');
      storage.setItem(STORAGE_KEY, JSON.stringify([3, 4]));
      const { useFavoritesStore: freshStore } = require('../src/store/favoritesStore');
      expect(freshStore.getState().ids).toEqual([3, 4]);
      expect(freshStore.getState().isFavorite(4)).toBe(true);
    });
  });

  test('storage corrompido não quebra o store (começa vazio)', () => {
    jest.isolateModules(() => {
      const { mmkvStorage: storage } = require('../src/storage/mmkv');
      storage.setItem(STORAGE_KEY, '{nao-e-json');
      const { useFavoritesStore: freshStore } = require('../src/store/favoritesStore');
      expect(freshStore.getState().ids).toEqual([]);
    });
  });
});
