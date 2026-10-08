// __tests__/counterStore.test.ts
//
// Exemplo de teste pra Zustand store.
//
// TASK 4: testes adicionais (decrement, reset, edge cases) gerados com auxílio de IA.
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
    useCounterStore.getState().increment();
    expect(useCounterStore.getState().count).toBe(1);
  });

  test('decrement diminui count em 1', () => {
    useCounterStore.setState({ count: 5 });
    useCounterStore.getState().decrement();
    expect(useCounterStore.getState().count).toBe(4);
  });

  test('decrement a partir de 0 resulta em -1 (sem limite inferior)', () => {
    useCounterStore.getState().decrement();
    expect(useCounterStore.getState().count).toBe(-1);
  });

  test('reset volta count pra 0 após mutações', () => {
    const { increment, reset } = useCounterStore.getState();
    increment();
    increment();
    increment();
    reset();
    expect(useCounterStore.getState().count).toBe(0);
  });

  test('100 increments seguidos resultam em count=100', () => {
    const { increment } = useCounterStore.getState();
    for (let i = 0; i < 100; i++) increment();
    expect(useCounterStore.getState().count).toBe(100);
  });

  test('increment e decrement se anulam', () => {
    const { increment, decrement } = useCounterStore.getState();
    increment();
    decrement();
    expect(useCounterStore.getState().count).toBe(0);
  });
});
