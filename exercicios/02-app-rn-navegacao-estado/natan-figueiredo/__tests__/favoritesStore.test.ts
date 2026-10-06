// __tests__/favoritesStore.test.ts
//
// Testes do useFavoritesStore (Zustand + persist manual em MMKV) —
// gerados com auxílio de IA e revisados.
//
// No Jest, react-native-mmkv usa automaticamente um mock em memória
// (detecta JEST_WORKER_ID), então dá pra verificar a persistência sem device.

import { useFavoritesStore, STORAGE_KEY } from '../src/store/favoritesStore';
import { mmkvStorage } from '../src/storage/mmkv';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
    mmkvStorage.removeItem(STORAGE_KEY);
  });

  test('toggle adiciona id se não existe', () => {
    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().ids).toEqual([42]);
  });

  test('toggle remove id se já existe', () => {
    useFavoritesStore.setState({ ids: [1, 42, 3] });
    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().ids).toEqual([1, 3]);
  });

  test('isFavorite retorna true após add e false após remove', () => {
    const { add, remove, isFavorite } = useFavoritesStore.getState();
    expect(isFavorite(7)).toBe(false);
    add(7);
    expect(useFavoritesStore.getState().isFavorite(7)).toBe(true);
    remove(7);
    expect(useFavoritesStore.getState().isFavorite(7)).toBe(false);
  });

  test('add é idempotente (não duplica id)', () => {
    const { add } = useFavoritesStore.getState();
    add(10);
    add(10);
    expect(useFavoritesStore.getState().ids).toEqual([10]);
  });

  test('remove de id inexistente não altera a lista', () => {
    useFavoritesStore.setState({ ids: [1, 2] });
    useFavoritesStore.getState().remove(99);
    expect(useFavoritesStore.getState().ids).toEqual([1, 2]);
  });

  test('clear esvazia ids', () => {
    useFavoritesStore.setState({ ids: [1, 2, 3] });
    useFavoritesStore.getState().clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('persiste ids no MMKV a cada mudança', () => {
    const { add, toggle } = useFavoritesStore.getState();
    add(5);
    add(8);
    toggle(5);
    expect(JSON.parse(mmkvStorage.getItem(STORAGE_KEY) ?? 'null')).toEqual([8]);
  });

  test('estado inicial é carregado do MMKV (sobrevive a reload)', () => {
    jest.isolateModules(() => {
      // simula um reload: storage já tem dados salvos e o módulo do store é recriado
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { mmkvStorage: freshStorage } = require('../src/storage/mmkv');
      freshStorage.setItem(STORAGE_KEY, JSON.stringify([11, 22]));
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useFavoritesStore: reloaded } = require('../src/store/favoritesStore');
      expect(reloaded.getState().ids).toEqual([11, 22]);
      expect(reloaded.getState().isFavorite(22)).toBe(true);
    });
  });

  test('dado corrompido no storage cai pra lista vazia', () => {
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { mmkvStorage: freshStorage } = require('../src/storage/mmkv');
      freshStorage.setItem(STORAGE_KEY, '{não é json');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useFavoritesStore: reloaded } = require('../src/store/favoritesStore');
      expect(reloaded.getState().ids).toEqual([]);
    });
  });
});
