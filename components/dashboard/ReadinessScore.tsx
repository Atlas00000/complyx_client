'use client';

import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { useAssessmentStore, AssessmentScore } from '@/stores/assessmentStore';
import { parseError, ErrorInfo } from '@/lib/utils/errorHandler';
import { useReadinessScore } from '@/hooks/useDashboardApi';
import Skeleton, { SkeletonText } from '@/components/ui/Loading';
import { Button } from '@/components/ui';
import ReadinessScoreContainer from './ReadinessScoreContainer';
import CircularProgressIndicator from './CircularProgressIndicator';
import ReadinessScoreHeader from './ReadinessScoreHeader';
import CategoryBreakdownVisual from './CategoryBreakdownVisual';
import CategoryPieChart from './CategoryPieChart';
import ReadinessStatusBadge from './ReadinessStatusBadge';

interface ReadinessScoreProps {
  scores?: AssessmentScore | null;
  size?: number;
  showBreakdown?: boolean;
  userId?: string;
  assessmentId?: string;
  autoFetch?: boolean;
}

function ReadinessScoreComponent({ 
  scores: propScores, 
  size = 240, 
  showBreakdown = true,
  userId,
  assessmentId,
  autoFetch = false,
}: ReadinessScoreProps) {
  const { scores: storeScores, setScores } = useAssessmentStore();
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);

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

  // Get scores from props, store, or API
  const scores = propScores || storeScores || apiScores;

  // Handle retry using React Query refetch
  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  // Animate score counter
  useEffect(() => {
    if (!scores) return;
    
    const targetScore = scores.overallScore;
    const duration = 2000;
    const steps = 60;
    const increment = targetScore / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetScore) {
        setAnimatedScore(targetScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [scores]);

  // Loading state
  if (loading) {
    return (
      <ReadinessScoreContainer>
        <div className="flex flex-col items-center gap-6">
          <Skeleton width={240} height={240} rounded="full" />
          <SkeletonText lines={2} />
        </div>
      </ReadinessScoreContainer>
    );
  }

  // Error state with improved UI
  if (error && errorInfo) {

    return (
      <ReadinessScoreContainer>
        <div className="flex flex-col items-center justify-center text-center py-8 px-4">
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
            <Button
              variant="primary"
              onClick={handleRetry}
              className="mt-2"
            >
              Try Again
            </Button>
          )}

          {errorInfo.type === 'auth' && (
            <Button
              variant="primary"
              onClick={() => window.location.href = '/auth/login'}
              className="mt-2"
            >
              Go to Login
            </Button>
          )}
        </div>
      </ReadinessScoreContainer>
    );
  }

  // Empty state
  if (!scores) {
    return (
      <ReadinessScoreContainer>
        <div className="text-center text-gray-500 dark:text-slate-400">
          <p className="text-lg">No scores available</p>
        </div>
      </ReadinessScoreContainer>
    );
  }

  const overallScore = scores.overallScore;
  const categoryScores = scores.categoryScores || [];

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#10B981';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
  };

  const categoryPieData = categoryScores.map((cat) => ({
    name: cat.category.charAt(0).toUpperCase() + cat.category.slice(1),
    value: cat.percentage,
    color: getScoreColor(cat.percentage),
  }));

  return (
    <ReadinessScoreContainer>
      <div className="space-y-8">
        {/* Header */}
        <ReadinessScoreHeader score={overallScore} />

        {/* Circular Progress Indicator */}
        <div className="flex justify-center">
          <CircularProgressIndicator
            score={overallScore}
            size={size}
            animatedScore={animatedScore}
          />
        </div>

        {/* Category Breakdown */}
        {showBreakdown && categoryScores.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <CategoryBreakdownVisual categoryScores={categoryScores} />
            
            {/* Category Pie Chart */}
            {categoryPieData.length > 0 && (
              <CategoryPieChart data={categoryPieData} />
            )}
          </motion.div>
        )}

        {/* Status Badge */}
        <ReadinessStatusBadge score={overallScore} />
      </div>
    </ReadinessScoreContainer>
  );
}

// Memoize ReadinessScore to prevent unnecessary re-renders
export const ReadinessScore = memo(ReadinessScoreComponent, (prevProps, nextProps) => {
  return (
    prevProps.scores === nextProps.scores &&
    prevProps.size === nextProps.size &&
    prevProps.showBreakdown === nextProps.showBreakdown &&
    prevProps.userId === nextProps.userId &&
    prevProps.assessmentId === nextProps.assessmentId &&
    prevProps.autoFetch === nextProps.autoFetch
  );
});
