jest.mock('react-native-mmkv', () => {
  const values = new Map<string, string>();

  return {
    MMKV: class MockMMKV {
      getString(key: string) {
        return values.get(key);
      }

      set(key: string, value: string) {
        values.set(key, value);
      }

      delete(key: string) {
        values.delete(key);
      }
    },
  };
});

import { mmkvStorage } from '../src/storage/mmkv';
import { useFavoritesStore } from '../src/store/favoritesStore';

describe('favoritesStore', () => {
  beforeEach(() => {
    mmkvStorage.removeItem('favorites-ids');
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona um ID e persiste a lista', () => {
    useFavoritesStore.getState().toggle(603);

    expect(useFavoritesStore.getState().ids).toEqual([603]);
    expect(mmkvStorage.getItem('favorites-ids')).toBe('[603]');
  });

  test('toggle remove um ID já favoritado', () => {
    useFavoritesStore.getState().add(603);
    useFavoritesStore.getState().toggle(603);

    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('isFavorite identifica IDs presentes e ausentes', () => {
    useFavoritesStore.getState().add(603);

    expect(useFavoritesStore.getState().isFavorite(603)).toBe(true);
    expect(useFavoritesStore.getState().isFavorite(11)).toBe(false);
  });

  test('add não duplica IDs e remove exclui o ID informado', () => {
    useFavoritesStore.getState().add(603);
    useFavoritesStore.getState().add(603);
    useFavoritesStore.getState().add(11);
    useFavoritesStore.getState().remove(603);

    expect(useFavoritesStore.getState().ids).toEqual([11]);
  });

  test('clear remove todos os favoritos persistidos', () => {
    useFavoritesStore.getState().add(603);
    useFavoritesStore.getState().add(11);
    useFavoritesStore.getState().clear();

    expect(useFavoritesStore.getState().ids).toEqual([]);
    expect(mmkvStorage.getItem('favorites-ids')).toBe('[]');
  });

  test('restaura IDs salvos quando o store é carregado novamente', () => {
    jest.resetModules();

    const reloadedStorage = require('../src/storage/mmkv').mmkvStorage as typeof mmkvStorage;
    reloadedStorage.setItem('favorites-ids', '[603,11]');
    const reloadedStore = require('../src/store/favoritesStore').useFavoritesStore as typeof useFavoritesStore;

    expect(reloadedStore.getState().ids).toEqual([603, 11]);
  });
});
