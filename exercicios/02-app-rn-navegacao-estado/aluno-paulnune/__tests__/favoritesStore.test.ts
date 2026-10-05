// __tests__/favoritesStore.test.ts
//
// ATIVIDADE 2 — testar useFavoritesStore.
// O MMKV é substituído por um Map em memória, pois o teste roda no Node (sem JSI).

import { useFavoritesStore } from '../src/store/favoritesStore';

jest.mock('@/storage/mmkv', () => {
  const data = new Map<string, string>();
  return {
    mmkvStorage: {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => {
        data.set(k, v);
      },
      removeItem: (k: string) => {
        data.delete(k);
      },
    },
  };
});

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona id se não existe', () => {
    useFavoritesStore.getState().toggle(550);
    expect(useFavoritesStore.getState().ids).toEqual([550]);
    expect(useFavoritesStore.getState().isFavorite(550)).toBe(true);
  });

  test('toggle remove id se já existe', () => {
    useFavoritesStore.setState({ ids: [550, 13] });
    useFavoritesStore.getState().toggle(550);
    expect(useFavoritesStore.getState().ids).toEqual([13]);
    expect(useFavoritesStore.getState().isFavorite(550)).toBe(false);
  });

  test('add não duplica id e remove tira só o id informado', () => {
    const { add, remove } = useFavoritesStore.getState();
    add(1);
    add(1);
    add(2);
    expect(useFavoritesStore.getState().ids).toEqual([1, 2]);
    remove(1);
    expect(useFavoritesStore.getState().ids).toEqual([2]);
  });

  test('clear esvazia a lista de favoritos', () => {
    useFavoritesStore.setState({ ids: [1, 2, 3] });
    useFavoritesStore.getState().clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });
});
