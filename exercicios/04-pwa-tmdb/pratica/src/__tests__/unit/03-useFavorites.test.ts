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
    act(() => result.current.toggle(42));
    expect(result.current.isFavorite(42)).toBe(false);
    expect(result.current.count).toBe(0);
  });

  it('4. persiste favoritos no localStorage', () => {
    const first = renderHook(() => useFavorites());
    act(() => first.result.current.toggle(7));
    first.unmount();

    const second = renderHook(() => useFavorites());
    expect(second.result.current.isFavorite(7)).toBe(true);
    expect(second.result.current.count).toBe(1);
  });

  it('5. chama navigator.setAppBadge com a contagem', () => {
    const setAppBadge = vi.fn();
    
    navigator.setAppBadge = setAppBadge;

    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggle(1));

    expect(setAppBadge).toHaveBeenCalledWith(1);
  });
});
