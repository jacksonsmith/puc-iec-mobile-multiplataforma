// __tests__/favoritesStore.test.ts
//
// ATIVIDADE 2 — testar useFavoritesStore.
//
import { useFavoritesStore } from '../src/store/favoritesStore';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
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