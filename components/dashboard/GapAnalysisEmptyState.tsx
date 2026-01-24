'use client';

import { motion } from 'framer-motion';

interface GapAnalysisEmptyStateProps {
  ifrsStandard: 'S1' | 'S2';
}

/**
 * GapAnalysisEmptyState Component
 * 
 * Enhanced empty state with:
 * - Glassmorphism container
 * - Gradient text
 * - Smooth animations
 */
export default function GapAnalysisEmptyState({ 
  ifrsStandard 
}: GapAnalysisEmptyStateProps) {
  return (
    <motion.div
      className="relative p-8 rounded-2xl backdrop-blur-sm bg-white/50 dark:bg-slate-700/50 border-2 border-emerald-500/30 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-500/5 rounded-2xl" />
      
      {/* Content */}
      <div className="relative z-10">
        <motion.div
          className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          No Gaps Identified
        </motion.div>
        <motion.p
          className="text-sm text-gray-600 dark:text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Your assessment shows full compliance with IFRS {ifrsStandard} requirements.
        </motion.p>
      </div>
      
      {/* Decorative glow */}
      <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl blur-xl opacity-40 -z-10" />
    </motion.div>
  );
}
