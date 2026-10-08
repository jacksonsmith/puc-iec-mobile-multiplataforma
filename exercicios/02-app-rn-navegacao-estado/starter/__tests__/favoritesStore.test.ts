// __tests__/favoritesStore.test.ts
//
// ATIVIDADE 2 — testar useFavoritesStore.
//
// TASK 9: testes gerados com auxílio de IA.
//
// Prompt sugerido:
//   "Gere testes Jest pra useFavoritesStore (Zustand) cobrindo:
//    - toggle adiciona id se não existe
//    - toggle remove id se existe
//    - isFavorite retorna true após add
//    - clear esvazia ids
//    Use describe + beforeEach pra resetar state."

import { useFavoritesStore } from '../src/store/favoritesStore';
import { mmkvStorage } from '../src/storage/mmkv';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona o id se ele não existe', () => {
    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().ids).toEqual([42]);
  });

  test('toggle remove o id se ele já existe', () => {
    const { toggle } = useFavoritesStore.getState();
    toggle(42);
    toggle(42);
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('isFavorite retorna true após add e false para outro id', () => {
    useFavoritesStore.getState().add(7);
    expect(useFavoritesStore.getState().isFavorite(7)).toBe(true);
    expect(useFavoritesStore.getState().isFavorite(8)).toBe(false);
  });

  test('add não duplica ids e remove tira apenas o id informado', () => {
    const { add, remove } = useFavoritesStore.getState();
    add(1);
    add(1);
    add(2);
    expect(useFavoritesStore.getState().ids).toEqual([1, 2]);
    remove(1);
    expect(useFavoritesStore.getState().ids).toEqual([2]);
  });

  test('clear esvazia todos os favoritos', () => {
    const { add, clear } = useFavoritesStore.getState();
    add(1);
    add(2);
    add(3);
    clear();
    expect(useFavoritesStore.getState().ids).toHaveLength(0);
  });

  test('persiste os ids no storage ao mudar (chave favorites-ids)', () => {
    useFavoritesStore.getState().toggle(99);
    const raw = mmkvStorage.getItem('favorites-ids');
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw as string)).toEqual([99]);
  });
});
