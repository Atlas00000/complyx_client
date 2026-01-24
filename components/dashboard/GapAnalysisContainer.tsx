'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GapAnalysisContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * GapAnalysisContainer Component
 * 
 * Creates a stunning container with:
 * - Glassmorphism effects
 * - Animated gradient backgrounds
 * - Depth layers
 * - Smooth transitions
 */
export default function GapAnalysisContainer({ 
  children, 
  className = '' 
}: GapAnalysisContainerProps) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-3xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Glassmorphism background */}
      <div
        className="absolute inset-0 backdrop-blur-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
        }}
      />
      
      {/* Dark mode glass */}
      <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-slate-800/90 via-slate-800/85 to-slate-800/90 backdrop-blur-xl" />
      
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-warning/10 via-error/5 to-transparent dark:from-warning/15 dark:via-error/10"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Radial gradient orbs */}
      <motion.div
        className="absolute top-1/3 right-1/3 w-96 h-96 bg-warning/15 dark:bg-warning/25 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-error/15 dark:bg-error/25 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Inner glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent dark:from-white/10 pointer-events-none" />
      
      {/* Border with gradient */}
      <div className="absolute inset-0 rounded-3xl border-2 border-white/40 dark:border-slate-600/50" />
      
      {/* Content */}
      <div className="relative z-10 p-6 md:p-8">
        {children}
      </div>
      
      {/* Enhanced shadow */}
      <div className="absolute -inset-1 bg-gradient-to-br from-warning/20 to-error/20 rounded-3xl blur-2xl opacity-40 -z-10" />
    </motion.div>
  );
}
