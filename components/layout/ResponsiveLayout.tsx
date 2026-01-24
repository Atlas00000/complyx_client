'use client';

import { ReactNode } from 'react';
import { useIsMobile, useIsTablet } from '@/hooks/useMediaQuery';
import MobileLayout from './MobileLayout';
import PageLayout from './PageLayout';

interface ResponsiveLayoutProps {
  children: ReactNode;
  mobileClassName?: string;
  desktopClassName?: string;
}

/**
 * ResponsiveLayout Component
 * 
 * Automatically switches between mobile and desktop layouts based on viewport size.
 * Provides optimized experiences for each device type.
 */
export default function ResponsiveLayout({
  children,
  mobileClassName = '',
  desktopClassName = '',
}: ResponsiveLayoutProps) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  // Use mobile layout for mobile and tablet
  if (isMobile || isTablet) {
    return (
      <MobileLayout className={mobileClassName}>
        {children}
      </MobileLayout>
    );
  }

  // Use desktop layout for larger screens
  return (
    <PageLayout className={desktopClassName}>
      {children}
    </PageLayout>
  );
}
