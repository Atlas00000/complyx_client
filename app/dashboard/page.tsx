'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { useAuthStore } from '@/stores/authStore';
import { Header, Container, Grid } from '@/components/layout';
import { Card, Button, EmptyState } from '@/components/ui';
import { AssessmentDashboard } from '@/components/dashboard/AssessmentDashboard';
import { ReadinessScore } from '@/components/dashboard/ReadinessScore';
import { ProgressCharts } from '@/components/dashboard/ProgressCharts';
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown';
import { ComplianceMatrix } from '@/components/assessment/ComplianceMatrix';
import { GapAnalysis } from '@/components/dashboard/GapAnalysis';
import { ReportExport } from '@/components/dashboard/ReportExport';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Dashboard"
        subtitle="IFRS S1 & S2 Compliance Overview"
        rightActions={
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => window.location.href = '/'}>
              Chat
            </Button>
            <Button variant="primary" onClick={() => window.location.href = '/test-chat'}>
              Start Assessment
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card variant="elevated" className="p-6">
                <ReadinessScore 
                  scores={scores} 
                  showBreakdown 
                  userId={userId}
                  assessmentId={assessmentId || undefined}
                  autoFetch={!scores}
                />
              </Card>
            </motion.div>

            {/* Two Column Layout */}
            <Grid
              cols={2}
              gap="large"
              responsive={{
                sm: 1,
                md: 1,
                lg: 2,
              }}
            >
              {/* Category Breakdown */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card variant="elevated" className="p-6 h-full">
                  <CategoryBreakdown 
                    scores={scores} 
                    viewMode="bar" 
                    showComparison 
                    userId={userId}
                    assessmentId={assessmentId || undefined}
                    autoFetch={!scores}
                  />
                </Card>
              </motion.div>

              {/* Progress Charts */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card variant="elevated" className="p-6 h-full">
                  <ProgressCharts 
                    showAreaChart 
                    userId={userId}
                    assessmentId={assessmentId || undefined}
                    autoFetch={true}
                  />
                </Card>
              </motion.div>
            </Grid>

            {/* Compliance Matrix */}
            {(hasData || userId) && ifrsStandard && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card variant="elevated" className="p-6">
                  <ComplianceMatrix
                    ifrsStandard={ifrsStandard}
                    answers={answers.map(a => ({ questionId: a.questionId, value: a.value }))}
                    userId={userId}
                    assessmentId={assessmentId || undefined}
                    useDashboardApi={!hasData && !!userId}
                  />
                </Card>
              </motion.div>
            )}

            {/* Gap Analysis */}
            {hasData && ifrsStandard && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card variant="elevated" className="p-6">
                  <GapAnalysis
                    ifrsStandard={ifrsStandard}
                    assessmentId={assessmentId || undefined}
                    autoFetch={true}
                  />
                </Card>
              </motion.div>
            )}

            {/* Empty State */}
            {!hasData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card variant="elevated" className="p-12">
                  <EmptyState
                    title="No Assessment Data"
                    description="Start an assessment to view your dashboard and compliance status. Get insights into your IFRS S1 & S2 readiness."
                    action={{
                      label: 'Start Assessment',
                      onClick: () => window.location.href = '/test-chat',
                    }}
                  />
                </Card>
              </motion.div>
            )}
          </div>
        </AssessmentDashboard>
      </Container>
    </div>
  );
}
