// __tests__/linking.test.ts
//
// BÔNUS — valida a configuração de deep link sem precisar de simulador.

import { getStateFromPath } from '@react-navigation/native';
import { linking } from '../src/routes/linking';

describe('deep linking', () => {
  test('detail/42 abre a tela Detail com id numérico', () => {
    const state = getStateFromPath('detail/42', linking.config);
    const route = state?.routes[state.routes.length - 1];
    expect(route?.name).toBe('Detail');
    expect((route?.params as { id: number }).id).toBe(42);
  });

  test('favorites abre a aba Favoritos', () => {
    const state = getStateFromPath('favorites', linking.config);
    expect(state?.routes[0].name).toBe('Home');
  });
});
