'use client';

import { useState, useEffect, useRef } from 'react';
import { DashboardAPI, GapAnalysis as GapAnalysisType } from '@/lib/api/dashboardApi';
import { parseError, ErrorInfo } from '@/lib/utils/errorHandler';
import Skeleton, { SkeletonText } from '@/components/ui/Loading';
import { Button } from '@/components/ui';
import GapAnalysisContainer from './GapAnalysisContainer';
import GapAnalysisHeader from './GapAnalysisHeader';
import GapSeveritySummary from './GapSeveritySummary';
import GapActionItems from './GapActionItems';
import GapAnalysisGrid from './GapAnalysisGrid';
import GapAnalysisEmptyState from './GapAnalysisEmptyState';

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
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);
  
  // Request cancellation and duplicate guard
  const abortControllerRef = useRef<AbortController | null>(null);
  const isRequestInFlightRef = useRef(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  useEffect(() => {
    // Update state if prop changes
    if (propGapAnalysis) {
      setGapAnalysis(propGapAnalysis);
      return;
    }

    // Skip if conditions not met
    if (!autoFetch || !(userId || assessmentId)) {
      return;
    }

    // Prevent duplicate requests
    if (isRequestInFlightRef.current) {
      return;
    }

    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    isRequestInFlightRef.current = true;

    setLoading(true);
    setError(null);

    DashboardAPI.getGapAnalysis({ userId, assessmentId, ifrsStandard })
      .then((data) => {
        // Check if request was cancelled
        if (abortController.signal.aborted) {
          return;
        }

        setGapAnalysis(data);
      })
      .catch((err) => {
        // Don't set error if request was cancelled
        if (abortController.signal.aborted) {
          return;
        }
        
        // Parse error to get detailed information
        const parsedError = parseError(err);
        console.error('Failed to fetch gap analysis:', err);
        
        setError(parsedError.userMessage);
        setErrorInfo(parsedError);
        
        // For rate limiting, don't retry automatically - user should wait
        // For auth errors, don't retry - user needs to log in
        if (parsedError.type === 'auth' || parsedError.type === 'rateLimit') {
          // Clear any existing retry timeout
          if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = null;
          }
        }
      })
      .finally(() => {
        // Only update loading state if request wasn't cancelled
        if (!abortController.signal.aborted) {
          setLoading(false);
          isRequestInFlightRef.current = false;
        }
      });

    // Cleanup: cancel request on unmount or dependency change
    return () => {
      abortController.abort();
      isRequestInFlightRef.current = false;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, [autoFetch, propGapAnalysis, userId, assessmentId, ifrsStandard, retryTrigger]);

  if (loading) {
    return (
      <GapAnalysisContainer>
        <div className="flex items-center justify-center h-64">
          <div className="space-y-4">
            <Skeleton width={300} height={200} rounded="lg" />
            <SkeletonText lines={2} />
          </div>
        </div>
      </GapAnalysisContainer>
    );
  }

  if (error && errorInfo) {
    const handleRetry = () => {
      setError(null);
      setErrorInfo(null);
      isRequestInFlightRef.current = false;
      setRetryTrigger(prev => prev + 1);
    };

    return (
      <GapAnalysisContainer>
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
            {errorInfo.type === 'unknown' && 'Error Loading Gap Analysis'}
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
      </GapAnalysisContainer>
    );
  }

  if (!gapAnalysis) {
    return (
      <GapAnalysisContainer>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-slate-400">
          <p className="text-lg">No gap analysis data available</p>
        </div>
      </GapAnalysisContainer>
    );
  }

  const allGaps = [
    ...gapAnalysis.criticalGaps,
    ...gapAnalysis.highGaps,
    ...gapAnalysis.mediumGaps,
    ...gapAnalysis.lowGaps,
  ];

  return (
    <GapAnalysisContainer>
      <div className="space-y-8">
        {/* Header with Overall Gap */}
        <GapAnalysisHeader 
          ifrsStandard={gapAnalysis.ifrsStandard}
          overallGap={gapAnalysis.overallGap}
        />

        {/* Severity Summary */}
        <GapSeveritySummary
          critical={gapAnalysis.criticalGaps.length}
          high={gapAnalysis.highGaps.length}
          medium={gapAnalysis.mediumGaps.length}
          low={gapAnalysis.lowGaps.length}
        />

        {/* Priority Actions */}
        {gapAnalysis.priorityActions && gapAnalysis.priorityActions.length > 0 && (
          <GapActionItems actions={gapAnalysis.priorityActions} />
        )}

        {/* Critical Gaps */}
        {gapAnalysis.criticalGaps.length > 0 && (
          <GapAnalysisGrid
            gaps={gapAnalysis.criticalGaps}
            onGapClick={onGapClick}
            title="Critical Gaps"
          />
        )}

        {/* High Priority Gaps (if no critical gaps) */}
        {gapAnalysis.highGaps.length > 0 && gapAnalysis.criticalGaps.length === 0 && (
          <GapAnalysisGrid
            gaps={gapAnalysis.highGaps.slice(0, 5)}
            onGapClick={onGapClick}
            title="High Priority Gaps"
          />
        )}

        {/* Empty State */}
        {allGaps.length === 0 && (
          <GapAnalysisEmptyState ifrsStandard={gapAnalysis.ifrsStandard} />
        )}
      </div>
    </GapAnalysisContainer>
  );
}
