'use client';

import { useEffect, useState } from 'react';
import { ComplianceAPI, ComplianceMatrix as ComplianceMatrixType, RequirementStatus } from '@/lib/api/complianceApi';

interface ComplianceMatrixProps {
  ifrsStandard: 'S1' | 'S2';
  answers: Array<{ questionId: string; value: string }>;
  onRequirementClick?: (requirement: RequirementStatus) => void;
}

export function ComplianceMatrix({ ifrsStandard, answers, onRequirementClick }: ComplianceMatrixProps) {
  const [matrix, setMatrix] = useState<ComplianceMatrixType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMatrix = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ComplianceAPI.getComplianceMatrix(ifrsStandard, answers);
        setMatrix(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load compliance matrix');
      } finally {
        setLoading(false);
      }
    };

    if (answers.length > 0) {
      loadMatrix();
    }
  }, [ifrsStandard, answers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading compliance matrix...</div>
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

  if (!matrix) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="text-gray-600">No compliance data available</div>
      </div>
    );
  }

  const getStatusColor = (compliant: boolean, mandatory: boolean) => {
    if (compliant) return 'bg-green-100 border-green-500 text-green-800';
    if (mandatory) return 'bg-red-100 border-red-500 text-red-800';
    return 'bg-yellow-100 border-yellow-500 text-yellow-800';
  };

  const getStatusText = (requirement: RequirementStatus) => {
    if (requirement.compliant) return 'Compliant';
    if (requirement.mandatory) return 'Non-Compliant (Mandatory)';
    return 'Non-Compliant';
  };

  const categories = ['governance', 'strategy', 'risk', 'metrics'] as const;

  return (
    <div className="space-y-6">
      {/* Overall Compliance */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Overall Compliance - IFRS {ifrsStandard}</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Compliance Score</span>
              <span className="font-semibold">{matrix.overallCompliance.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  matrix.overallCompliance >= 70
                    ? 'bg-green-500'
                    : matrix.overallCompliance >= 40
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${matrix.overallCompliance}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {matrix.categoryBreakdown && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const breakdown = matrix.categoryBreakdown[category];
            if (!breakdown) return null;
            
            return (
              <div key={category} className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 capitalize">{category}</h4>
                <div className="text-2xl font-bold text-gray-900 mb-1">{breakdown.score.toFixed(0)}%</div>
                <div className="text-xs text-gray-500">
                  {breakdown.compliant} / {breakdown.total} compliant
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Requirements List */}
      {matrix.requirementStatuses && matrix.requirementStatuses.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Requirement Status</h3>
          <div className="space-y-3">
            {matrix.requirementStatuses.map((requirement) => (
            <div
              key={requirement.requirementId}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                onRequirementClick ? 'hover:bg-gray-50' : ''
              } ${getStatusColor(requirement.compliant, requirement.mandatory)}`}
              onClick={() => onRequirementClick?.(requirement)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{requirement.code}</span>
                    {requirement.mandatory && (
                      <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded">Mandatory</span>
                    )}
                  </div>
                  <div className="text-sm font-medium mb-2">{requirement.title}</div>
                  <div className="text-xs text-gray-600">
                    {getStatusText(requirement)} • {requirement.score.toFixed(0)}% •{' '}
                    {requirement.answeredQuestions}/{requirement.totalQuestions} questions answered
                  </div>
                </div>
                <div className="ml-4">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        requirement.compliant ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${requirement.score}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
