'use client';

import { useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useDashboardData } from '@/hooks/useDashboardApi';

/**
 * MobileDashboardErrorBanner
 *
 * Shows dashboard API error with dismiss and retry. Self-contained: uses useDashboardData.
 * No Framer Motion.
 */
export default function MobileDashboardErrorBanner() {
  const { user } = useAuthStore();
  const userId = user?.id;
  const { error, refetch, isRefetching } = useDashboardData(
    userId ?? undefined,
    undefined,
    { enabled: !!userId, staleTime: 5 * 60 * 1000 }
  );
  const [dismissed, setDismissed] = useState(false);

  const message = error instanceof Error ? error.message : error ? String(error) : null;
  const show = !!userId && !!message && !dismissed;

  const handleRetry = useCallback(() => {
    setDismissed(false);
    refetch();
  }, [refetch]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  if (!show) return null;

  return (
    <div
      className="flex-shrink-0 flex items-center justify-between gap-3 px-4 py-3 bg-red-50 dark:bg-red-950/30 border-b border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-200"
      role="alert"
    >
      <p className="text-sm flex-1 min-w-0">{message}</p>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          type="button"
          onClick={handleRetry}
          disabled={isRefetching}
          className="min-h-[44px] px-3 flex items-center justify-center rounded-lg text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 text-sm font-medium"
        >
          {isRefetching ? 'Retrying…' : 'Retry'}
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
