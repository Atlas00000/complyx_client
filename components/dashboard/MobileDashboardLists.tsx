'use client';

import { useAuthStore } from '@/stores/authStore';
import { useDashboardData } from '@/hooks/useDashboardApi';
import MobileListItem from './MobileListItem';

const MAX_ACTIVITY = 5;
const MAX_ASSESSMENTS = 5;

function formatDate(value: Date | string): string {
  try {
    const d = typeof value === 'string' ? new Date(value) : value;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}

export interface ActivityListItem {
  id: string;
  action: string;
  timestamp: Date | string;
  assessmentId?: string;
}

export interface AssessmentListItem {
  id: string;
  createdAt: Date | string;
  score: number;
  progress: number;
}

interface MobileDashboardListsProps {
  onActivityClick?: (item: ActivityListItem) => void;
  onAssessmentClick?: (item: AssessmentListItem) => void;
}

/**
 * MobileDashboardLists
 *
 * Recent activity and recent assessments lists for mobile dashboard.
 * Optional drill-down callbacks. No Framer Motion.
 */
export default function MobileDashboardLists({
  onActivityClick,
  onAssessmentClick,
}: MobileDashboardListsProps = {}) {
  const { user } = useAuthStore();
  const userId = user?.id;
  const { data: dashboardData, isLoading } = useDashboardData(
    userId ?? undefined,
    undefined,
    { enabled: !!userId, staleTime: 5 * 60 * 1000 }
  );

  if (!userId) {
    return null;
  }

  const recentActivity = dashboardData?.recentActivity ?? [];
  const assessments = dashboardData?.historicalTrends?.assessments ?? [];
  const activitySlice = recentActivity.slice(0, MAX_ACTIVITY);
  const assessmentsSlice = assessments.slice(0, MAX_ASSESSMENTS);
  const hasActivity = activitySlice.length > 0;
  const hasAssessments = assessmentsSlice.length > 0;

  if (isLoading) {
    return (
      <div className="px-4 pb-4">
        <div className="h-6 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
        <div className="rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="h-[44px] bg-gray-100 dark:bg-slate-800/50 animate-pulse" />
          <div className="h-[44px] bg-gray-100 dark:bg-slate-800/50 animate-pulse" />
          <div className="h-[44px] bg-gray-100 dark:bg-slate-800/50 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!hasActivity && !hasAssessments) {
    return null;
  }

  const chevron = (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <div className="px-4 pb-6 space-y-4">
      {hasActivity && (
        <section>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1 px-1">
            Recent activity
          </h2>
          <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
            {activitySlice.map((item) => (
              <MobileListItem
                key={item.id}
                title={item.action}
                subtitle={formatDate(item.timestamp)}
                right={chevron}
                onClick={onActivityClick ? () => onActivityClick(item) : undefined}
              />
            ))}
          </div>
        </section>
      )}
      {hasAssessments && (
        <section>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1 px-1">
            Recent assessments
          </h2>
          <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
            {assessmentsSlice.map((a) => (
              <MobileListItem
                key={a.id}
                title={`Score ${Math.round(a.score ?? 0)}% · ${Math.round(a.progress ?? 0)}% complete`}
                subtitle={formatDate(a.createdAt)}
                right={chevron}
                onClick={onAssessmentClick ? () => onAssessmentClick(a) : undefined}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
