'use client';

import { lazy, Suspense, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { useAuthStore } from '@/stores/authStore';
import { usePageLoading } from '@/hooks/usePageLoading';
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

            {/* Readiness Score */}
            <Suspense fallback={<div className="flex items-center justify-center min-h-[300px]"><LoadingSpinner size="medium" /></div>}>
              <ReadinessScore 
                scores={scores} 
                showBreakdown 
                userId={userId}
                assessmentId={assessmentId || undefined}
                autoFetch={!scores}
              />
            </Suspense>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <Suspense fallback={<div className="flex items-center justify-center min-h-[300px]"><LoadingSpinner size="medium" /></div>}>
                <CategoryBreakdown 
                  scores={scores} 
                  viewMode="bar" 
                  showComparison 
                  userId={userId}
                  assessmentId={assessmentId || undefined}
                  autoFetch={!scores}
                />
              </Suspense>

              {/* Progress Charts */}
              <Suspense fallback={<div className="flex items-center justify-center min-h-[300px]"><LoadingSpinner size="medium" /></div>}>
                <ProgressCharts 
                  showAreaChart 
                  userId={userId}
                  assessmentId={assessmentId || undefined}
                  autoFetch={true}
                />
              </Suspense>
            </div>

            {/* Compliance Matrix */}
            {(hasData || userId) && ifrsStandard && (
              <Suspense fallback={<div className="flex items-center justify-center min-h-[300px]"><LoadingSpinner size="medium" /></div>}>
                <ComplianceMatrix
                  ifrsStandard={ifrsStandard}
                  answers={mappedAnswers}
                  userId={userId}
                  assessmentId={assessmentId || undefined}
                  useDashboardApi={!hasData && !!userId}
                />
              </Suspense>
            )}

            {/* Gap Analysis */}
            {hasData && ifrsStandard && (
              <Suspense fallback={<div className="flex items-center justify-center min-h-[300px]"><LoadingSpinner size="medium" /></div>}>
                <GapAnalysis
                  ifrsStandard={ifrsStandard}
                  assessmentId={assessmentId || undefined}
                  autoFetch={true}
                />
              </Suspense>
            )}

            {/* Empty State */}
            {!hasData && (
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
