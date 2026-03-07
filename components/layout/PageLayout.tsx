'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageLayout Component
 *
 * Single web layout for all screen sizes. Responsive via Tailwind breakpoints.
 * - Full viewport height with safe-area support for notched devices
 * - Content area can shrink on small screens (min-h-0)
 * - Glassmorphism overlay and edge glows
 */
export default function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <motion.div
      className={`relative flex flex-col h-screen min-h-[100dvh] overflow-hidden ${className}`}
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Subtle edge glows - responsive heights on small screens */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 right-0 h-20 sm:h-32 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent dark:from-primary/15 dark:via-primary/10" />
        <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-32 bg-gradient-to-t from-accent/10 via-accent/5 to-transparent dark:from-accent/15 dark:via-accent/10" />
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-primary/5 to-transparent dark:from-primary/10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-accent/5 to-transparent dark:from-accent/10" />
      </div>

      {/* Content with proper z-index; min-h-0 allows flex shrink on small viewports */}
      <div className="relative z-10 flex flex-col h-full min-h-0">
        {children}
      </div>
    </motion.div>
  );
}
