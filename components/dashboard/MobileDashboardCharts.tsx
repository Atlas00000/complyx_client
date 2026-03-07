'use client';

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useAuthStore } from '@/stores/authStore';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { useDashboardData } from '@/hooks/useDashboardApi';
import MobileChartCard from './MobileChartCard';

const CHART_HEIGHT = 200;

function formatChartDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

/**
 * MobileDashboardCharts
 *
 * Simplified progress and category charts for mobile. Uses Recharts, no Framer Motion.
 */
export default function MobileDashboardCharts() {
  const { user } = useAuthStore();
  const userId = user?.id;
  const { scores: storeScores, assessmentId } = useAssessmentStore();
  const { data: dashboardData, isLoading } = useDashboardData(
    userId ?? undefined,
    assessmentId ?? undefined,
    { enabled: !!userId, staleTime: 5 * 60 * 1000 }
  );

  const scores = storeScores ?? dashboardData?.readinessScore;
  const history = dashboardData?.historicalTrends?.assessments ?? [];
  const progressData = history.map((a) => ({
    date: typeof a.createdAt === 'string' ? a.createdAt.split('T')[0] : new Date(a.createdAt).toISOString().split('T')[0],
    progress: Math.round(a.progress ?? 0),
  }));
  const categoryData =
    scores?.categoryScores?.map((c) => ({
      name: c.category,
      score: Math.round(c.percentage ?? 0),
    })) ?? [];

  if (!userId) return null;

  if (isLoading) {
    return (
      <div className="px-4 pb-6 space-y-4">
        <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
          <div className="h-10 bg-gray-100 dark:bg-slate-700/50 animate-pulse" />
          <div className="h-[200px] bg-gray-50 dark:bg-slate-800/50 animate-pulse" />
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
          <div className="h-10 bg-gray-100 dark:bg-slate-700/50 animate-pulse" />
          <div className="h-[200px] bg-gray-50 dark:bg-slate-800/50 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-6 space-y-4">
      <MobileChartCard title="Progress over time" viewFullHref="/dashboard">
        {progressData.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-slate-400">No progress data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
            <AreaChart data={progressData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="mobileProgressGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary, #14B8A6)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-primary, #14B8A6)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={formatChartDate}
                stroke="#9CA3AF"
                fontSize={10}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                stroke="#9CA3AF"
                fontSize={10}
                width={28}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: number | undefined) => [value != null ? `${value}%` : '—', 'Progress']}
                labelFormatter={formatChartDate}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: '1px solid var(--tw-border-opacity, 1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="progress"
                stroke="var(--color-primary, #14B8A6)"
                strokeWidth={2}
                fill="url(#mobileProgressGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </MobileChartCard>

      <MobileChartCard title="Category breakdown" viewFullHref="/dashboard">
        {categoryData.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-slate-400">No category data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
            <BarChart
              data={categoryData}
              layout="vertical"
              margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
            >
              <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} fontSize={10} stroke="#9CA3AF" />
              <YAxis type="category" dataKey="name" fontSize={10} stroke="#9CA3AF" width={72} tickLine={false} />
              <Tooltip
                formatter={(value: number | undefined) => [value != null ? `${value}%` : '—', 'Score']}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="score" fill="var(--color-primary, #14B8A6)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </MobileChartCard>
    </div>
  );
}
