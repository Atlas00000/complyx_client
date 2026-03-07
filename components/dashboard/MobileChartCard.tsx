'use client';

import { ReactNode } from 'react';

interface MobileChartCardProps {
  title: string;
  children: ReactNode;
  viewFullHref?: string;
  className?: string;
}

/**
 * MobileChartCard
 *
 * Wrapper for mobile dashboard charts: title + chart area. Optional "View full" link.
 * No Framer Motion.
 */
export default function MobileChartCard({
  title,
  children,
  viewFullHref,
  className = '',
}: MobileChartCardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-700/50">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-slate-200">
          {title}
        </h2>
        {viewFullHref && (
          <a
            href={viewFullHref}
            className="text-xs font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          >
            View full
          </a>
        )}
      </div>
      <div className="p-3 min-h-[200px] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
