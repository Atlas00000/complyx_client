'use client';

import { ReactNode } from 'react';

interface MobileDetailHeaderProps {
  title: string;
  onBack: () => void;
  right?: ReactNode;
}

/**
 * MobileDetailHeader
 *
 * Header for mobile detail/drill-down views: back button, title, optional right action.
 * No Framer Motion. 44px tap targets.
 */
export default function MobileDetailHeader({
  title,
  onBack,
  right,
}: MobileDetailHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex-shrink-0 flex items-center gap-2 h-14 px-4 border-b border-gray-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
      <button
        type="button"
        onClick={onBack}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 -ml-2"
        aria-label="Go back"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 className="flex-1 text-lg font-semibold text-gray-900 dark:text-slate-100 truncate min-w-0">
        {title}
      </h1>
      {right && <div className="flex-shrink-0">{right}</div>}
    </header>
  );
}
