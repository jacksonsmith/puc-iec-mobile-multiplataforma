// __tests__/favoritesStore.test.ts
//
// ATIVIDADE 2 — testar useFavoritesStore.
//
import { useFavoritesStore } from '../src/store/favoritesStore';
import { mmkvStorage } from '../src/storage/mmkv';

describe('favoritesStore', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    useFavoritesStore.setState({ ids: [] });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('add não duplica um favorito existente', () => {
    useFavoritesStore.getState().add(101);
    useFavoritesStore.getState().add(101);

    expect(useFavoritesStore.getState().ids).toEqual([101]);
  });

  test('remove exclui apenas o id solicitado e ignora ids ausentes', () => {
    useFavoritesStore.setState({ ids: [101, 202] });
    useFavoritesStore.getState().remove(101);
    useFavoritesStore.getState().remove(999);

    expect(useFavoritesStore.getState().ids).toEqual([202]);
    expect(useFavoritesStore.getState().isFavorite(101)).toBe(false);
  });

  test('alterações são gravadas no storage, inclusive clear', () => {
    const save = jest.spyOn(mmkvStorage, 'setItem');

    useFavoritesStore.getState().add(101);
    expect(save).toHaveBeenLastCalledWith('favorites-ids', '[101]');

    useFavoritesStore.getState().clear();
    expect(save).toHaveBeenLastCalledWith('favorites-ids', '[]');
  });

  test('recriar o módulo restaura os favoritos salvos', () => {
    jest.isolateModules(() => {
      const { mmkvStorage: isolatedStorage } = require('../src/storage/mmkv');
      jest.spyOn(isolatedStorage, 'getItem').mockReturnValue('[101,202]');
      const { useFavoritesStore: reloadedStore } = require('../src/store/favoritesStore');

      expect(reloadedStore.getState().ids).toEqual([101, 202]);
      expect(reloadedStore.getState().isFavorite(202)).toBe(true);
    });
  });

  test('toggle adiciona o id quando ele não existe', () => {
    useFavoritesStore.getState().toggle(101);

    expect(useFavoritesStore.getState().ids).toEqual([101]);
  });

  test('toggle remove o id quando ele já existe', () => {
    useFavoritesStore.setState({ ids: [101] });

    useFavoritesStore.getState().toggle(101);

    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('isFavorite retorna true após adicionar um id', () => {
    useFavoritesStore.getState().add(202);

    expect(useFavoritesStore.getState().isFavorite(202)).toBe(true);
  });

  test('clear remove todos os favoritos', () => {
    useFavoritesStore.setState({ ids: [101, 202, 303] });

    useFavoritesStore.getState().clear();

    expect(useFavoritesStore.getState().ids).toEqual([]);
  });
});
