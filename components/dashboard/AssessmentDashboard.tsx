'use client';

import { useAssessmentStore } from '@/stores/assessmentStore';

interface AssessmentDashboardProps {
  children?: React.ReactNode;
  showScores?: boolean;
  showProgress?: boolean;
  showCompliance?: boolean;
}

export function AssessmentDashboard({
  children,
  showScores = true,
  showProgress = true,
  showCompliance = true,
}: AssessmentDashboardProps) {
  const {
    assessmentId,
    ifrsStandard,
    currentPhase,
    status,
    progress,
    answeredCount,
    totalCount,
    scores,
  } = useAssessmentStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-500';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-500';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-500';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-500';
    }
  };

  const getPhaseLabel = (phase: string | null) => {
    switch (phase) {
      case 'quick':
        return 'Quick Assessment';
      case 'detailed':
        return 'Detailed Assessment';
      case 'followup':
        return 'Follow-up Assessment';
      default:
        return 'No Assessment';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">Assessment Dashboard</h1>
              {ifrsStandard && (
                <p className="text-gray-600 dark:text-slate-400">IFRS {ifrsStandard} • {getPhaseLabel(currentPhase)}</p>
              )}
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                {assessmentId && (
                  <div className="text-sm text-gray-500 dark:text-slate-400">
                    ID: <span className="font-mono">{assessmentId.substring(0, 8)}...</span>
                  </div>
                )}
                {status && (
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(status)}`}>
                    {status.replace('_', ' ').toUpperCase()}
                  </div>
                )}
              </div>
              {children && <div>{/* Export buttons will be passed via children */}</div>}
            </div>
          </div>
        </div>

        {/* Progress Section */}
        {showProgress && (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Progress</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-slate-400 mb-2">
                <span>Assessment Progress</span>
                <span className="font-semibold text-gray-900 dark:text-slate-100">{progress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all ${
                    progress >= 70
                      ? 'bg-green-500'
                      : progress >= 40
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
                <span>{answeredCount} questions answered</span>
                <span>{totalCount} total questions</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Scores Section - Takes full width if only scores shown */}
          {showScores && (
            <div className={`${!showCompliance && !children ? 'lg:col-span-2 xl:col-span-3' : 'lg:col-span-2 xl:col-span-2'}`}>
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 shadow-sm h-full">
                {scores ? (
                  <>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Readiness Scores</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Overall Score</span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-slate-100">{scores.overallScore.toFixed(0)}%</span>
                      </div>
                      {scores.categoryScores && scores.categoryScores.length > 0 && (
                        <div className="grid grid-cols-2 gap-4">
                          {scores.categoryScores.map((category, index) => (
                            <div key={index} className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                              <div className="text-xs text-gray-600 dark:text-slate-400 mb-1 capitalize">{category.category}</div>
                              <div className="text-xl font-bold text-gray-900 dark:text-slate-100">{category.percentage.toFixed(0)}%</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-500 dark:text-slate-400">
                    No scores available yet
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Custom Content */}
          {children && (
            <div className={showCompliance ? 'lg:col-span-1' : 'lg:col-span-2 xl:col-span-1'}>
              {children}
            </div>
          )}

          {/* Compliance Matrix Section */}
          {showCompliance && (
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Compliance Status</h2>
                <div className="text-sm text-gray-500 dark:text-slate-400">
                  Compliance matrix will be displayed here
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for progress charts */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Progress Over Time</h2>
              <div className="text-sm text-gray-500 dark:text-slate-400">
                Progress charts will be displayed here
              </div>
            </div>
          </div>

          {/* Placeholder for category breakdown */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Category Breakdown</h2>
              <div className="text-sm text-gray-500 dark:text-slate-400">
                Category breakdown charts will be displayed here
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
