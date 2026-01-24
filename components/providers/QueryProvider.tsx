'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import devtools only in development and on client side
const ReactQueryDevtools = 
  process.env.NODE_ENV === 'development'
    ? dynamic(
        () =>
          import('@tanstack/react-query-devtools').then((d) => ({
            default: d.ReactQueryDevtools,
          })),
        { ssr: false }
      )
    : () => null;

/**
 * QueryProvider Component
 * 
 * Provides React Query context to the application
 * Configures default query options for caching and error handling
 */
export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache data for 5 minutes by default
            staleTime: 5 * 60 * 1000, // 5 minutes
            // Keep unused data in cache for 10 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            // Retry failed requests 2 times
            retry: 2,
            // Refetch on window focus (can be disabled for better performance)
            refetchOnWindowFocus: false,
            // Refetch on reconnect
            refetchOnReconnect: true,
            // Don't refetch on mount if data is fresh
            refetchOnMount: true,
          },
          mutations: {
            // Retry failed mutations once
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show React Query DevTools in development */}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
