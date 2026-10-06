// __tests__/favoritesStore.test.ts
//
// Testes do useFavoritesStore (Zustand + persistência MMKV).
// Gerados com auxílio de IA e revisados.
//
// Em Jest, o react-native-mmkv v3 usa automaticamente um mock em memória,
// então dá pra verificar a persistência lendo o mesmo storage.

import { useFavoritesStore, STORAGE_KEY } from '../src/store/favoritesStore';
import { mmkvStorage } from '../src/storage/mmkv';

const readPersisted = (): number[] => JSON.parse(mmkvStorage.getItem(STORAGE_KEY) ?? '[]');

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona id se não existe', () => {
    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().ids).toEqual([42]);
  });

  test('toggle remove id se existe', () => {
    const { toggle } = useFavoritesStore.getState();
    toggle(42);
    toggle(42);
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('isFavorite retorna true após add e false após remove', () => {
    const { add, remove, isFavorite } = useFavoritesStore.getState();
    add(7);
    expect(isFavorite(7)).toBe(true);
    expect(isFavorite(8)).toBe(false);
    remove(7);
    expect(useFavoritesStore.getState().isFavorite(7)).toBe(false);
  });

  test('add não duplica o mesmo id', () => {
    const { add } = useFavoritesStore.getState();
    add(1);
    add(1);
    expect(useFavoritesStore.getState().ids).toEqual([1]);
  });

  test('remove de id inexistente não altera a lista', () => {
    const { add, remove } = useFavoritesStore.getState();
    add(1);
    add(2);
    remove(99);
    expect(useFavoritesStore.getState().ids).toEqual([1, 2]);
  });

  test('clear esvazia ids', () => {
    const { add, clear } = useFavoritesStore.getState();
    add(1);
    add(2);
    add(3);
    clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('persiste ids no MMKV a cada mudança', () => {
    const { add, toggle } = useFavoritesStore.getState();
    add(10);
    add(20);
    expect(readPersisted()).toEqual([10, 20]);
    toggle(10);
    expect(readPersisted()).toEqual([20]);
  });
});
