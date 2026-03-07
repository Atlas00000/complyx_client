'use client';

import { ReactNode } from 'react';

interface MobileDashboardShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * MobileDashboardShell
 *
 * Layout wrapper for the mobile dashboard page. Full viewport, safe-area padding,
 * flex column. No Framer Motion—ensures stable, visible shell on mobile.
 */
export default function MobileDashboardShell({
  children,
  className = '',
}: MobileDashboardShellProps) {
  return (
    <div
      className={`flex flex-col min-h-[100dvh] bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 overflow-hidden ${className}`}
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      {children}
    </div>
  );
}
