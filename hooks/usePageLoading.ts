'use client';

import { useEffect, useState } from 'react';

/**
 * usePageLoading Hook
 * 
 * Manages page-level loading state with minimum display time
 * to ensure smooth transitions and visible loading on refresh
 */
interface UsePageLoadingOptions {
  minLoadingTime?: number; // Minimum time to show loading (ms)
  dependencies?: unknown[]; // Dependencies that should be ready before hiding loading
}

export function usePageLoading(options: UsePageLoadingOptions = {}) {
  const { minLoadingTime = 800, dependencies = [] } = options;
  const [isLoading, setIsLoading] = useState(true);
  const [startTime] = useState(() => Date.now());

  useEffect(() => {
    // Always show loading for minimum time
    const checkAndHide = () => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsed);
      
      setTimeout(() => {
        // Check if dependencies are ready
        const depsReady = dependencies.length === 0 || 
          dependencies.every(dep => dep !== null && dep !== undefined);
        
        // Also check if page is loaded
        const pageReady = document.readyState === 'complete';
        
        if (depsReady && pageReady) {
          setIsLoading(false);
        }
      }, remainingTime);
    };

    // If page is already loaded, still wait for min time
    if (document.readyState === 'complete') {
      checkAndHide();
      return undefined;
    } else {
      const handleLoad = () => {
        checkAndHide();
      };
      
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [startTime, minLoadingTime, dependencies]);

  // Fallback: hide loading after max time (2x min time)
  useEffect(() => {
    const maxTimer = setTimeout(() => {
      setIsLoading(false);
    }, minLoadingTime * 2);

    return () => clearTimeout(maxTimer);
  }, [minLoadingTime]);

  return isLoading;
}
