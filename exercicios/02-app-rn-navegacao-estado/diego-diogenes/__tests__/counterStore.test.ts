// __tests__/counterStore.test.ts
//
// HANDS-ON AULA 2 — TASK 4
//
// Testes do counterStore (Zustand). Cobrem increment, decrement, reset e
// edge cases (operações consecutivas e valores negativos).

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

  test('reset volta count para 0 após mutações', () => {
    const { increment, reset } = useCounterStore.getState();
    increment();
    increment();
    increment();
    reset();
    expect(useCounterStore.getState().count).toBe(0);
  });

  test('operações consecutivas acumulam o resultado', () => {
    const { increment, decrement } = useCounterStore.getState();
    increment();
    increment();
    increment();
    decrement();
    expect(useCounterStore.getState().count).toBe(2);
  });

  test('decrement permite valores negativos', () => {
    useCounterStore.getState().decrement();
    useCounterStore.getState().decrement();
    expect(useCounterStore.getState().count).toBe(-2);
  });
});
