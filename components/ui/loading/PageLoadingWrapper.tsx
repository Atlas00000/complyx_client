'use client';

import { useEffect, useState } from 'react';
import LoadingScreen from './LoadingScreen';

/**
 * PageLoadingWrapper Component
 * 
 * Shows a full-page loading screen during initial page load
 * and hides it once the page is ready
 */
interface PageLoadingWrapperProps {
  children: React.ReactNode;
  loadingText?: string;
  minLoadingTime?: number; // Minimum time to show loading (ms)
}

export default function PageLoadingWrapper({
  children,
  loadingText = 'Loading...',
  minLoadingTime = 500,
}: PageLoadingWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    // Wait for minimum loading time to ensure smooth transition
    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(0, minLoadingTime - elapsed);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [startTime, minLoadingTime]);

  // Also hide loading when page is fully loaded
  useEffect(() => {
    const handleLoad = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= minLoadingTime) {
        setIsLoading(false);
      }
    };

    if (document.readyState === 'complete') {
      handleLoad();
      return undefined;
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [startTime, minLoadingTime]);

  if (isLoading) {
    return <LoadingScreen text={loadingText} />;
  }

  return <>{children}</>;
}
