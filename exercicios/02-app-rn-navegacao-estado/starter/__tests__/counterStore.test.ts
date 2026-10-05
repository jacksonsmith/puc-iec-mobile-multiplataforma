// __tests__/counterStore.test.ts
//
// Exemplo de teste pra Zustand store.
//
// TASK 4: testes de decrement, reset e caso de múltiplos incrementos.
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
    useCounterStore.getState().decrement();
    expect(useCounterStore.getState().count).toBe(-1);
  });

  test('reset volta count para 0 após mutações', () => {
    useCounterStore.getState().increment();
    useCounterStore.getState().increment();
    useCounterStore.getState().decrement();

    useCounterStore.getState().reset();

    expect(useCounterStore.getState().count).toBe(0);
  });

  test('100 incrementos resultam em count igual a 100', () => {
    for (let index = 0; index < 100; index += 1) {
      useCounterStore.getState().increment();
    }

    expect(useCounterStore.getState().count).toBe(100);
  });
});
