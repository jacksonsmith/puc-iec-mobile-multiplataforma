// __tests__/counterStore.test.ts
//
// Exemplo de teste pra Zustand store.
//
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

  test('reset volta count para zero após mutações', () => {
    useCounterStore.getState().increment();
    useCounterStore.getState().increment();
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
