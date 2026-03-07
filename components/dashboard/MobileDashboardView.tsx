'use client';

import MobileDashboardShell from './MobileDashboardShell';
import MobileDashboardHeader from './MobileDashboardHeader';

interface MobileDashboardViewProps {
  title?: string;
  onChatClick?: () => void;
}

/**
 * MobileDashboardView
 *
 * Week 1: Shell + header + placeholder. Dashboard content in Week 2+.
 */
export default function MobileDashboardView({
  title = 'Dashboard',
  onChatClick,
}: MobileDashboardViewProps) {
  return (
    <MobileDashboardShell>
      <MobileDashboardHeader title={title} onChatClick={onChatClick} />
      <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-4 text-center text-gray-500 dark:text-slate-400 text-sm">
          Dashboard content will go here (Week 2).
        </div>
      </main>
    </MobileDashboardShell>
  );
}
