// src/hooks/useInfiniteScroll.ts — abstração genérica de lazy loading

import { useEffect, type RefObject } from 'react';

export function useInfiniteScroll(
  sentinelRef: RefObject<Element | null>,
  onIntersect: () => void,
  options: IntersectionObserverInit = { rootMargin: '200px' },
) {
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onIntersect(); },
      options,
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [sentinelRef, onIntersect]);
}
