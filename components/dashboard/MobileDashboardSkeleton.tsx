'use client';

/**
 * MobileDashboardSkeleton
 *
 * Loading placeholder for mobile dashboard (stats + list + chart blocks).
 * No Framer Motion.
 */
export default function MobileDashboardSkeleton() {
  return (
    <div className="p-4 space-y-6">
      {/* Stats */}
      <div className="space-y-3">
        <div className="h-[72px] rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-[72px] rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-[72px] rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
      </div>
      {/* List section */}
      <div className="space-y-2">
        <div className="h-4 w-28 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="h-[44px] bg-gray-100 dark:bg-slate-800/50 animate-pulse" />
          <div className="h-[44px] bg-gray-100 dark:bg-slate-800/50 animate-pulse" />
          <div className="h-[44px] bg-gray-100 dark:bg-slate-800/50 animate-pulse" />
        </div>
      </div>
      {/* Chart cards */}
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="h-10 bg-gray-100 dark:bg-slate-800/50 animate-pulse" />
          <div className="h-[200px] bg-gray-50 dark:bg-slate-800/30 animate-pulse" />
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="h-10 bg-gray-100 dark:bg-slate-800/50 animate-pulse" />
          <div className="h-[200px] bg-gray-50 dark:bg-slate-800/30 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
