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
import { mmkvStorage } from '../src/storage/mmkv';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona um id que ainda não é favorito', () => {
    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().ids).toEqual([42]);
  });

  test('toggle remove um id que já é favorito', () => {
    useFavoritesStore.setState({ ids: [42] });
    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('isFavorite retorna true após adicionar um favorito', () => {
    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().isFavorite(42)).toBe(true);
  });

  test('add evita duplicatas, remove exclui o id e clear limpa a lista', () => {
    const favorites = useFavoritesStore.getState();
    favorites.add(42);
    favorites.add(42);
    expect(useFavoritesStore.getState().ids).toEqual([42]);

    useFavoritesStore.getState().remove(42);
    expect(useFavoritesStore.getState().ids).toEqual([]);

    useFavoritesStore.getState().add(7);
    useFavoritesStore.getState().clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('persist restaura os favoritos salvos', async () => {
    useFavoritesStore.getState().toggle(42);
    const savedState = mmkvStorage.getItem('favorites-ids');
    expect(savedState).not.toBeNull();

    useFavoritesStore.setState({ ids: [] });
    mmkvStorage.setItem('favorites-ids', savedState as string);
    await useFavoritesStore.persist.rehydrate();
    expect(useFavoritesStore.getState().ids).toEqual([42]);
  });
});
