// src/__tests__/unit/03-useFavorites.test.ts
// 📘 MODELO — todos os casos já estão prontos. Leia o 5: ele testa a Badging API
// (navigator.setAppBadge), o número no ícone do PWA instalado.

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavorites } from '../../hooks/useFavorites';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('useFavorites', () => {
  it('1. começa sem favoritos', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.count).toBe(0);
  });

  it('2. toggle adiciona um id aos favoritos', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggle(42));
    expect(result.current.isFavorite(42)).toBe(true);
    expect(result.current.count).toBe(1);
  });

  // 🧑‍💻 TODO 2a — toggle duas vezes deve REMOVER o favorito
  // Dica: chame toggle(42) duas vezes e verifique isFavorite + count
  it('3. toggle duas vezes remove o favorito', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => {
      result.current.toggle(42);
      result.current.toggle(42);
    });
    expect(result.current.isFavorite(42)).toBe(false);
    expect(result.current.count).toBe(0);
  });

  // 🧑‍💻 TODO 2b — favoritos devem sobreviver a um unmount + remount
  // Dica: use { result, unmount } = renderHook(...), faça toggle, unmount(),
  //       renderHook novamente e verifique isFavorite no novo result
  it('4. persiste favoritos no localStorage', () => {
    const { result, unmount } = renderHook(() => useFavorites());
    act(() => result.current.toggle(42));
    unmount();

    const remounted = renderHook(() => useFavorites());
    expect(remounted.result.current.isFavorite(42)).toBe(true);
    expect(remounted.result.current.count).toBe(1);
    remounted.unmount();
  });

  // 🧑‍💻 TODO 2c — hook deve chamar navigator.setAppBadge com a contagem
  // Dica: vi.fn() + Object.defineProperty(navigator, 'setAppBadge', { value: mockBadge, configurable: true })
  it('5. chama navigator.setAppBadge com a contagem', () => {
    const mockBadge = vi.fn();
    Object.defineProperty(navigator, 'setAppBadge', {
      value: mockBadge,
      configurable: true,
    });

    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggle(42));

    expect(mockBadge).toHaveBeenLastCalledWith(1);
  });
});
