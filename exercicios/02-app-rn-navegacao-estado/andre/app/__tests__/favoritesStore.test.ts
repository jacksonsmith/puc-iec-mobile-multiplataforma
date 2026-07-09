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

  test('toggle adiciona id se não existe', () => {
    const store = useFavoritesStore.getState();

    store.toggle(42);

    expect(useFavoritesStore.getState().ids).toEqual([42]);
    expect(store.isFavorite(42)).toBe(true);
  });

  test('toggle remove id se já existe', () => {
    const store = useFavoritesStore.getState();

    store.toggle(42);
    expect(store.isFavorite(42)).toBe(true);

    store.toggle(42);
    expect(useFavoritesStore.getState().ids).toEqual([]);
    expect(store.isFavorite(42)).toBe(false);
  });

  test('isFavorite retorna true após add', () => {
    const store = useFavoritesStore.getState();

    store.add(7);

    expect(store.isFavorite(7)).toBe(true);
    expect(useFavoritesStore.getState().ids).toContain(7);
  });

  test('clear esvazia ids', () => {
    const store = useFavoritesStore.getState();

    store.add(1);
    store.add(2);
    expect(useFavoritesStore.getState().ids).toEqual([1, 2]);

    store.clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
    expect(store.isFavorite(1)).toBe(false);
    expect(store.isFavorite(2)).toBe(false);
  });
});
