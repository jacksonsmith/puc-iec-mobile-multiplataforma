// __tests__/favoritesStore.test.ts
//
// ATIVIDADE 2 — testes do useFavoritesStore.
//
// No Jest, o react-native-mmkv detecta o ambiente de teste e usa um mock
// em memória — dá pra conferir a persistência sem device/simulador.

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
    const { toggle } = useFavoritesStore.getState();
    toggle(42);
    toggle(42);
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('isFavorite retorna true após add e false pra outros ids', () => {
    const { add, isFavorite } = useFavoritesStore.getState();
    add(7);
    expect(isFavorite(7)).toBe(true);
    expect(isFavorite(8)).toBe(false);
  });

  test('add não duplica id já favoritado', () => {
    const { add } = useFavoritesStore.getState();
    add(7);
    add(7);
    expect(useFavoritesStore.getState().ids).toEqual([7]);
  });

  test('remove tira só o id informado', () => {
    const { add, remove } = useFavoritesStore.getState();
    add(1);
    add(2);
    add(3);
    remove(2);
    expect(useFavoritesStore.getState().ids).toEqual([1, 3]);
  });

  test('clear esvazia ids', () => {
    const { add, clear } = useFavoritesStore.getState();
    add(1);
    add(2);
    clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('persiste ids no storage (MMKV) a cada mudança', () => {
    const { add, remove } = useFavoritesStore.getState();
    add(10);
    add(20);
    expect(mmkvStorage.getItem(STORAGE_KEY)).toBe('[10,20]');
    remove(10);
    expect(mmkvStorage.getItem(STORAGE_KEY)).toBe('[20]');
  });
});
