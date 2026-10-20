import { useFavoritesStore, STORAGE_KEY } from '../src/store/favoritesStore';
import { mmkvStorage } from '../src/storage/mmkv';

const state = () => useFavoritesStore.getState();

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona id se não existe', () => {
    state().toggle(42);
    expect(state().ids).toEqual([42]);
  });

  test('toggle remove id se já existe', () => {
    state().toggle(42);
    state().toggle(42);
    expect(state().ids).toEqual([]);
  });

  test('isFavorite reflete add e remove', () => {
    state().add(7);
    expect(state().isFavorite(7)).toBe(true);
    expect(state().isFavorite(8)).toBe(false);
    state().remove(7);
    expect(state().isFavorite(7)).toBe(false);
  });

  test('add é idempotente (não duplica id)', () => {
    state().add(1);
    state().add(1);
    expect(state().ids).toEqual([1]);
  });

  test('remove de id inexistente não altera a lista', () => {
    state().add(1);
    state().remove(999);
    expect(state().ids).toEqual([1]);
  });

  test('clear esvazia ids', () => {
    state().add(1);
    state().add(2);
    state().add(3);
    state().clear();
    expect(state().ids).toEqual([]);
  });
});

describe('favoritesStore — persistência MMKV', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('salva ids no storage a cada mudança', () => {
    state().add(10);
    state().add(20);
    expect(JSON.parse(mmkvStorage.getItem(STORAGE_KEY) ?? '[]')).toEqual([10, 20]);
    state().remove(10);
    expect(JSON.parse(mmkvStorage.getItem(STORAGE_KEY) ?? '[]')).toEqual([20]);
  });

  test('store recém-criada (simula reload do app) restaura ids do storage', () => {
    state().add(99);
    state().add(100);

    jest.isolateModules(() => {
      jest.doMock('../src/storage/mmkv', () => ({ mmkvStorage }));
      const { useFavoritesStore: reloaded } = require('../src/store/favoritesStore');
      expect(reloaded.getState().ids).toEqual([99, 100]);
    });
  });

  test('storage corrompido não quebra o app (começa vazio)', () => {
    mmkvStorage.setItem(STORAGE_KEY, '{isso não é json');
    jest.isolateModules(() => {
      jest.doMock('../src/storage/mmkv', () => ({ mmkvStorage }));
      const { useFavoritesStore: reloaded } = require('../src/store/favoritesStore');
      expect(reloaded.getState().ids).toEqual([]);
    });
  });
});
