// __tests__/favoritesStore.test.ts
//
// Testes do useFavoritesStore (Zustand + persistência MMKV).

import { STORAGE_KEY, useFavoritesStore } from '../src/store/favoritesStore';
import { mmkvStorage } from '../src/storage/mmkv';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona o id quando ele não existe', () => {
    useFavoritesStore.getState().toggle(603);
    expect(useFavoritesStore.getState().ids).toEqual([603]);
  });

  test('toggle remove o id quando ele já existe', () => {
    const { toggle } = useFavoritesStore.getState();
    toggle(603);
    toggle(603);
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('isFavorite retorna true após add e false para outro id', () => {
    useFavoritesStore.getState().add(603);
    expect(useFavoritesStore.getState().isFavorite(603)).toBe(true);
    expect(useFavoritesStore.getState().isFavorite(604)).toBe(false);
  });

  test('add não duplica um id já favoritado', () => {
    const { add } = useFavoritesStore.getState();
    add(603);
    add(603);
    expect(useFavoritesStore.getState().ids).toEqual([603]);
  });

  test('remove tira só o id informado', () => {
    useFavoritesStore.setState({ ids: [1, 2, 3] });
    useFavoritesStore.getState().remove(2);
    expect(useFavoritesStore.getState().ids).toEqual([1, 3]);
  });

  test('clear esvazia todos os favoritos', () => {
    useFavoritesStore.setState({ ids: [1, 2, 3] });
    useFavoritesStore.getState().clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('mudanças no store são gravadas no MMKV', () => {
    useFavoritesStore.getState().add(42);
    expect(JSON.parse(mmkvStorage.getItem(STORAGE_KEY) ?? '[]')).toEqual([42]);
  });
});
