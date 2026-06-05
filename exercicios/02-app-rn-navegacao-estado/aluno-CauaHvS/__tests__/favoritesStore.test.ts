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

// __tests__/favoritesStore.test.ts
//
// ATIVIDADE 2 — TASK 9: testes pra useFavoritesStore.
import { useFavoritesStore } from '../src/store/favoritesStore';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona id se não existe', () => {
    useFavoritesStore.getState().toggle(1);
    expect(useFavoritesStore.getState().ids).toContain(1);
  });

  test('toggle remove id se já existe', () => {
    useFavoritesStore.getState().toggle(1);
    useFavoritesStore.getState().toggle(1);
    expect(useFavoritesStore.getState().ids).not.toContain(1);
  });

  test('isFavorite retorna true após adicionar id', () => {
    useFavoritesStore.getState().add(42);
    expect(useFavoritesStore.getState().isFavorite(42)).toBe(true);
  });

  test('isFavorite retorna false para id não adicionado', () => {
    expect(useFavoritesStore.getState().isFavorite(99)).toBe(false);
  });

  test('remove elimina id existente', () => {
    useFavoritesStore.getState().add(10);
    useFavoritesStore.getState().remove(10);
    expect(useFavoritesStore.getState().ids).not.toContain(10);
  });

  test('clear esvazia todos os ids', () => {
    useFavoritesStore.getState().add(1);
    useFavoritesStore.getState().add(2);
    useFavoritesStore.getState().add(3);
    useFavoritesStore.getState().clear();
    expect(useFavoritesStore.getState().ids).toHaveLength(0);
  });

  test('add não duplica id já existente', () => {
    useFavoritesStore.getState().add(5);
    useFavoritesStore.getState().add(5);
    expect(useFavoritesStore.getState().ids.filter((i) => i === 5)).toHaveLength(1);
  });
});
