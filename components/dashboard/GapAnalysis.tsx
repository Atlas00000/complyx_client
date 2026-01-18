'use client';

import { useState, useEffect } from 'react';
import { DashboardAPI, GapAnalysis as GapAnalysisType } from '@/lib/api/dashboardApi';

interface GapAnalysisProps {
  gapAnalysis?: GapAnalysisType | null;
  userId?: string;
  assessmentId?: string;
  ifrsStandard?: 'S1' | 'S2';
  autoFetch?: boolean;
  onGapClick?: (gap: GapAnalysisType['criticalGaps'][0]) => void;
}

export function GapAnalysis({
  gapAnalysis: propGapAnalysis,
  userId,
  assessmentId,
  ifrsStandard,
  autoFetch = false,
  onGapClick,
}: GapAnalysisProps) {
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysisType | null>(propGapAnalysis || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (autoFetch && !propGapAnalysis && (userId || assessmentId)) {
      setLoading(true);
      setError(null);
      DashboardAPI.getGapAnalysis({ userId, assessmentId, ifrsStandard })
        .then((data) => {
          setGapAnalysis(data);
        })
        .catch((err) => {
          console.error('Failed to fetch gap analysis:', err);
          setError(err instanceof Error ? err.message : 'Failed to load gap analysis');
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (propGapAnalysis) {
      setGapAnalysis(propGapAnalysis);
    }
  }, [autoFetch, propGapAnalysis, userId, assessmentId, ifrsStandard]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading gap analysis...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-red-800">Error: {error}</div>
      </div>
    );
  }

  if (!gapAnalysis) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="text-gray-600">No gap analysis data available</div>
      </div>
    );
  }

  const getSeverityColor = (severity: 'critical' | 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'low':
        return 'bg-blue-100 border-blue-500 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getSeverityBadgeColor = (severity: 'critical' | 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'critical':
        return 'bg-red-200 text-red-800';
      case 'high':
        return 'bg-orange-200 text-orange-800';
      case 'medium':
        return 'bg-yellow-200 text-yellow-800';
      case 'low':
        return 'bg-blue-200 text-blue-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const allGaps = [
    ...gapAnalysis.criticalGaps,
    ...gapAnalysis.highGaps,
    ...gapAnalysis.mediumGaps,
    ...gapAnalysis.lowGaps,
  ];

  return (
    <div className="space-y-6">
      {/* Overall Gap Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gap Analysis - IFRS {gapAnalysis.ifrsStandard}</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Overall Gap</span>
              <span className="font-semibold">{gapAnalysis.overallGap.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  gapAnalysis.overallGap >= 50
                    ? 'bg-red-500'
                    : gapAnalysis.overallGap >= 30
                    ? 'bg-orange-500'
                    : gapAnalysis.overallGap >= 10
                    ? 'bg-yellow-500'
                    : 'bg-blue-500'
                }`}
                style={{ width: `${gapAnalysis.overallGap}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {gapAnalysis.overallGap >= 50
                ? 'Critical gaps detected - Immediate action required'
                : gapAnalysis.overallGap >= 30
                ? 'Significant gaps identified - Priority action needed'
                : gapAnalysis.overallGap >= 10
                ? 'Moderate gaps found - Improvement recommended'
                : 'Minor gaps - On track for compliance'}
            </div>
          </div>
        </div>
      </div>

      {/* Gap Summary by Severity */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-red-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-red-800">Critical</h4>
            <span className={`text-xs px-2 py-1 rounded ${getSeverityBadgeColor('critical')}`}>
              {gapAnalysis.criticalGaps.length}
            </span>
          </div>
          <div className="text-2xl font-bold text-red-900">{gapAnalysis.criticalGaps.length}</div>
          <div className="text-xs text-red-600 mt-1">gaps</div>
        </div>
        <div className="bg-white rounded-lg border border-orange-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-orange-800">High</h4>
            <span className={`text-xs px-2 py-1 rounded ${getSeverityBadgeColor('high')}`}>
              {gapAnalysis.highGaps.length}
            </span>
          </div>
          <div className="text-2xl font-bold text-orange-900">{gapAnalysis.highGaps.length}</div>
          <div className="text-xs text-orange-600 mt-1">gaps</div>
        </div>
        <div className="bg-white rounded-lg border border-yellow-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-yellow-800">Medium</h4>
            <span className={`text-xs px-2 py-1 rounded ${getSeverityBadgeColor('medium')}`}>
              {gapAnalysis.mediumGaps.length}
            </span>
          </div>
          <div className="text-2xl font-bold text-yellow-900">{gapAnalysis.mediumGaps.length}</div>
          <div className="text-xs text-yellow-600 mt-1">gaps</div>
        </div>
        <div className="bg-white rounded-lg border border-blue-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-blue-800">Low</h4>
            <span className={`text-xs px-2 py-1 rounded ${getSeverityBadgeColor('low')}`}>
              {gapAnalysis.lowGaps.length}
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{gapAnalysis.lowGaps.length}</div>
          <div className="text-xs text-blue-600 mt-1">gaps</div>
        </div>
      </div>

      {/* Priority Actions */}
      {gapAnalysis.priorityActions && gapAnalysis.priorityActions.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Priority Actions</h4>
          <ul className="space-y-2">
            {gapAnalysis.priorityActions.map((action, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-primary mt-1">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Critical Gaps List */}
      {gapAnalysis.criticalGaps.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Critical Gaps</h4>
          <div className="space-y-3">
            {gapAnalysis.criticalGaps.map((gap) => (
              <div
                key={gap.requirementId}
                className={`p-4 border-2 rounded-lg ${
                  onGapClick ? 'cursor-pointer hover:bg-gray-50' : ''
                } ${getSeverityColor(gap.severity)}`}
                onClick={() => onGapClick?.(gap)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{gap.code}</span>
                      {gap.mandatory && (
                        <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded">
                          Mandatory
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded ${getSeverityBadgeColor(gap.severity)}`}>
                        {gap.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm font-medium mb-2">{gap.title}</div>
                    <div className="text-xs text-gray-600 mb-2">
                      Gap: {gap.gap.toFixed(0)}% • Score: {gap.score.toFixed(0)}% •{' '}
                      {gap.answeredQuestions}/{gap.totalQuestions} questions answered
                    </div>
                    {gap.recommendations && gap.recommendations.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs font-semibold text-gray-700 mb-1">Recommendations:</div>
                        <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                          {gap.recommendations.slice(0, 2).map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          gap.severity === 'critical' ? 'bg-red-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${gap.gap}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* High Priority Gaps */}
      {gapAnalysis.highGaps.length > 0 && gapAnalysis.criticalGaps.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">High Priority Gaps</h4>
          <div className="space-y-3">
            {gapAnalysis.highGaps.slice(0, 5).map((gap: any) => (
              <div
                key={gap.requirementId}
                className={`p-4 border-2 rounded-lg ${
                  onGapClick ? 'cursor-pointer hover:bg-gray-50' : ''
                } ${getSeverityColor(gap.severity)}`}
                onClick={() => onGapClick?.(gap)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{gap.code}</span>
                      {gap.mandatory && (
                        <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-medium mb-1">{gap.title}</div>
                    <div className="text-xs text-gray-600">
                      Gap: {gap.gap.toFixed(0)}% • Score: {gap.score.toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {allGaps.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-green-800 font-semibold mb-2">✓ No Gaps Identified</div>
          <div className="text-sm text-green-600">
            Your assessment shows full compliance with IFRS {gapAnalysis.ifrsStandard} requirements.
          </div>
        </div>
      )}
    </div>
  );
}
