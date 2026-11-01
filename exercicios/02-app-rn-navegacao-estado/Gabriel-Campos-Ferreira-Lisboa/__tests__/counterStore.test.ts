import { useCounterStore } from '../src/store/counterStore';

describe('counterStore', () => {
    beforeEach(() => useCounterStore.setState({ count: 0 }));

    test('increment aumenta o contador', () => {
        useCounterStore.getState().increment();
        expect(useCounterStore.getState().count).toBe(1);
    });

    test('decrement diminui o contador', () => {
        useCounterStore.setState({ count: 2 });
        useCounterStore.getState().decrement();
        expect(useCounterStore.getState().count).toBe(1);
    });

    test('reset volta o contador para zero', () => {
        useCounterStore.setState({ count: 8 });
        useCounterStore.getState().reset();
        expect(useCounterStore.getState().count).toBe(0);
    });

    test('100 incrementos consecutivos resultam em 100', () => {
        for (let i = 0; i < 100; i += 1) useCounterStore.getState().increment();
        expect(useCounterStore.getState().count).toBe(100);
    });
});
