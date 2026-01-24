'use client';

import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useAssessmentStore, AssessmentScore } from '@/stores/assessmentStore';
import { parseError, ErrorInfo } from '@/lib/utils/errorHandler';
import { useReadinessScore } from '@/hooks/useDashboardApi';
import Skeleton, { SkeletonText } from '@/components/ui/Loading';
import { Button } from '@/components/ui';
import CategoryBreakdownContainer from './CategoryBreakdownContainer';
import CategoryBreakdownHeader from './CategoryBreakdownHeader';
import EnhancedCategoryBars from './EnhancedCategoryBars';

interface CategoryBreakdownProps {
  scores?: AssessmentScore | null;
  showComparison?: boolean;
  viewMode?: 'bar' | 'radar';
  userId?: string;
  assessmentId?: string;
  autoFetch?: boolean;
}

function CategoryBreakdownComponent({ 
  scores: propScores, 
  showComparison: _showComparison = true, 
  viewMode: _viewMode = 'bar',
  userId,
  assessmentId,
  autoFetch = false,
}: CategoryBreakdownProps) {
  const { scores: storeScores, setScores } = useAssessmentStore();
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);

  // Use React Query for API calls with automatic caching
  const {
    data: apiScores,
    isLoading: loading,
    error: queryError,
    refetch,
  } = useReadinessScore(
    userId,
    assessmentId,
    {
      enabled: autoFetch && !propScores && !storeScores,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Sync React Query data to store when it changes
  useEffect(() => {
    if (apiScores && autoFetch) {
      setScores(apiScores);
    }
  }, [apiScores, autoFetch, setScores]);

  // Parse and handle errors from React Query
  useEffect(() => {
    if (queryError) {
      const parsedError = parseError(queryError);
      setErrorInfo(parsedError);
    } else {
      setErrorInfo(null);
    }
  }, [queryError]);

  // Memoize error message for display
  const error = useMemo(() => {
    return errorInfo?.userMessage || null;
  }, [errorInfo]);

  // Handle retry using React Query refetch
  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const scores = propScores || storeScores || apiScores;

  if (loading) {
    return (
      <CategoryBreakdownContainer>
        <div className="flex items-center justify-center h-full">
          <div className="space-y-4">
            <Skeleton width={300} height={200} rounded="lg" />
            <SkeletonText lines={2} />
          </div>
        </div>
      </CategoryBreakdownContainer>
    );
  }

  if (error && errorInfo) {

    return (
      <CategoryBreakdownContainer>
        <div className="flex flex-col items-center justify-center text-center py-8 px-4 h-full">
          <div className="mb-4">
            {errorInfo.type === 'auth' && (
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            )}
            {errorInfo.type === 'rateLimit' && (
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
            {(errorInfo.type === 'network' || errorInfo.type === 'server' || errorInfo.type === 'unknown') && (
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
            {errorInfo.type === 'auth' && 'Authentication Required'}
            {errorInfo.type === 'rateLimit' && 'Too Many Requests'}
            {errorInfo.type === 'network' && 'Connection Error'}
            {errorInfo.type === 'server' && 'Server Error'}
            {errorInfo.type === 'unknown' && 'Error Loading Scores'}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-6 max-w-md">
            {error}
          </p>

          {errorInfo.canRetry && (
            <Button variant="primary" onClick={handleRetry} className="mt-2">
              Try Again
            </Button>
          )}

          {errorInfo.type === 'auth' && (
            <Button variant="primary" onClick={() => window.location.href = '/auth/login'} className="mt-2">
              Go to Login
            </Button>
          )}
        </div>
      </CategoryBreakdownContainer>
    );
  }

  if (!scores || !scores.categoryScores || scores.categoryScores.length === 0) {
    return (
      <CategoryBreakdownContainer>
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-slate-400">
          <p className="text-lg">No category scores available</p>
        </div>
      </CategoryBreakdownContainer>
    );
  }

  const categoryScores = scores.categoryScores;

  // Get color for score
  const getScoreColor = (score: number) => {
    if (score >= 70) return '#10B981';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
  };

  // Prepare data for charts
  const barChartData = categoryScores.map((cat) => ({
    category: cat.category.charAt(0).toUpperCase() + cat.category.slice(1),
    score: cat.percentage,
    target: 70,
    color: getScoreColor(cat.percentage),
  }));

  return (
    <CategoryBreakdownContainer>
      <CategoryBreakdownHeader />
      <EnhancedCategoryBars data={barChartData} />
    </CategoryBreakdownContainer>
  );
}

// Memoize CategoryBreakdown to prevent unnecessary re-renders
export const CategoryBreakdown = memo(CategoryBreakdownComponent, (prevProps, nextProps) => {
  return (
    prevProps.scores === nextProps.scores &&
    prevProps.showComparison === nextProps.showComparison &&
    prevProps.viewMode === nextProps.viewMode &&
    prevProps.userId === nextProps.userId &&
    prevProps.assessmentId === nextProps.assessmentId &&
    prevProps.autoFetch === nextProps.autoFetch
  );
});
