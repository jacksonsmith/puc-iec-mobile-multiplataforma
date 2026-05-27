// __tests__/counterStore.test.ts
//
// Exemplo de teste pra Zustand store.
//
// TODO [aluno + IA]: expandir com mais 2 testes (decrement, reset, edge cases).
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

  // TODO [aluno + IA]: adicione testes pra decrement, reset, edge cases.
  // Mínimo 3 testes verdes pra CI passar.
});
