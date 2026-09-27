// __tests__/favoritesStore.test.ts
//
// ATIVIDADE 2 — testar useFavoritesStore.
//
// O mock fornece a API MMKV nativa em Jest, sem exigir JSI no ambiente de testes.
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

import { useFavoritesStore } from '../src/store/favoritesStore';
import { mmkvStorage } from '../src/storage/mmkv';

describe('favoritesStore', () => {
  beforeEach(() => {
    mmkvStorage.removeItem('favorites-ids');
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona um id que ainda não é favorito', () => {
    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().ids).toEqual([42]);
  });

  test('toggle remove um id que já é favorito', () => {
    useFavoritesStore.getState().add(42);
    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('add não duplica ids e remove exclui o id selecionado', () => {
    const { add, remove } = useFavoritesStore.getState();
    add(7);
    add(7);
    add(8);
    remove(7);
    expect(useFavoritesStore.getState().ids).toEqual([8]);
  });

  test('isFavorite identifica ids presentes e ausentes', () => {
    useFavoritesStore.getState().add(10);
    expect(useFavoritesStore.getState().isFavorite(10)).toBe(true);
    expect(useFavoritesStore.getState().isFavorite(11)).toBe(false);
  });

  test('clear remove todos os favoritos', () => {
    useFavoritesStore.getState().add(1);
    useFavoritesStore.getState().add(2);
    useFavoritesStore.getState().clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('persiste a lista atualizada no storage', () => {
    useFavoritesStore.getState().toggle(99);
    expect(mmkvStorage.getItem('favorites-ids')).toBe('[99]');
  });
});
