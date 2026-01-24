'use client';

import { Suspense, ComponentType, ReactNode } from 'react';
import LoadingSpinner from './loading/LoadingSpinner';

/**
 * LazyLoad Component
 * 
 * Wrapper for lazy-loaded components with Suspense boundary
 * Provides loading fallback during component loading
 */
interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function LazyLoad({ children, fallback }: LazyLoadProps) {
  return (
    <Suspense fallback={fallback || <LazyLoadFallback />}>
      {children}
    </Suspense>
  );
}

/**
 * Default fallback for lazy loading
 */
function LazyLoadFallback() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <LoadingSpinner size="medium" />
    </div>
  );
}

/**
 * Helper function to create lazy-loaded component with wrapper
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  return { lazy: () => importFn(), Component: null as T | null };
}
