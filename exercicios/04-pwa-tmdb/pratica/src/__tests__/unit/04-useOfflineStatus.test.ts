// src/__tests__/unit/04-useOfflineStatus.test.ts
// Autoral — valida o TODO 5 (estado inicial, eventos online/offline e cleanup)

import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOfflineStatus } from '../../hooks/useOfflineStatus';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useOfflineStatus', () => {
  it('1. começa com o valor de navigator.onLine', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    const { result } = renderHook(() => useOfflineStatus());
    expect(result.current.isOnline).toBe(false);
  });

  it('2. acompanha os eventos offline e online do window', () => {
    const { result } = renderHook(() => useOfflineStatus());

    act(() => { window.dispatchEvent(new Event('offline')); });
    expect(result.current.isOnline).toBe(false);

    act(() => { window.dispatchEvent(new Event('online')); });
    expect(result.current.isOnline).toBe(true);
  });

  it('3. remove os mesmos listeners ao desmontar', () => {
    const add = vi.spyOn(window, 'addEventListener');
    const remove = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useOfflineStatus());
    unmount();

    for (const type of ['online', 'offline']) {
      const added = add.mock.calls.find(([t]) => t === type)?.[1];
      expect(added).toBeDefined();
      expect(remove).toHaveBeenCalledWith(type, added);
    }
  });
});
