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

  it('3. toggle duas vezes remove o favorito', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggle(42);
      result.current.toggle(42);
    });

    expect(result.current.isFavorite(42)).toBe(false);
    expect(result.current.count).toBe(0);
  });

  it('4. persiste favoritos no localStorage', () => {
    const first = renderHook(() => useFavorites());

    act(() => first.result.current.toggle(42));
    first.unmount();

    const second = renderHook(() => useFavorites());
    expect(second.result.current.isFavorite(42)).toBe(true);
    expect(second.result.current.count).toBe(1);
  });

  it('5. chama navigator.setAppBadge com a contagem', () => {
    const mockBadge = vi.fn();
    Object.defineProperty(navigator, 'setAppBadge', {
      value: mockBadge,
      configurable: true,
    });

    const { result } = renderHook(() => useFavorites());
    expect(mockBadge).toHaveBeenLastCalledWith(0);

    act(() => result.current.toggle(42));
    expect(mockBadge).toHaveBeenLastCalledWith(1);
  });
});
