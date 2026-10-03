import { useFavoritesStore } from "../src/store/favoritesStore";

describe("favoritesStore", () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test("toggle adiciona id se não existe", () => {
    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().ids).toContain(42);
  });

  test("toggle remove id se já existe", () => {
    useFavoritesStore.setState({ ids: [42] });
    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().ids).not.toContain(42);
  });

  test("isFavorite retorna true após add", () => {
    useFavoritesStore.getState().add(7);
    expect(useFavoritesStore.getState().isFavorite(7)).toBe(true);
  });

  test("isFavorite retorna false para id não adicionado", () => {
    expect(useFavoritesStore.getState().isFavorite(99)).toBe(false);
  });

  test("remove elimina apenas o id alvo, mantendo os demais", () => {
    useFavoritesStore.setState({ ids: [1, 2, 3] });
    useFavoritesStore.getState().remove(2);
    const { ids } = useFavoritesStore.getState();
    expect(ids).not.toContain(2);
    expect(ids).toContain(1);
    expect(ids).toContain(3);
  });

  test("clear esvazia todos os ids", () => {
    useFavoritesStore.setState({ ids: [10, 20, 30] });
    useFavoritesStore.getState().clear();
    expect(useFavoritesStore.getState().ids).toHaveLength(0);
  });

  test("toggle em sequência: add → remove → add mantém estado correto", () => {
    useFavoritesStore.getState().toggle(5);
    expect(useFavoritesStore.getState().isFavorite(5)).toBe(true);

    useFavoritesStore.getState().toggle(5);
    expect(useFavoritesStore.getState().isFavorite(5)).toBe(false);

    useFavoritesStore.getState().toggle(5);
    expect(useFavoritesStore.getState().isFavorite(5)).toBe(true);
  });
});
