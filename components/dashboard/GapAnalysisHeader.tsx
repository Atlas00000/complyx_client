'use client';

import { motion } from 'framer-motion';

interface GapAnalysisHeaderProps {
  ifrsStandard: 'S1' | 'S2';
  overallGap: number;
}

/**
 * GapAnalysisHeader Component
 * 
 * Enhanced header with:
 * - Gradient text
 * - Animated title
 * - Overall gap score display
 * - Status description
 */
export default function GapAnalysisHeader({ 
  ifrsStandard, 
  overallGap 
}: GapAnalysisHeaderProps) {
  const getGapColor = (gap: number) => {
    if (gap >= 50) return 'from-red-500 via-red-600 to-red-700';
    if (gap >= 30) return 'from-orange-500 via-orange-600 to-orange-700';
    if (gap >= 10) return 'from-amber-500 via-amber-600 to-amber-700';
    return 'from-blue-500 via-blue-600 to-blue-700';
  };

  const getStatusMessage = (gap: number) => {
    if (gap >= 50) return 'Critical gaps detected - Immediate action required';
    if (gap >= 30) return 'Significant gaps identified - Priority action needed';
    if (gap >= 10) return 'Moderate gaps found - Improvement recommended';
    return 'Minor gaps - On track for compliance';
  };

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h3
        className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-warning via-error to-warning-dark"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Gap Analysis - IFRS {ifrsStandard}
      </motion.h3>
      
      {/* Overall Gap Score */}
      <motion.div
        className="relative p-6 rounded-2xl backdrop-blur-sm bg-white/50 dark:bg-slate-700/50 border border-white/40 dark:border-slate-600/40"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">
            Overall Gap
          </span>
          <motion.span
            className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${getGapColor(overallGap)}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {overallGap.toFixed(1)}%
          </motion.span>
        </div>
        
        {/* Progress bar */}
        <div className="relative w-full h-4 rounded-full bg-gray-200/50 dark:bg-slate-600/50 overflow-hidden mb-3">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${getGapColor(overallGap)}`}
            initial={{ width: 0 }}
            animate={{ width: `${overallGap}%` }}
            transition={{ duration: 1.5, delay: 0.6, ease: 'easeOut' }}
            style={{
              boxShadow: `0 0 20px ${overallGap >= 50 ? '#EF4444' : overallGap >= 30 ? '#F97316' : overallGap >= 10 ? '#F59E0B' : '#3B82F6'}40`,
            }}
          />
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
              ease: 'linear',
            }}
          />
        </div>
        
        {/* Status message */}
        <motion.p
          className="text-sm text-gray-600 dark:text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {getStatusMessage(overallGap)}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
