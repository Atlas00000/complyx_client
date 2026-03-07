'use client';

import { ReactNode } from 'react';

interface MobileChatShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * MobileChatShell
 *
 * Layout wrapper for the mobile chat page. Full viewport, safe-area padding,
 * flex column. No Framer Motion—ensures stable, visible shell on mobile.
 */
export default function MobileChatShell({ children, className = '' }: MobileChatShellProps) {
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
