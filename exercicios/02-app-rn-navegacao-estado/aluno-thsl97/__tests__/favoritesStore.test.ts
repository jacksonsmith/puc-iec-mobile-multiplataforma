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

  test('toggle adiciona id se nao existe', () => {
    useFavoritesStore.getState().toggle?.(42);

    expect(useFavoritesStore.getState().ids).toEqual([42]);
  });

  test('toggle remove id se existe', () => {
    useFavoritesStore.setState({ ids: [42] });

    useFavoritesStore.getState().toggle?.(42);

    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('isFavorite retorna true apos add', () => {
    useFavoritesStore.getState().add?.(7);

    expect(useFavoritesStore.getState().isFavorite?.(7)).toBe(true);
  });

  test('clear esvazia ids', () => {
    useFavoritesStore.setState({ ids: [1, 2, 3] });

    useFavoritesStore.getState().clear?.();

    expect(useFavoritesStore.getState().ids).toEqual([]);
  });
});
