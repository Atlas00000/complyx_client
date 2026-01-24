'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SuggestedPromptsContainerProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

/**
 * SuggestedPromptsContainer Component
 * 
 * Glassmorphism container with animated background
 * and elegant header styling.
 */
export default function SuggestedPromptsContainer({
  children,
  title,
  subtitle,
}: SuggestedPromptsContainerProps) {
  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Glassmorphism container */}
      <div className="relative rounded-3xl overflow-hidden">
        {/* Frosted glass background */}
        <div
          className="absolute inset-0 backdrop-blur-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.5) 100%)',
          }}
        />
        
        {/* Dark mode glass */}
        <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-slate-800/70 via-slate-800/60 to-slate-800/70 backdrop-blur-2xl" />
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 dark:from-primary/10 dark:via-transparent dark:to-accent/10" />
        
        {/* Animated shimmer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'linear',
          }}
        />
        
        {/* Border */}
        <div className="absolute inset-0 rounded-3xl border border-white/30 dark:border-slate-700/40" />
        
        {/* Content */}
        <div className="relative z-10 p-4 md:p-6">
          {/* Header */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-1">
              {title}
            </h3>
            <p className="text-xs text-gray-600 dark:text-slate-400">
              {subtitle}
            </p>
          </motion.div>
          
          {/* Prompts grid */}
          {children}
        </div>
        
        {/* Enhanced shadow */}
        <div className="absolute -inset-1 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-3xl blur-xl opacity-50 -z-10" />
      </div>
    </motion.div>
  );
}
