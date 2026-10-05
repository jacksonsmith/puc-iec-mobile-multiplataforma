// __tests__/favoritesStore.test.ts
//
// ATIVIDADE 2 — testar useFavoritesStore.
//
// TODO [TASK 9]: gerar testes pra favoritesStore usando IA.
//
// Prompt sugerido:
//   "Gere testes Jest pra useFavoritesStore (Zustand) cobrindo:
//    - toggle adiciona id se não existe
//    - toggle remove id se existe
//    - isFavorite retorna true após add
//    - clear esvazia ids
//    Use describe + beforeEach pra resetar state."
//
// Mínimo 3 testes verdes pra CI passar (somados aos 3 de counterStore = 6 total).

import { useFavoritesStore } from "../src/store/favoritesStore";

describe("favoritesStore", () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test("toggle adiciona id se não existe", () => {
    useFavoritesStore.getState().toggle(10);
    expect(useFavoritesStore.getState().ids).toEqual([10]);
  });

  test("toggle remove id se já existe", () => {
    const { toggle } = useFavoritesStore.getState();
    toggle(10);
    toggle(10);
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test("isFavorite retorna true após add e false para id não favoritado", () => {
    useFavoritesStore.getState().add(10);
    const { isFavorite } = useFavoritesStore.getState();
    expect(isFavorite(10)).toBe(true);
    expect(isFavorite(99)).toBe(false);
  });

  test("clear esvazia ids", () => {
    const { add, clear } = useFavoritesStore.getState();
    add(10);
    add(20);
    clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test("add não duplica id já favoritado", () => {
    const { add } = useFavoritesStore.getState();
    add(10);
    add(10);
    expect(useFavoritesStore.getState().ids).toEqual([10]);
  });

  test("remove retira apenas o id informado", () => {
    const { add, remove } = useFavoritesStore.getState();
    add(10);
    add(20);
    remove(10);
    expect(useFavoritesStore.getState().ids).toEqual([20]);
  });
});
