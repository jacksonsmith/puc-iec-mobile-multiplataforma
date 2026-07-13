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
    unmount();

    const { result: remounted } = renderHook(() => useFavorites());
    expect(remounted.current.isFavorite(42)).toBe(true);
    expect(remounted.current.count).toBe(1);
  });

  it('5. chama navigator.setAppBadge com a contagem', () => {
    const setAppBadge = vi.fn();
    Object.defineProperty(navigator, 'setAppBadge', {
      value: setAppBadge,
      configurable: true,
    });

    const { result } = renderHook(() => useFavorites());
    expect(setAppBadge).toHaveBeenCalledWith(0);

    act(() => result.current.toggle(42));
    expect(setAppBadge).toHaveBeenLastCalledWith(1);
  });
});
