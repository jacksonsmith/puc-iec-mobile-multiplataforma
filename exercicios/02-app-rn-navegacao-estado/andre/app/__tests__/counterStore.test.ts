// __tests__/counterStore.test.ts
//
// Exemplo de teste pra Zustand store.
//
// TODO [TASK 4]: expandir com mais 2 testes (decrement, reset, edge cases) usando IA.
//
// Prompt sugerido pra IA:
//   "Adicione testes Jest pra useCounterStore cobrindo:
//    - decrement diminui count em 1
//    - reset volta count pra 0 após mutações
//    - 100 increments seguidos resultam em count=100
//    Mantenha estilo dos testes existentes (describe + beforeEach + test)."

import { useCounterStore } from '../src/store/counterStore';

describe('counterStore', () => {
  beforeEach(() => {
    useCounterStore.setState({ count: 0 });
  });

  test('increment aumenta count em 1', () => {
    useCounterStore.getState().increment?.();
    expect(useCounterStore.getState().count).toBe(1);
  });

  test('decrement diminui count em 1', () => {
    useCounterStore.getState().decrement?.();
    expect(useCounterStore.getState().count).toBe(-1);
  });

  test('reset volta count pra 0 após mutações', () => {
    const store = useCounterStore.getState();
    store.increment?.();
    store.increment?.();
    store.decrement?.();
    expect(useCounterStore.getState().count).toBe(1);

    store.reset?.();
    expect(useCounterStore.getState().count).toBe(0);
  });

  test('100 increments seguidos resultam em count igual a 100', () => {
    const store = useCounterStore.getState();

    for (let i = 0; i < 100; i += 1) {
      store.increment?.();
    }

    expect(useCounterStore.getState().count).toBe(100);
  });
});
