'use client';

import { motion } from 'framer-motion';
import { type SuggestedPrompt } from '@/data/promptTemplates';

interface PromptIconProps {
  category: SuggestedPrompt['category'];
}

/**
 * PromptIcon Component
 * 
 * Animated icon with gradient effects
 * and smooth hover animations.
 */
export default function PromptIcon({ category }: PromptIconProps) {
  const getCategoryIcon = (category: SuggestedPrompt['category']) => {
    switch (category) {
      case 'overview':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'compliance':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'requirements':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'assessment':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'guidance':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getCategoryColor = (category: SuggestedPrompt['category']) => {
    switch (category) {
      case 'overview':
        return 'text-blue-600 dark:text-blue-400';
      case 'compliance':
        return 'text-primary dark:text-primary-light';
      case 'requirements':
        return 'text-purple-600 dark:text-purple-400';
      case 'assessment':
        return 'text-orange-600 dark:text-orange-400';
      case 'guidance':
        return 'text-accent dark:text-accent-light';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <motion.div
      className={`relative ${getCategoryColor(category)}`}
      whileHover={{ scale: 1.15, rotate: 5 }}
      transition={{ duration: 0.2 }}
    >
      {/* Icon background glow */}
      <motion.div
        className={`absolute inset-0 rounded-lg bg-current opacity-20 blur-md`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Icon */}
      <div className="relative z-10">
        {getCategoryIcon(category)}
      </div>
    </motion.div>
  );
}
