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

  it('3. toggle duas vezes remove o favorito — renderize o hook, toggle(42) × 2, isFavorite(42) === false', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => result.current.toggle(42));
    act(() => result.current.toggle(42));

    expect(result.current.isFavorite(42)).toBe(false);
  });

  it('4. persiste favoritos no localStorage — adicione id=7, desmonte, remonte, isFavorite(7) === true', () => {
    const { result: firstMount, unmount } = renderHook(() => useFavorites())

    act(() => firstMount.current.toggle(7));
    
    unmount()

    const { result: secondMount } = renderHook(() => useFavorites());

    expect(secondMount.current.isFavorite(7)).toBe(true);
  });

  it('5. chama navigator.setAppBadge com a contagem — mock vi.fn(), toggle(1), setAppBadge chamado com 1', () => {
    const setAppBadge = vi.fn();

    navigator.setAppBadge = setAppBadge

    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggle(1);
    });

    expect(setAppBadge).toHaveBeenCalledWith(1);
  });
});
