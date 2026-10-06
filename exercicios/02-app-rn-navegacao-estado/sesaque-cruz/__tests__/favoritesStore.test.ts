// __tests__/favoritesStore.test.ts
//
// Testes do useFavoritesStore (Zustand), gerados com auxílio de IA e revisados.

import { STORAGE_KEY, useFavoritesStore } from '../src/store/favoritesStore';
import { mmkvStorage } from '../src/storage/mmkv';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona id se não existe', () => {
    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().ids).toEqual([42]);
  });

  test('toggle remove id se existe', () => {
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

  test('add não duplica id já favoritado', () => {
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

describe('favoritesStore persistência (MMKV)', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('salva ids no storage a cada mudança', () => {
    useFavoritesStore.getState().toggle(99);
    expect(mmkvStorage.getItem(STORAGE_KEY)).toBe('[99]');
  });

  test('recarrega favoritos salvos ao reinicializar o store', () => {
    useFavoritesStore.getState().add(1);
    useFavoritesStore.getState().add(2);

    jest.isolateModules(() => {
      // Mesmo storage (módulo isolado reaproveita o mmkvStorage mockado), store novo.
      jest.doMock('../src/storage/mmkv', () => ({ mmkvStorage }));
      const { useFavoritesStore: reloaded } = require('../src/store/favoritesStore');
      expect(reloaded.getState().ids).toEqual([1, 2]);
    });
  });
});
