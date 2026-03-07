'use client';

import MobileDetailHeader from './MobileDetailHeader';

export interface ActivityDetailItem {
  id: string;
  action: string;
  timestamp: Date | string;
  assessmentId?: string;
}

export interface AssessmentDetailItem {
  id: string;
  createdAt: Date | string;
  score: number;
  progress: number;
}

type DetailItem = { type: 'activity'; data: ActivityDetailItem } | { type: 'assessment'; data: AssessmentDetailItem };

interface MobileDashboardDetailProps {
  item: DetailItem;
  onClose: () => void;
}

function formatDate(value: Date | string): string {
  try {
    const d = typeof value === 'string' ? new Date(value) : value;
    return d.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

/**
 * MobileDashboardDetail
 *
 * Full-screen overlay showing activity or assessment detail. No Framer Motion.
 */
export default function MobileDashboardDetail({ item, onClose }: MobileDashboardDetailProps) {
  const isActivity = item.type === 'activity';
  const title = isActivity ? 'Activity detail' : 'Assessment detail';

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      <MobileDetailHeader title={title} onBack={onClose} />
      <main className="flex-1 min-h-0 overflow-auto p-4">
        {isActivity ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
              <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                Action
              </p>
              <p className="mt-1 text-base text-gray-900 dark:text-slate-100">
                {item.data.action}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
              <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                Date & time
              </p>
              <p className="mt-1 text-base text-gray-900 dark:text-slate-100">
                {formatDate(item.data.timestamp)}
              </p>
            </div>
            {item.data.assessmentId && (
              <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                  Assessment
                </p>
                <p className="mt-1 text-sm text-gray-700 dark:text-slate-300 font-mono">
                  {item.data.assessmentId}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
              <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                Date
              </p>
              <p className="mt-1 text-base text-gray-900 dark:text-slate-100">
                {formatDate(item.data.createdAt)}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
              <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                Score
              </p>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-slate-100">
                {Math.round(item.data.score)}%
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
              <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                Progress
              </p>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-slate-100">
                {Math.round(item.data.progress)}%
              </p>
            </div>
            <a
              href="/dashboard"
              className="block w-full text-center py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              View full dashboard
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
