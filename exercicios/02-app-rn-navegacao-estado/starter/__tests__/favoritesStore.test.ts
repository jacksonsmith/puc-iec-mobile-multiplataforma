import { useFavoritesStore } from '../src/store/favoritesStore';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona id quando ele não existe', () => {
    useFavoritesStore.getState().toggle(10);

    expect(useFavoritesStore.getState().ids).toContain(10);
  });

  test('toggle remove id quando ele já existe', () => {
    useFavoritesStore.setState({ ids: [10] });

    useFavoritesStore.getState().toggle(10);

    expect(useFavoritesStore.getState().ids).not.toContain(10);
  });

  test('isFavorite retorna true após add', () => {
    useFavoritesStore.getState().add(20);

    expect(useFavoritesStore.getState().isFavorite(20)).toBe(true);
  });

  test('clear esvazia todos os favoritos', () => {
    useFavoritesStore.setState({ ids: [1, 2, 3] });

    useFavoritesStore.getState().clear();

    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('add não adiciona ids duplicados', () => {
    useFavoritesStore.getState().add(30);
    useFavoritesStore.getState().add(30);

    expect(useFavoritesStore.getState().ids).toEqual([30]);
  });

  test('remove exclui apenas o id informado', () => {
    useFavoritesStore.setState({ ids: [1, 2, 3] });

    useFavoritesStore.getState().remove(2);

    expect(useFavoritesStore.getState().ids).toEqual([1, 3]);
  });
});