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

  // 🧑‍💻 TODO 2a — toggle duas vezes deve REMOVER o favorito
  // Dica: chame toggle(42) duas vezes e verifique isFavorite + count
  it.todo('3. toggle duas vezes remove o favorito', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggle(42));
    act(() => result.current.toggle(42));
    expect(result.current.isFavorite(42)).toBe(false);
    expect(result.current.count).toBe(0);
  });

  // 🧑‍💻 TODO 2b — favoritos devem sobreviver a um unmount + remount
  // Dica: use { result, unmount } = renderHook(...), faça toggle, unmount(),
  //       renderHook novamente e verifique isFavorite no novo result
  it.todo('4. persiste favoritos no localStorage', () => {
    const { result, unmount } = renderHook(() => useFavorites());
    act(() => result.current.toggle(42));
    unmount();
    const { result: result2 } = renderHook(() => useFavorites());
    expect(result2.current.isFavorite(42)).toBe(true);
  });

  // 🧑‍💻 TODO 2c — hook deve chamar navigator.setAppBadge com a contagem
  // Dica: vi.fn() + Object.defineProperty(navigator, 'setAppBadge', { value: mockBadge, configurable: true })
  it.todo('5. chama navigator.setAppBadge com a contagem', () => {
    const mockBadge = vi.fn();
    Object.defineProperty(navigator, 'setAppBadge', {
      value: mockBadge,
      configurable: true,
    });
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggle(42));
    expect(mockBadge).toHaveBeenCalledWith(1);
  });
});
