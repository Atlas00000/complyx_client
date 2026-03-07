'use client';

import { useEffect, useState, useRef } from 'react';

/**
 * usePageLoading Hook
 *
 * Shows loading for at least minLoadingTime, then hides. Never blocks on
 * document.readyState so loading always clears (avoids stuck loading on mobile/SPA).
 */
interface UsePageLoadingOptions {
  minLoadingTime?: number; // Minimum time to show loading (ms)
  dependencies?: unknown[]; // Optional: delay hide until these are ready
}

const MAX_LOADING_MS = 3000; // Always clear loading after this (e.g. mobile Safari)

export function usePageLoading(options: UsePageLoadingOptions = {}) {
  const { minLoadingTime = 800, dependencies = [] } = options;
  const [isLoading, setIsLoading] = useState(true);
  const depsRef = useRef(dependencies);
  depsRef.current = dependencies;

  useEffect(() => {
    const depsReady = () =>
      depsRef.current.length === 0 ||
      depsRef.current.every((d) => d != null);

    const hide = () => setIsLoading(false);

    const t1 = setTimeout(() => {
      if (depsReady()) hide();
    }, minLoadingTime);

    const t2 = setTimeout(() => {
      hide();
    }, MAX_LOADING_MS);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [minLoadingTime]);

  return isLoading;
}
