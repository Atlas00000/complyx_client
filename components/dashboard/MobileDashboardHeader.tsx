'use client';

import { useCallback, useEffect, useState } from 'react';
import { getEffectiveTheme, setTheme } from '@/lib/utils/theme';

interface MobileDashboardHeaderProps {
  title?: string;
  onChatClick?: () => void;
}

/**
 * MobileDashboardHeader
 *
 * Mobile-only header for dashboard: title, optional Chat link, theme toggle.
 * Plain HTML + Tailwind, no Framer Motion—reliable on mobile.
 */
export default function MobileDashboardHeader({
  title = 'Dashboard',
  onChatClick,
}: MobileDashboardHeaderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(getEffectiveTheme() === 'dark');
  }, []);

  const handleThemeToggle = useCallback(() => {
    const next = isDark ? 'light' : 'dark';
    setTheme(next);
    setIsDark(next === 'dark');
  }, [isDark]);

  return (
    <header className="sticky top-0 z-10 flex-shrink-0 flex items-center justify-between h-14 px-4 border-b border-gray-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
      <div className="flex items-center gap-2 min-w-0">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-slate-100 truncate">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-1">
        {onChatClick && (
          <button
            type="button"
            onClick={onChatClick}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            title="Chat"
            aria-label="Open chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        )}
        <button
          type="button"
          onClick={handleThemeToggle}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          title={isDark ? 'Switch to light' : 'Switch to dark'}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
