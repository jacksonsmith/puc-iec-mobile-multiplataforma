// __tests__/favoritesStore.test.ts
//
// ATIVIDADE 2 — testar useFavoritesStore.
//
// Mínimo 3 testes verdes pra CI passar (somados aos 3 de counterStore = 6 total).

import { useFavoritesStore } from '../src/store/favoritesStore';
import { mmkvStorage } from '../src/storage/mmkv';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona e remove um favorito', () => {
    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().ids).toEqual([42]);

    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('add não duplica ids e isFavorite consulta o estado', () => {
    useFavoritesStore.getState().add(7);
    useFavoritesStore.getState().add(7);
    expect(useFavoritesStore.getState().ids).toEqual([7]);
    expect(useFavoritesStore.getState().isFavorite(7)).toBe(true);
    expect(useFavoritesStore.getState().isFavorite(8)).toBe(false);
  });

  test('remove exclui somente o id solicitado', () => {
    useFavoritesStore.getState().add(1);
    useFavoritesStore.getState().add(2);
    useFavoritesStore.getState().remove(1);
    expect(useFavoritesStore.getState().ids).toEqual([2]);
  });

  test('clear remove todos os favoritos e persiste o estado vazio', () => {
    useFavoritesStore.getState().add(1);
    useFavoritesStore.getState().add(2);
    useFavoritesStore.getState().clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
    expect(mmkvStorage.getItem('favorites-ids')).toBe('[]');
  });
});
