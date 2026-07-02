// src/__tests__/unit/03-useFavorites.test.ts
// ✅ AVALIATIVO — implemente os casos marcados com TODO
// Os casos 1 e 2 já estão prontos como exemplo. Implemente 3, 4 e 5.

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
    act(() => result.current.toggle(42));
    expect(result.current.isFavorite(42)).toBe(true);
    expect(result.current.count).toBe(1);

    act(() => result.current.toggle(42));
    expect(result.current.isFavorite(42)).toBe(false);
    expect(result.current.count).toBe(0);
  });

  it('4. persiste favoritos no localStorage', () => {
    const { result, unmount } = renderHook(() => useFavorites());
    act(() => result.current.toggle(7));
    expect(result.current.isFavorite(7)).toBe(true);

    unmount();

    const { result: result2 } = renderHook(() => useFavorites());
    expect(result2.current.isFavorite(7)).toBe(true);
  });

  it('5. chama navigator.setAppBadge com a contagem', () => {
    const setAppBadgeMock = vi.fn();

    navigator.setAppBadge = setAppBadgeMock;

    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggle(1));
  });
});
