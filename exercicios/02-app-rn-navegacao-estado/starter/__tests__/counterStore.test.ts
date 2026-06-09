// __tests__/counterStore.test.ts
//
// Exemplo de teste pra Zustand store.
//
// Prompt sugerido pra IA:
//   "Adicione testes Jest pra useCounterStore cobrindo:
//    - decrement diminui count em 1
//    - reset volta count pra 0 após mutações
//    - 100 increments seguidos resultam em count=100
//    Mantenha estilo dos testes existentes (describe + beforeEach + test)."

import { useCounterStore } from '../src/store/counterStore';

type CounterStoreForTest = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

const counterStore = () => useCounterStore.getState() as CounterStoreForTest;

describe('counterStore', () => {
  beforeEach(() => {
    useCounterStore.setState({ count: 0 });
  });

  test('increment aumenta count em 1', () => {
    counterStore().increment();
    expect(useCounterStore.getState().count).toBe(1);
  });

  test('decrement diminui count em 1', () => {
    counterStore().decrement();
    expect(useCounterStore.getState().count).toBe(-1);
  });

  test('reset volta count para 0 apos mutacoes', () => {
    counterStore().increment();
    counterStore().increment();
    counterStore().decrement();

    counterStore().reset();

    expect(useCounterStore.getState().count).toBe(0);
  });

  test('100 increments seguidos resultam em count 100', () => {
    for (let i = 0; i < 100; i += 1) {
      counterStore().increment();
    }

    expect(useCounterStore.getState().count).toBe(100);
  });
});
