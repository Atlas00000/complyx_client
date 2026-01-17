'use client';

import { useEffect } from 'react';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { AssessmentDashboard } from '@/components/dashboard/AssessmentDashboard';
import { ReadinessScore } from '@/components/dashboard/ReadinessScore';
import { ProgressCharts } from '@/components/dashboard/ProgressCharts';
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown';
import { ComplianceMatrix } from '@/components/assessment/ComplianceMatrix';
import { ReportExport } from '@/components/dashboard/ReportExport';

export default function DashboardPage() {
  const {
    assessmentId,
    ifrsStandard,
    currentPhase,
    answers,
    scores,
    progress,
    answeredCount,
    totalCount,
  } = useAssessmentStore();

  // Redirect to test-chat if no assessment started
  useEffect(() => {
    if (!assessmentId && typeof window !== 'undefined') {
      // Allow viewing dashboard even without assessment for preview
      // Could redirect to test-chat if preferred
    }
  }, [assessmentId]);

  const hasData = assessmentId && answers.length > 0;

  return (
    <AssessmentDashboard showScores showProgress showCompliance>
      <ReportExport />
      <div className="space-y-6">
        {/* Readiness Score */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <ReadinessScore scores={scores} showBreakdown />
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <CategoryBreakdown scores={scores} viewMode="bar" showComparison />
        </div>

        {/* Progress Charts */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <ProgressCharts showAreaChart />
        </div>

        {/* Compliance Matrix */}
        {hasData && ifrsStandard && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <ComplianceMatrix
              ifrsStandard={ifrsStandard}
              answers={answers.map(a => ({ questionId: a.questionId, value: a.value }))}
            />
          </div>
        )}

        {/* Empty State */}
        {!hasData && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 shadow-sm text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Assessment Data</h3>
            <p className="text-gray-600 mb-6">
              Start an assessment to view your dashboard and compliance status.
            </p>
            <a
              href="/test-chat"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Start Assessment
            </a>
          </div>
        )}
      </div>
    </AssessmentDashboard>
  );
}
