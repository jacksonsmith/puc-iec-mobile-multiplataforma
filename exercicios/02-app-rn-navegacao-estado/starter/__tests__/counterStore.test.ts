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
    useCounterStore.getState().decrement();
    expect(useCounterStore.getState().count).toBe(-1);
  });

  test('reset volta count para 0 após mutações', () => {
    useCounterStore.getState().increment();
    useCounterStore.getState().increment();
    useCounterStore.getState().reset();

    expect(useCounterStore.getState().count).toBe(0);
  });

  test('100 increments seguidos resultam em count 100', () => {
    for (let i = 0; i < 100; i++) {
      useCounterStore.getState().increment();
    }

    expect(useCounterStore.getState().count).toBe(100);
  });
});