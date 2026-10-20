// src/__tests__/unit/03-useFavorites.test.ts
// Testes do estado, persistência e badge de favoritos.
// 📘 MODELO: testes 1 e 2 estão prontos — leia antes de começar
// 🧑‍💻 SEU TRABALHO: testes 3, 4 e 5 (1 pt cada)

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavorites } from '../../hooks/useFavorites';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('useFavorites', () => {
  // 📘 MODELO — leia e entenda antes de escrever os próximos
  it('1. começa sem favoritos', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.count).toBe(0);
  });

  // 📘 MODELO
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

    act(() => result.current.toggle(42));

    expect(result.current.isFavorite(42)).toBe(false);
    expect(result.current.count).toBe(0);
  });

  it('4. persiste favoritos no localStorage', () => {
    const { result, unmount } = renderHook(() => useFavorites());
    act(() => result.current.toggle(42));
    expect(JSON.parse(localStorage.getItem('tmdb-favorites')!)).toEqual([42]);
    unmount();

    const { result: remounted } = renderHook(() => useFavorites());

    expect(remounted.current.isFavorite(42)).toBe(true);
    expect(remounted.current.count).toBe(1);
  });

  it('5. chama navigator.setAppBadge com a contagem', () => {
    const mockBadge = vi.fn().mockResolvedValue(undefined);
    const original = Object.getOwnPropertyDescriptor(navigator, 'setAppBadge');
    Object.defineProperty(navigator, 'setAppBadge', {
      value: mockBadge,
      configurable: true,
    });

    try {
      const { result, unmount } = renderHook(() => useFavorites());
      expect(mockBadge).toHaveBeenLastCalledWith(0);

      act(() => result.current.toggle(42));
      expect(mockBadge).toHaveBeenLastCalledWith(1);

      act(() => result.current.toggle(7));
      expect(mockBadge).toHaveBeenLastCalledWith(2);

      act(() => result.current.toggle(42));
      expect(mockBadge).toHaveBeenLastCalledWith(1);

      act(() => result.current.toggle(7));
      expect(mockBadge).toHaveBeenLastCalledWith(0);
      unmount();
    } finally {
      if (original) Object.defineProperty(navigator, 'setAppBadge', original);
      else Reflect.deleteProperty(navigator, 'setAppBadge');
    }
  });
});
