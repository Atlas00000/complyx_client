'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CategoryBreakdownContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * CategoryBreakdownContainer Component
 * 
 * Creates a stunning container for category breakdown with:
 * - Glassmorphism effects
 * - Animated gradient backgrounds
 * - Depth layers
 * - Smooth transitions
 */
export default function CategoryBreakdownContainer({ 
  children, 
  className = '' 
}: CategoryBreakdownContainerProps) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-3xl h-full ${className}`}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
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
      
      {/* Radial gradient orb - top right */}
      <motion.div
        className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 dark:bg-primary/30 rounded-full blur-3xl"
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
      <div className="relative z-10 p-6 md:p-8 h-full flex flex-col">
        {children}
      </div>
      
      {/* Enhanced shadow */}
      <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-40 -z-10" />
    </motion.div>
  );
}
