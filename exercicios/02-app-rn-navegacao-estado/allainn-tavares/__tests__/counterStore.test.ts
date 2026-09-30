// __tests__/counterStore.test.ts
//
// Exemplo de teste pra Zustand store.
//
// TASK 4: testes de decrement, reset e edge cases gerados com auxílio de IA
// (Claude Code) a partir do prompt abaixo e revisados.
//
// Prompt usado:
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
    useCounterStore.setState({ count: 5 });
    useCounterStore.getState().decrement();
    expect(useCounterStore.getState().count).toBe(4);
  });

  test('reset volta count pra 0 após mutações', () => {
    const { increment, decrement, reset } = useCounterStore.getState();
    increment();
    increment();
    decrement();
    expect(useCounterStore.getState().count).toBe(1);

    reset();
    expect(useCounterStore.getState().count).toBe(0);
    // set() faz merge raso: o reset troca só o count, as actions continuam no store
    expect(typeof useCounterStore.getState().increment).toBe('function');
  });

  test('100 increments seguidos resultam em count=100', () => {
    // a mesma referência de increment é chamada 100 vezes: só passa se cada
    // chamada ler o estado mais recente (aqui, via set com função)
    const { increment } = useCounterStore.getState();
    for (let i = 0; i < 100; i++) increment();
    expect(useCounterStore.getState().count).toBe(100);
  });

  test('decrement a partir de 0 fica negativo (store não tem limite inferior)', () => {
    useCounterStore.getState().decrement();
    expect(useCounterStore.getState().count).toBe(-1);
  });
});
