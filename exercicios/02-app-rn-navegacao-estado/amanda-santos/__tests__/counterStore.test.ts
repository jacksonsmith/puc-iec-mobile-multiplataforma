import { useCounterStore as store } from '../src/store/counterStore';
describe('contador', () => {
 beforeEach(() => store.getState().reset());
 test('incrementa', () => {store.getState().increment(); expect(store.getState().count).toBe(1);});
 test('decrementa abaixo de zero', () => {store.getState().decrement(); expect(store.getState().count).toBe(-1);});
 test('zera depois de alterações', () => {store.getState().increment();store.getState().increment();store.getState().reset();expect(store.getState().count).toBe(0);});
 test('suporta incrementos consecutivos', () => {for(let i=0;i<100;i++)store.getState().increment();expect(store.getState().count).toBe(100);});
});
