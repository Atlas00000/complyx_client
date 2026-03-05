'use client';

import { lazy, Suspense, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { useAuthStore } from '@/stores/authStore';
import { usePageLoading } from '@/hooks/usePageLoading';
import { useDashboardData } from '@/hooks/useDashboardApi';
import { Header, Container } from '@/components/layout';
import { Button, EmptyState } from '@/components/ui';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner';
import { AssessmentDashboard } from '@/components/dashboard/AssessmentDashboard';
import { ReportExport } from '@/components/dashboard/ReportExport';

// Lazy load dashboard components
const ReadinessScore = lazy(() => import('@/components/dashboard/ReadinessScore').then(m => ({ default: m.ReadinessScore })));
const ProgressCharts = lazy(() => import('@/components/dashboard/ProgressCharts').then(m => ({ default: m.ProgressCharts })));
const CategoryBreakdown = lazy(() => import('@/components/dashboard/CategoryBreakdown').then(m => ({ default: m.CategoryBreakdown })));
const ComplianceMatrix = lazy(() => import('@/components/assessment/ComplianceMatrix').then(m => ({ default: m.ComplianceMatrix })));
const GapAnalysis = lazy(() => import('@/components/dashboard/GapAnalysis').then(m => ({ default: m.GapAnalysis })));

export default function DashboardPage() {
  const {
    assessmentId,
    ifrsStandard,
    answers,
    scores,
  } = useAssessmentStore();
  const { user } = useAuthStore();
  const userId = user?.id;

  const hasData = assessmentId && answers.length > 0;

  // Single shared fetch when logged in; children use this data when no local store data
  const { data: dashboardData } = useDashboardData(userId ?? undefined, assessmentId ?? undefined, {
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  // Prefer local store; fall back to shared dashboard payload so widgets don't refetch
  const effectiveScores = scores ?? dashboardData?.readinessScore;
  const hasServerData = !!dashboardData;

  // Map server historical trends to ProgressCharts history shape
  const progressHistory = useMemo(() => {
    const list = dashboardData?.historicalTrends?.assessments ?? [];
    return list.map((a) => ({
      date: new Date(a.createdAt).toISOString().split('T')[0],
      progress: a.progress ?? 0,
      answeredCount: 0,
    }));
  }, [dashboardData?.historicalTrends?.assessments]);
  
  // Memoize computed values to prevent unnecessary recalculations
  const mappedAnswers = useMemo(() => 
    answers.map(a => ({ questionId: a.questionId, value: a.value })),
    [answers]
  );
  
  // Page loading state - show for at least 1 second to ensure visibility
  const isPageLoading = usePageLoading({ minLoadingTime: 1000 });

  // Show loading screen during initial page load
  if (isPageLoading) {
    return <LoadingScreen text="Loading Dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header
        title="Dashboard"
        subtitle="IFRS S1 & S2 Compliance Overview"
        rightActions={
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => window.location.href = '/'}>
              Chat
            </Button>
          </div>
        }
      />

      <Container size="wide" className="py-8">
        <AssessmentDashboard showScores showProgress showCompliance>
          <div className="space-y-6">
            {/* Export Button */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-end"
            >
              <ReportExport />
            </motion.div>

            {/* Readiness Score – uses shared dashboard data when no local scores */}
            <Suspense fallback={<div className="flex items-center justify-center min-h-[300px]"><LoadingSpinner size="medium" /></div>}>
              <ReadinessScore 
                scores={effectiveScores} 
                showBreakdown 
                userId={userId}
                assessmentId={assessmentId || undefined}
                autoFetch={!effectiveScores}
              />
            </Suspense>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown – uses shared dashboard data when no local scores */}
              <Suspense fallback={<div className="flex items-center justify-center min-h-[300px]"><LoadingSpinner size="medium" /></div>}>
                <CategoryBreakdown 
                  scores={effectiveScores} 
                  viewMode="bar" 
                  showComparison 
                  userId={userId}
                  assessmentId={assessmentId || undefined}
                  autoFetch={!effectiveScores}
                />
              </Suspense>

              {/* Progress Charts – uses shared dashboard history when available */}
              <Suspense fallback={<div className="flex items-center justify-center min-h-[300px]"><LoadingSpinner size="medium" /></div>}>
                <ProgressCharts 
                  history={progressHistory.length > 0 ? progressHistory : undefined}
                  showAreaChart 
                  userId={userId}
                  assessmentId={assessmentId || undefined}
                  autoFetch={!hasServerData}
                />
              </Suspense>
            </div>

            {/* Compliance Matrix – useDashboardApi only when no local data */}
            {(hasData || userId) && ifrsStandard && (
              <Suspense fallback={<div className="flex items-center justify-center min-h-[300px]"><LoadingSpinner size="medium" /></div>}>
                <ComplianceMatrix
                  ifrsStandard={ifrsStandard}
                  answers={mappedAnswers}
                  userId={userId}
                  assessmentId={assessmentId || undefined}
                  useDashboardApi={!hasData && !!userId && !dashboardData?.complianceMatrix}
                  complianceMatrixFromDashboard={dashboardData?.complianceMatrix}
                />
              </Suspense>
            )}

            {/* Gap Analysis – show when local or server data; use shared payload when available */}
            {(hasData || hasServerData) && ifrsStandard && (
              <Suspense fallback={<div className="flex items-center justify-center min-h-[300px]"><LoadingSpinner size="medium" /></div>}>
                <GapAnalysis
                  gapAnalysis={dashboardData?.gapAnalysis}
                  ifrsStandard={ifrsStandard}
                  userId={userId}
                  assessmentId={assessmentId || undefined}
                  autoFetch={!dashboardData?.gapAnalysis}
                />
              </Suspense>
            )}

            {/* Empty State – when neither local assessment nor server dashboard data */}
            {!hasData && !hasServerData && (
              <EmptyState
                title="No Assessment Data"
                description="Start an assessment to view your dashboard and compliance status. Get insights into your IFRS S1 & S2 readiness."
                action={{
                  label: 'Start Assessment',
                  onClick: () => window.location.href = '/test-chat',
                }}
              />
            )}
          </div>
        </AssessmentDashboard>
      </Container>
    </div>
  );
}
