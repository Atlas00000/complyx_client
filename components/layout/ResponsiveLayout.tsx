'use client';

import { ReactNode } from 'react';
import PageLayout from './PageLayout';

interface ResponsiveLayoutProps {
  children: ReactNode;
  mobileClassName?: string;
  desktopClassName?: string;
}

/**
 * ResponsiveLayout Component
 *
 * Uses a single web (desktop) layout for all screen sizes.
 * Responsive behavior can be handled via CSS for different viewport sizes.
 */
export default function ResponsiveLayout({
  children,
  mobileClassName = '',
  desktopClassName = '',
}: ResponsiveLayoutProps) {
  return (
    <PageLayout className={desktopClassName || mobileClassName}>
      {children}
    </PageLayout>
  );
}
