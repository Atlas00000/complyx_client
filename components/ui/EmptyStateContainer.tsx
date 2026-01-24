'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface EmptyStateContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * EmptyStateContainer Component
 * 
 * Creates a stunning container with:
 * - Glassmorphism effects
 * - Animated gradient backgrounds
 * - Depth layers
 * - Smooth transitions
 */
export default function EmptyStateContainer({ 
  children, 
  className = '' 
}: EmptyStateContainerProps) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-3xl ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
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
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent dark:from-primary/15 dark:via-accent/10"
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
        className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 dark:bg-accent/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-secondary/10 dark:bg-secondary/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Inner glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent dark:from-white/10 pointer-events-none" />
      
      {/* Border with gradient */}
      <div className="absolute inset-0 rounded-3xl border-2 border-white/40 dark:border-slate-600/50" />
      
      {/* Content */}
      <div className="relative z-10 p-12 md:p-16">
        {children}
      </div>
      
      {/* Enhanced shadow */}
      <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-40 -z-10" />
    </motion.div>
  );
}
