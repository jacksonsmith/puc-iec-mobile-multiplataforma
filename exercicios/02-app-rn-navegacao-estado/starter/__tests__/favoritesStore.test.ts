// __tests__/favoritesStore.test.ts
//
// ATIVIDADE 2 — testar useFavoritesStore.
//
import { useFavoritesStore } from '../src/store/favoritesStore';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona um id que ainda não é favorito', () => {
    useFavoritesStore.getState().toggle(42);

    expect(useFavoritesStore.getState().ids).toEqual([42]);
  });

  test('toggle remove um id que já é favorito', () => {
    useFavoritesStore.setState({ ids: [42] });

    useFavoritesStore.getState().toggle(42);

    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('isFavorite retorna true para um filme adicionado', () => {
    useFavoritesStore.getState().add(42);

    expect(useFavoritesStore.getState().isFavorite(42)).toBe(true);
  });

  test('clear remove todos os favoritos', () => {
    useFavoritesStore.getState().add(42);
    useFavoritesStore.getState().add(99);

    useFavoritesStore.getState().clear();

    expect(useFavoritesStore.getState().ids).toEqual([]);
    expect(useFavoritesStore.getState().isFavorite(42)).toBe(false);
  });
});
