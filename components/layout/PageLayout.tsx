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
 * Main page wrapper with:
 * - Glassmorphism overlay
 * - Smooth transitions
 * - Enhanced depth
 * - Proper z-index layering
 */
export default function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <motion.div
      className={`relative flex flex-col h-screen overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Subtle edge glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent dark:from-primary/15 dark:via-primary/10" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-accent/10 via-accent/5 to-transparent dark:from-accent/15 dark:via-accent/10" />
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-primary/5 to-transparent dark:from-primary/10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-accent/5 to-transparent dark:from-accent/10" />
      </div>
      
      {/* Content with proper z-index */}
      <div className="relative z-10 flex flex-col h-full">
        {children}
      </div>
    </motion.div>
  );
}
