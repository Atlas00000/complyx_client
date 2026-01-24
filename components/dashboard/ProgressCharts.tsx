'use client';

import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { parseError, ErrorInfo } from '@/lib/utils/errorHandler';
import { useProgressHistory } from '@/hooks/useDashboardApi';
import Skeleton, { SkeletonText } from '@/components/ui/Loading';
import { Button } from '@/components/ui';
import ProgressChartsContainer from './ProgressChartsContainer';
import ProgressChartsHeader from './ProgressChartsHeader';
import EnhancedAreaChart from './EnhancedAreaChart';

interface ProgressChartsProps {
  history?: Array<{ date: string; progress: number; answeredCount: number }>;
  showAreaChart?: boolean;
  userId?: string;
  assessmentId?: string;
  autoFetch?: boolean;
}

function ProgressChartsComponent({ 
  history, 
  showAreaChart: _showAreaChart = true,
  userId,
  assessmentId,
  autoFetch = false,
}: ProgressChartsProps) {
  const { progress, answeredCount, totalCount, answers } = useAssessmentStore();
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);

  // Use React Query for API calls with automatic caching
  const {
    data: apiHistoryData,
    isLoading: loading,
    error: queryError,
    refetch,
  } = useProgressHistory(
    userId,
    assessmentId,
    {
      enabled: autoFetch,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

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

  // Convert API history data to expected format
  const apiHistory = useMemo(() => {
    return apiHistoryData || [];
  }, [apiHistoryData]);

  // Generate mock history if not provided
  const generateHistory = (): Array<{ date: string; progress: number; answeredCount: number }> => {
    if (!history && answers.length > 0) {
      const historyData: Array<{ date: string; progress: number; answeredCount: number }> = [];
      const sortedAnswers = [...answers].sort((a, b) => {
        const dateA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
        const dateB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
        return dateA.getTime() - dateB.getTime();
      });

      let cumulativeCount = 0;
      const currentDate = new Date();
      
      sortedAnswers.forEach((answer) => {
        cumulativeCount++;
        const timestamp = answer.timestamp instanceof Date ? answer.timestamp : new Date(answer.timestamp);
        const progressValue = totalCount > 0 ? (cumulativeCount / totalCount) * 100 : 0;
        
        const timeKey = timestamp.toISOString().split('T')[0];
        const existingIndex = historyData.findIndex(d => d.date === timeKey);
        
        if (existingIndex >= 0) {
          historyData[existingIndex].progress = progressValue;
          historyData[existingIndex].answeredCount = cumulativeCount;
        } else {
          historyData.push({
            date: timeKey,
            progress: progressValue,
            answeredCount: cumulativeCount,
          });
        }
      });

      if (historyData.length === 0 || historyData[historyData.length - 1].date !== currentDate.toISOString().split('T')[0]) {
        historyData.push({
          date: currentDate.toISOString().split('T')[0],
          progress,
          answeredCount,
        });
      }

      return historyData;
    }

    const transformedHistory = apiHistory.length > 0 
      ? apiHistory.map(item => ({
          date: typeof item.createdAt === 'string' 
            ? item.createdAt.split('T')[0] 
            : new Date(item.createdAt).toISOString().split('T')[0],
          progress: item.progress,
          answeredCount: Math.round((item.progress / 100) * totalCount),
        }))
      : [];

    return history || transformedHistory.length > 0 ? transformedHistory : [
      { date: new Date().toISOString().split('T')[0], progress, answeredCount },
    ];
  };

  const chartData = generateHistory();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading && autoFetch) {
    return (
      <ProgressChartsContainer>
        <div className="flex items-center justify-center h-full">
          <div className="space-y-4">
            <Skeleton width={300} height={200} rounded="lg" />
            <SkeletonText lines={2} />
          </div>
        </div>
      </ProgressChartsContainer>
    );
  }

  if (error && errorInfo && autoFetch) {

    return (
      <ProgressChartsContainer>
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
            {errorInfo.type === 'unknown' && 'Error Loading Data'}
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
      </ProgressChartsContainer>
    );
  }

  return (
    <ProgressChartsContainer>
      <ProgressChartsHeader />
      <EnhancedAreaChart data={chartData} formatDate={formatDate} />
    </ProgressChartsContainer>
  );
}

// Memoize ProgressCharts to prevent unnecessary re-renders
export const ProgressCharts = memo(ProgressChartsComponent, (prevProps, nextProps) => {
  return (
    prevProps.history === nextProps.history &&
    prevProps.showAreaChart === nextProps.showAreaChart &&
    prevProps.userId === nextProps.userId &&
    prevProps.assessmentId === nextProps.assessmentId &&
    prevProps.autoFetch === nextProps.autoFetch
  );
});
