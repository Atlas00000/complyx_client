'use client';

import { useAuthStore } from '@/stores/authStore';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { useDashboardData } from '@/hooks/useDashboardApi';
import MobileStatCard from './MobileStatCard';

/**
 * MobileDashboardStats
 *
 * Summary stat cards for mobile dashboard. Uses store + dashboard API.
 * No Framer Motion. Shows empty state when not logged in or no data.
 */
export default function MobileDashboardStats() {
  const { user } = useAuthStore();
  const userId = user?.id;
  const { scores: storeScores, assessmentId } = useAssessmentStore();
  const { data: dashboardData, isLoading } = useDashboardData(
    userId ?? undefined,
    assessmentId ?? undefined,
    { enabled: !!userId, staleTime: 5 * 60 * 1000 }
  );

  const scores = storeScores ?? dashboardData?.readinessScore;
  const hasData = !!scores;

  if (!userId) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-slate-400 text-sm">
        Sign in to see your dashboard stats.
      </div>
    );
  }

  if (isLoading && !hasData) {
    return (
      <div className="p-4 space-y-3">
        <div className="h-[72px] rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-[72px] rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-[72px] rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500 dark:text-slate-400 text-sm mb-3">
          No assessment data yet. Start an assessment to see your readiness score and progress.
        </p>
        <a
          href="/test-chat"
          className="inline-block min-h-[44px] px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Start assessment
        </a>
      </div>
    );
  }

  const overallPct = scores.overallPercentage ?? 0;
  const answered = scores.totalAnswered ?? 0;
  const total = scores.totalQuestions ?? 0;
  const categoryCount = scores.categoryScores?.length ?? 0;

  return (
    <div className="p-4 space-y-3">
      <MobileStatCard
        label="Readiness score"
        value={`${Math.round(overallPct)}%`}
        subtitle="IFRS S1 & S2"
      />
      <MobileStatCard
        label="Questions answered"
        value={total > 0 ? `${answered} / ${total}` : '—'}
        subtitle={categoryCount > 0 ? `${categoryCount} categories` : undefined}
      />
      <MobileStatCard
        label="Progress"
        value={total > 0 ? `${Math.round((answered / total) * 100)}%` : '0%'}
        subtitle="Assessment completion"
      />
    </div>
  );
}
