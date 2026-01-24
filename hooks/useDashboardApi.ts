'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardAPI } from '@/lib/api/dashboardApi';
import { AssessmentScore } from '@/stores/assessmentStore';

/**
 * React Query hooks for Dashboard API calls
 * Provides automatic caching, refetching, and error handling
 */

// Query keys for cache management
export const dashboardKeys = {
  all: ['dashboard'] as const,
  readinessScore: (userId?: string, assessmentId?: string) => 
    [...dashboardKeys.all, 'readinessScore', userId, assessmentId] as const,
  dashboardData: (userId?: string, assessmentId?: string) => 
    [...dashboardKeys.all, 'dashboardData', userId, assessmentId] as const,
  progressHistory: (userId?: string, assessmentId?: string) => 
    [...dashboardKeys.all, 'progressHistory', userId, assessmentId] as const,
};

/**
 * Hook to fetch readiness score with caching
 * Cache TTL: 5 minutes
 */
export function useReadinessScore(
  userId?: string,
  assessmentId?: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) {
  return useQuery({
    queryKey: dashboardKeys.readinessScore(userId, assessmentId),
    queryFn: async () => {
      const data = await DashboardAPI.getReadinessScore({ userId, assessmentId });
      // Map to store format
      const mappedScores: AssessmentScore = {
        overallScore: data.overallScore,
        overallPercentage: data.overallPercentage,
        categoryScores: data.categoryScores,
        totalAnswered: data.totalAnswered,
        totalQuestions: data.totalQuestions,
      };
      return mappedScores;
    },
    enabled: options?.enabled !== false && (!!userId || !!assessmentId),
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes default
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

/**
 * Hook to fetch dashboard data with caching
 * Cache TTL: 5 minutes
 */
export function useDashboardData(
  userId?: string,
  assessmentId?: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) {
  return useQuery({
    queryKey: dashboardKeys.dashboardData(userId, assessmentId),
    queryFn: () => DashboardAPI.getDashboardData({ userId, assessmentId }),
    enabled: options?.enabled !== false && (!!userId || !!assessmentId),
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes default
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

/**
 * Hook to fetch progress history with caching
 * Cache TTL: 5 minutes
 */
export function useProgressHistory(
  userId?: string,
  assessmentId?: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) {
  return useQuery({
    queryKey: dashboardKeys.progressHistory(userId, assessmentId),
    queryFn: async () => {
      const data = await DashboardAPI.getDashboardData({ userId, assessmentId });
      return data.historicalTrends?.assessments || [];
    },
    enabled: options?.enabled !== false && (!!userId || !!assessmentId),
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes default
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

/**
 * Hook to invalidate dashboard cache
 * Useful after mutations that update dashboard data
 */
export function useInvalidateDashboard() {
  const queryClient = useQueryClient();

  return {
    invalidateReadinessScore: (userId?: string, assessmentId?: string) => {
      queryClient.invalidateQueries({
        queryKey: dashboardKeys.readinessScore(userId, assessmentId),
      });
    },
    invalidateDashboardData: (userId?: string, assessmentId?: string) => {
      queryClient.invalidateQueries({
        queryKey: dashboardKeys.dashboardData(userId, assessmentId),
      });
    },
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: dashboardKeys.all,
      });
    },
  };
}
