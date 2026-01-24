'use client';

import { useAssessmentStore } from '@/stores/assessmentStore';
import { ReportData, ReportOptions } from '@/lib/reports/pdfGenerator';

interface ReportTemplateProps {
  data?: Partial<ReportData>;
  options?: ReportOptions;
  showTitle?: boolean;
}

export function ReportTemplate({ data: propData, options, showTitle = true }: ReportTemplateProps) {
  const {
    assessmentId,
    ifrsStandard,
    currentPhase,
    status,
    progress,
    answeredCount,
    totalCount,
    scores,
    answers,
  } = useAssessmentStore();

  const data: ReportData = {
    assessmentId: propData?.assessmentId || assessmentId || 'N/A',
    ifrsStandard: propData?.ifrsStandard || ifrsStandard || 'S1',
    phase: propData?.phase || currentPhase || 'quick',
    status: propData?.status || status || 'in_progress',
    progress: propData?.progress ?? progress,
    answeredCount: propData?.answeredCount ?? answeredCount,
    totalCount: propData?.totalCount ?? totalCount,
    scores: propData?.scores || scores,
    answers: propData?.answers || answers,
    generatedAt: propData?.generatedAt || new Date(),
    organizationName: propData?.organizationName || options?.organizationName || 'Organization',
  };

  const opts: Required<ReportOptions> = {
    includeSummary: options?.includeSummary !== false,
    includeScores: options?.includeScores !== false,
    includeAnswers: options?.includeAnswers !== false,
    includeCharts: options?.includeCharts !== false,
    organizationName: options?.organizationName || data.organizationName || 'Organization',
  };

  const formatPhase = (phase: string | null) => {
    switch (phase) {
      case 'quick':
        return 'Quick Assessment';
      case 'detailed':
        return 'Detailed Assessment';
      case 'followup':
        return 'Follow-up Assessment';
      default:
        return 'N/A';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white p-8 space-y-8 max-w-4xl mx-auto">
      {/* Cover Page */}
      <div className="border-b-2 border-gray-300 pb-8 mb-8">
        {showTitle && (
          <>
            <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">IFRS S1 & S2</h1>
            <h2 className="text-3xl font-semibold text-gray-700 text-center mb-8">Readiness Assessment Report</h2>
          </>
        )}
        <div className="text-center text-gray-600 mb-8">{opts.organizationName}</div>
        
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div>
            <div className="text-sm text-gray-600 mb-1">Assessment ID</div>
            <div className="font-semibold text-gray-900">{data.assessmentId}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">IFRS Standard</div>
            <div className="font-semibold text-gray-900">IFRS {data.ifrsStandard}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Phase</div>
            <div className="font-semibold text-gray-900">{formatPhase(data.phase)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Status</div>
            <div className="font-semibold text-gray-900">{formatStatus(data.status)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Progress</div>
            <div className="font-semibold text-gray-900">{data.progress.toFixed(0)}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Generated</div>
            <div className="font-semibold text-gray-900">{data.generatedAt.toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      {opts.includeSummary && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2">Executive Summary</h2>
          <div className="text-gray-700 space-y-2">
            <p>
              This assessment evaluates readiness for IFRS {data.ifrsStandard} compliance.
              The assessment was conducted in {formatPhase(data.phase)} phase, covering key areas
              of governance, strategy, risk management, and metrics/targets.
            </p>
            <p>
              <strong>Overall Progress:</strong> {data.progress.toFixed(0)}% ({data.answeredCount} of {data.totalCount} questions answered)
            </p>
          </div>
        </section>
      )}

      {/* Assessment Scores */}
      {opts.includeScores && data.scores && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2">Assessment Scores</h2>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-lg font-semibold text-gray-700">Overall Readiness Score:</span>
              <span className={`text-4xl font-bold ${getScoreColor(data.scores.overallScore)}`}>
                {data.scores.overallScore.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${
                  data.scores.overallScore >= 70
                    ? 'bg-green-500'
                    : data.scores.overallScore >= 40
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${data.scores.overallScore}%` }}
              />
            </div>
          </div>

          {data.scores.categoryScores && data.scores.categoryScores.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Category Breakdown</h3>
              <div className="grid grid-cols-2 gap-4">
                {data.scores.categoryScores.map((category, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-700 capitalize">{category.category}</span>
                      <span className={`text-xl font-bold ${getScoreColor(category.percentage)}`}>
                        {category.percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          category.percentage >= 70
                            ? 'bg-green-500'
                            : category.percentage >= 40
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Assessment Answers */}
      {opts.includeAnswers && data.answers.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2">Assessment Answers</h2>
          <div className="space-y-6">
            {data.answers.map((answer, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-600 mb-1">
                      Question ID: {answer.questionId}
                    </div>
                    <div className="text-gray-800">{answer.value}</div>
                    {answer.timestamp && (
                      <div className="text-xs text-gray-500 mt-2">
                        Answered: {typeof answer.timestamp === 'string' ? new Date(answer.timestamp).toLocaleString() : answer.timestamp.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t-2 border-gray-300 pt-4 mt-8 text-center text-sm text-gray-500">
        <p>Generated by Complyx - IFRS S1 & S2 Readiness Assessment</p>
        <p>{data.generatedAt.toLocaleDateString()} {data.generatedAt.toLocaleTimeString()}</p>
      </footer>
    </div>
  );
}
