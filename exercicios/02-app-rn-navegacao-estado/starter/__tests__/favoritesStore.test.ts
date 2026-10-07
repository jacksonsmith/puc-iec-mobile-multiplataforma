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

import { useFavoritesStore } from '../src/store/favoritesStore';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona id quando ele ainda não existe', () => {
    useFavoritesStore.getState().toggle(1);

    expect(useFavoritesStore.getState().ids).toContain(1);
  });

  test('toggle remove id quando ele já existe', () => {
    useFavoritesStore.getState().add(1);

    useFavoritesStore.getState().toggle(1);

    expect(useFavoritesStore.getState().ids).not.toContain(1);
  });

  test('isFavorite retorna true após adicionar um id', () => {
    useFavoritesStore.getState().add(10);

    expect(useFavoritesStore.getState().isFavorite(10)).toBe(true);
  });

  test('clear esvazia a lista de favoritos', () => {
    useFavoritesStore.getState().add(1);
    useFavoritesStore.getState().add(2);

    useFavoritesStore.getState().clear();

    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  // 4 testes adicionais

  test('add adiciona um novo id aos favoritos', () => {
    useFavoritesStore.getState().add(5);

    expect(useFavoritesStore.getState().ids).toEqual([5]);
  });

  test('add não adiciona ids duplicados', () => {
    useFavoritesStore.getState().add(7);
    useFavoritesStore.getState().add(7);

    expect(useFavoritesStore.getState().ids).toEqual([7]);
  });

  test('remove remove apenas o id informado', () => {
    useFavoritesStore.getState().add(1);
    useFavoritesStore.getState().add(2);
    useFavoritesStore.getState().add(3);

    useFavoritesStore.getState().remove(2);

    expect(useFavoritesStore.getState().ids).toEqual([1, 3]);
  });

  test('isFavorite retorna false para id que não está nos favoritos', () => {
    useFavoritesStore.getState().add(1);

    expect(useFavoritesStore.getState().isFavorite(99)).toBe(false);
  });
});