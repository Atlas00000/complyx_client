'use client';

import { useEffect, useState } from 'react';
import { ComplianceAPI, ComplianceMatrix as ComplianceMatrixType, RequirementStatus } from '@/lib/api/complianceApi';
import { DashboardAPI } from '@/lib/api/dashboardApi';
import Skeleton, { SkeletonText } from '@/components/ui/Loading';
import ComplianceMatrixContainer from './ComplianceMatrixContainer';
import ComplianceMatrixHeader from './ComplianceMatrixHeader';
import CategoryBreakdownCards from './CategoryBreakdownCards';
import ComplianceMatrixGrid from './ComplianceMatrixGrid';

interface ComplianceMatrixProps {
  ifrsStandard: 'S1' | 'S2';
  answers?: Array<{ questionId: string; value: string }>;
  onRequirementClick?: (requirement: RequirementStatus) => void;
  userId?: string;
  assessmentId?: string;
  useDashboardApi?: boolean;
}

export function ComplianceMatrix({ 
  ifrsStandard, 
  answers = [], 
  onRequirementClick,
  userId,
  assessmentId,
  useDashboardApi = false,
}: ComplianceMatrixProps) {
  const [matrix, setMatrix] = useState<ComplianceMatrixType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMatrix = async () => {
      try {
        setLoading(true);
        setError(null);

        if (useDashboardApi && (userId || assessmentId)) {
          const data = await DashboardAPI.getComplianceMatrix({ userId, assessmentId, ifrsStandard });
          const convertedMatrix: ComplianceMatrixType = {
            ifrsStandard: data.ifrsStandard,
            overallCompliance: data.overallCompliance,
            requirementStatuses: data.requirements.map((req) => ({
              requirementId: req.requirementId,
              code: req.code,
              title: req.title,
              category: req.category as 'governance' | 'strategy' | 'risk' | 'metrics',
              compliant: req.compliant,
              score: req.score,
              answeredQuestions: req.answeredQuestions,
              totalQuestions: req.totalQuestions,
              level: (req.level === 'core' ? 'foundational' : req.level) as 'foundational' | 'enhanced' | 'disclosure',
              mandatory: req.mandatory,
            })),
            categoryBreakdown: {
              governance: data.byCategory.governance,
              strategy: data.byCategory.strategy,
              risk: data.byCategory.risk,
              metrics: data.byCategory.metrics,
            },
          };
          setMatrix(convertedMatrix);
        } else if (answers.length > 0) {
          const data = await ComplianceAPI.getComplianceMatrix(ifrsStandard, answers);
          setMatrix(data);
        } else {
          setMatrix(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load compliance matrix');
      } finally {
        setLoading(false);
      }
    };

    loadMatrix();
  }, [ifrsStandard, answers, userId, assessmentId, useDashboardApi]);

  if (loading) {
    return (
      <ComplianceMatrixContainer>
        <div className="flex items-center justify-center h-64">
          <div className="space-y-4">
            <Skeleton width={300} height={200} rounded="lg" />
            <SkeletonText lines={2} />
          </div>
        </div>
      </ComplianceMatrixContainer>
    );
  }

  if (error) {
    return (
      <ComplianceMatrixContainer>
        <div className="flex items-center justify-center h-64 text-error">
          <div className="text-center">
            <p className="font-semibold text-lg">Error loading compliance matrix</p>
            <p className="text-sm mt-2 text-gray-600 dark:text-slate-400">{error}</p>
          </div>
        </div>
      </ComplianceMatrixContainer>
    );
  }

  if (!matrix) {
    return (
      <ComplianceMatrixContainer>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-slate-400">
          <p className="text-lg">No compliance data available</p>
        </div>
      </ComplianceMatrixContainer>
    );
  }

  return (
    <ComplianceMatrixContainer>
      <div className="space-y-8">
        {/* Header with Overall Compliance */}
        <ComplianceMatrixHeader 
          ifrsStandard={ifrsStandard}
          overallCompliance={matrix.overallCompliance}
        />

        {/* Category Breakdown Cards */}
        {matrix.categoryBreakdown && (
          <CategoryBreakdownCards categoryBreakdown={matrix.categoryBreakdown} />
        )}

        {/* Requirements Grid */}
        {matrix.requirementStatuses && Array.isArray(matrix.requirementStatuses) && matrix.requirementStatuses.length > 0 && (
          <ComplianceMatrixGrid 
            requirements={matrix.requirementStatuses}
            onRequirementClick={onRequirementClick}
          />
        )}
      </div>
    </ComplianceMatrixContainer>
  );
}
