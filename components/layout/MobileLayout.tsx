'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * MobileLayout Component
 * 
 * Optimized layout wrapper for mobile devices with:
 * - Safe area insets for notched devices
 * - Touch-optimized spacing
 * - Mobile-specific animations
 * - Viewport height handling
 */
export default function MobileLayout({ children, className = '' }: MobileLayoutProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    // Return children without mobile wrapper on desktop
    return <>{children}</>;
  }

  return (
    <motion.div
      className={`mobile-layout relative flex flex-col h-screen overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        // Support for safe area insets (notched devices)
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        // Use viewport height units for better mobile support
        minHeight: '-webkit-fill-available',
      }}
    >
      {/* Mobile-optimized background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Simplified gradient for mobile performance */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-50/95 to-primary/5 dark:from-slate-900 dark:via-slate-900 dark:to-primary/10" />
        
        {/* Reduced blur effects for mobile */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent/10 dark:bg-accent/20 rounded-full blur-3xl" />
      </div>

      {/* Content with proper z-index */}
      <div className="relative z-10 flex flex-col h-full">
        {children}
      </div>
    </motion.div>
  );
}
