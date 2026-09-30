// __tests__/favoritesStore.test.ts
//
// ATIVIDADE 2 — testar useFavoritesStore.
//
// TASK 9: testes gerados com auxílio de IA (Claude Code) a partir do prompt
// abaixo, ampliados com edge cases e persistência (TASK 7), e revisados.
//
// Prompt usado:
//   "Gere testes Jest pra useFavoritesStore (Zustand) cobrindo:
//    - toggle adiciona id se não existe
//    - toggle remove id se existe
//    - isFavorite retorna true após add
//    - clear esvazia ids
//    Use describe + beforeEach pra resetar state."
//
// No Jest não há localStorage: o store usa o MMKV, que se auto-mocka em memória.

import { useFavoritesStore } from '../src/store/favoritesStore';

const STORAGE_KEY = 'favorites-ids';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona id se não existe', () => {
    useFavoritesStore.getState().toggle(10);
    expect(useFavoritesStore.getState().ids).toEqual([10]);
  });

  test('toggle remove id se existe', () => {
    useFavoritesStore.setState({ ids: [10, 20] });
    useFavoritesStore.getState().toggle(10);
    expect(useFavoritesStore.getState().ids).toEqual([20]);
  });

  test('isFavorite retorna true após add (e false pra outro id)', () => {
    useFavoritesStore.getState().add(7);
    expect(useFavoritesStore.getState().isFavorite(7)).toBe(true);
    expect(useFavoritesStore.getState().isFavorite(8)).toBe(false);
  });

  test('clear esvazia ids', () => {
    useFavoritesStore.setState({ ids: [1, 2, 3] });
    useFavoritesStore.getState().clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('add não duplica um id que já é favorito', () => {
    const { add } = useFavoritesStore.getState();
    add(5);
    add(5);
    expect(useFavoritesStore.getState().ids).toEqual([5]);
  });

  test('remove de id inexistente não muda o estado nem notifica', () => {
    useFavoritesStore.setState({ ids: [1] });
    const antes = useFavoritesStore.getState().ids;
    const listener = jest.fn();
    const unsubscribe = useFavoritesStore.subscribe(listener);

    useFavoritesStore.getState().remove(99);
    unsubscribe();

    expect(useFavoritesStore.getState().ids).toBe(antes); // mesma referência
    expect(listener).not.toHaveBeenCalled();
  });
});

// Persistência (TASK 7): jest.isolateModules carrega cópias novas dos módulos,
// como um app que acabou de abrir.
describe('favoritesStore — persistência', () => {
  test('favoritos salvos voltam quando o app reabre', () => {
    let salvo: string | null = null;

    jest.isolateModules(() => {
      const { mmkvStorage } = require('../src/storage/mmkv');
      const { useFavoritesStore: store } = require('../src/store/favoritesStore');
      store.getState().toggle(10);
      store.getState().toggle(20);
      salvo = mmkvStorage.getItem(STORAGE_KEY);
    });
    expect(salvo).toBe('[10,20]');

    // "reabre o app": módulos novos, com o que estava gravado no disco
    jest.isolateModules(() => {
      const { mmkvStorage } = require('../src/storage/mmkv');
      mmkvStorage.setItem(STORAGE_KEY, salvo!);
      const { useFavoritesStore: store } = require('../src/store/favoritesStore');
      expect(store.getState().ids).toEqual([10, 20]);
    });
  });

  test('conteúdo inválido no storage é ignorado ao carregar', () => {
    jest.isolateModules(() => {
      const { mmkvStorage } = require('../src/storage/mmkv');
      mmkvStorage.setItem(STORAGE_KEY, '[1,"x",2,null]');
      const { useFavoritesStore: store } = require('../src/store/favoritesStore');
      expect(store.getState().ids).toEqual([1, 2]);
    });

    jest.isolateModules(() => {
      const { mmkvStorage } = require('../src/storage/mmkv');
      mmkvStorage.setItem(STORAGE_KEY, 'não é JSON');
      const { useFavoritesStore: store } = require('../src/store/favoritesStore');
      expect(store.getState().ids).toEqual([]);
    });
  });
});

// Web: o Jest roda sem localStorage, então aqui ele é simulado no window.
describe('favoritesStore — storage na web', () => {
  afterEach(() => {
    delete (window as any).localStorage;
  });

  test('com localStorage disponível, grava nele', () => {
    const mem = new Map<string, string>();
    (window as any).localStorage = {
      getItem: (k: string) => mem.get(k) ?? null,
      setItem: (k: string, v: string) => void mem.set(k, v),
      removeItem: (k: string) => void mem.delete(k),
    };
    jest.isolateModules(() => {
      const { useFavoritesStore: store } = require('../src/store/favoritesStore');
      store.getState().add(42);
    });
    expect(mem.get(STORAGE_KEY)).toBe('[42]');
  });

  test('com localStorage bloqueado, o app não quebra e usa o MMKV', () => {
    // navegador com dados do site bloqueados: ler a propriedade lança erro
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('SecurityError: acesso ao localStorage negado');
      },
    });
    jest.isolateModules(() => {
      const { useFavoritesStore: store } = require('../src/store/favoritesStore');
      store.getState().add(7);
      expect(store.getState().isFavorite(7)).toBe(true);
    });
  });
});
