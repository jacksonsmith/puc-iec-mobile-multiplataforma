// src/__tests__/unit/03-useFavorites.test.ts
// ✅ AVALIATIVO — implemente os casos marcados com it.todo
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
    const { result } = renderHook(() => useFavorites())

    act(() => result.current.toggle(42));
    act(() => result.current.toggle(42));

    expect(result.current.isFavorite(42)).toBe(false);
  });

  it('4. persiste favoritos no localStorage', () => {
    const { result: firstMount, unmount } = renderHook(() => useFavorites())

    act(() => firstMount.current.toggle(7));
    
    unmount()

    const { result: secondMount } = renderHook(() => useFavorites());

    expect(secondMount.current.isFavorite(7)).toBe(true);
  });

  it('5. chama navigator.setAppBadge com a contagem', () => {
    const mockSetAppBadge = vi.fn();

    Object.defineProperties(
      navigator,
      {
        'setAppBadge': {
          value: mockSetAppBadge,
          configurable: true
        }
      }
    )

    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggle(1);
    });

    expect(mockSetAppBadge).toHaveBeenCalledWith(1);
  });
});
