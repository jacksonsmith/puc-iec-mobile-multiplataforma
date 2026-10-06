import { useFavoritesStore } from "../src/store/favoritesStore";

describe("favoritesStore", () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test("toggle adiciona id se não existe", () => {
    useFavoritesStore.getState().toggle(42);

    expect(useFavoritesStore.getState().ids).toEqual([42]);
  });

  test("toggle remove id se existe", () => {
    useFavoritesStore.setState({ ids: [42] });

    useFavoritesStore.getState().toggle(42);

    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test("isFavorite retorna true após adicionar id", () => {
    useFavoritesStore.getState().toggle(42);

    expect(useFavoritesStore.getState().isFavorite(42)).toBe(true);
  });

  test("clear esvazia ids", () => {
    useFavoritesStore.setState({ ids: [1, 2, 3] });

    useFavoritesStore.getState().clear();

    expect(useFavoritesStore.getState().ids).toEqual([]);
  });
});
