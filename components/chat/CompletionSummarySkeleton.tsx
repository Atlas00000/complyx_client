'use client';

interface CompletionSummarySkeletonProps {
  onStartAnother?: () => void;
  className?: string;
}

/**
 * Loading skeleton shown while completion summary is being fetched.
 */
export default function CompletionSummarySkeleton({
  onStartAnother,
  className = '',
}: CompletionSummarySkeletonProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 shadow-sm overflow-hidden ${className}`}
      aria-busy="true"
      aria-label="Loading assessment results"
    >
      <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-primary/5 dark:bg-primary/10">
        <div className="h-4 w-32 bg-gray-200 dark:bg-slate-600 rounded animate-pulse" />
        <div className="mt-2 h-8 w-24 bg-gray-200 dark:bg-slate-600 rounded animate-pulse" />
        <div className="mt-1.5 h-3 w-48 bg-gray-200 dark:bg-slate-600 rounded animate-pulse" />
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="h-3 w-20 bg-gray-200 dark:bg-slate-600 rounded animate-pulse" />
          <div className="h-3 w-full bg-gray-200 dark:bg-slate-600 rounded animate-pulse" />
          <div className="h-3 w-3/4 bg-gray-200 dark:bg-slate-600 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-28 bg-gray-200 dark:bg-slate-600 rounded animate-pulse" />
          <div className="h-3 w-full bg-gray-200 dark:bg-slate-600 rounded animate-pulse" />
        </div>
        <div className="pt-3">
          {onStartAnother && (
            <button
              type="button"
              onClick={onStartAnother}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Start another
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
