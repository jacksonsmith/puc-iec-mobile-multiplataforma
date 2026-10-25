import { afterEach, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useOfflineStatus } from '../../hooks/useOfflineStatus';

afterEach(() => vi.restoreAllMocks());

it('inicia com navigator.onLine, acompanha eventos e remove listeners ao desmontar', () => {
  vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
  const remove = vi.spyOn(window, 'removeEventListener');
  const { result, unmount } = renderHook(() => useOfflineStatus());
  expect(result.current.isOnline).toBe(false);
  act(() => window.dispatchEvent(new Event('online')));
  expect(result.current.isOnline).toBe(true);
  act(() => window.dispatchEvent(new Event('offline')));
  expect(result.current.isOnline).toBe(false);
  unmount();
  expect(remove).toHaveBeenCalledWith('online', expect.any(Function));
  expect(remove).toHaveBeenCalledWith('offline', expect.any(Function));
});
