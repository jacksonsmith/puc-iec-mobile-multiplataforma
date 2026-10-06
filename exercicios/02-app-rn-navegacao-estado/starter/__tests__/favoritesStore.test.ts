// __tests__/favoritesStore.test.ts
//
// ATIVIDADE 2 — testar useFavoritesStore.
//
import { useFavoritesStore } from '../src/store/favoritesStore';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona um id que ainda não é favorito', () => {
    useFavoritesStore.getState().toggle(603);

    expect(useFavoritesStore.getState().ids).toEqual([603]);
    expect(useFavoritesStore.getState().isFavorite(603)).toBe(true);
  });

  test('toggle remove um id que já é favorito', () => {
    useFavoritesStore.getState().add(603);
    useFavoritesStore.getState().toggle(603);

    expect(useFavoritesStore.getState().isFavorite(603)).toBe(false);
  });

  test('add e remove atualizam a lista de favoritos', () => {
    useFavoritesStore.getState().add(603);
    useFavoritesStore.getState().add(604);
    useFavoritesStore.getState().remove(603);

    expect(useFavoritesStore.getState().ids).toEqual([604]);
  });

  test('clear esvazia todos os favoritos', () => {
    useFavoritesStore.getState().add(603);
    useFavoritesStore.getState().add(604);
    useFavoritesStore.getState().clear();

    expect(useFavoritesStore.getState().ids).toEqual([]);
  });
});
