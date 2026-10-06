// __tests__/favoritesStore.test.ts
//
// ATIVIDADE 2 — testar useFavoritesStore.
//
import { useFavoritesStore } from '../src/store/favoritesStore';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona e remove um favorito', () => {
    useFavoritesStore.getState().toggle(10);
    expect(useFavoritesStore.getState().ids).toEqual([10]);

    useFavoritesStore.getState().toggle(10);

    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('isFavorite retorna true depois de adicionar um filme', () => {
    useFavoritesStore.getState().add(20);

    expect(useFavoritesStore.getState().isFavorite(20)).toBe(true);
    expect(useFavoritesStore.getState().isFavorite(21)).toBe(false);
  });

  test('add não duplica IDs e remove exclui somente o ID informado', () => {
    useFavoritesStore.getState().add(30);
    useFavoritesStore.getState().add(30);
    useFavoritesStore.getState().add(31);

    useFavoritesStore.getState().remove(30);

    expect(useFavoritesStore.getState().ids).toEqual([31]);
  });

  test('clear remove todos os favoritos', () => {
    useFavoritesStore.setState({ ids: [40, 41] });

    useFavoritesStore.getState().clear();

    expect(useFavoritesStore.getState().ids).toEqual([]);
  });
});
