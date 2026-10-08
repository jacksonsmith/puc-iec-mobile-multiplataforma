// __tests__/favoritesStore.test.ts
//
import { useFavoritesStore } from '../src/store/favoritesStore';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona e remove favorito', () => {
    useFavoritesStore.getState().toggle(603);
    expect(useFavoritesStore.getState().ids).toEqual([603]);

    useFavoritesStore.getState().toggle(603);
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('isFavorite identifica filme favoritado', () => {
    useFavoritesStore.getState().add(550);
    expect(useFavoritesStore.getState().isFavorite(550)).toBe(true);
    expect(useFavoritesStore.getState().isFavorite(1)).toBe(false);
  });

  test('add não duplica e remove só o id solicitado', () => {
    const store = useFavoritesStore.getState();
    store.add(1);
    store.add(1);
    store.add(2);
    useFavoritesStore.getState().remove(1);
    expect(useFavoritesStore.getState().ids).toEqual([2]);
  });

  test('clear remove todos os favoritos', () => {
    const store = useFavoritesStore.getState();
    store.add(1);
    store.add(2);
    useFavoritesStore.getState().clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });
});
