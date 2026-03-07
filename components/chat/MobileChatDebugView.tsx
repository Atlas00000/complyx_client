'use client';

import MobileChatShell from './MobileChatShell';
import MobileChatHeader from './MobileChatHeader';

interface MobileChatDebugViewProps {
  title?: string;
  onHistoryClick?: () => void;
  onMoreClick?: () => void;
}

/**
 * MobileChatDebugView
 *
 * Mobile chat page: shell + header + main content area.
 * Week 1: shell and header only; main area is a placeholder until Week 2.
 */
export default function MobileChatDebugView({
  title = 'Complyx',
  onHistoryClick,
  onMoreClick,
}: MobileChatDebugViewProps) {
  return (
    <MobileChatShell>
      <MobileChatHeader
        title={title}
        onHistoryClick={onHistoryClick}
        onMoreClick={onMoreClick}
      />
      <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-4 text-center text-gray-500 dark:text-slate-400 text-sm">
          Chat content will go here (Week 2).
        </div>
      </main>
    </MobileChatShell>
  );
}
