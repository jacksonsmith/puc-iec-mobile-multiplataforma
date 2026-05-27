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

  // TODO [TASK 9]: adicione 3+ testes aqui (use IA).
  test.skip('placeholder — remova quando implementar', () => {
    expect(true).toBe(true);
  });
});
