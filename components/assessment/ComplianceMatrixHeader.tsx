'use client';

import { motion } from 'framer-motion';

interface ComplianceMatrixHeaderProps {
  ifrsStandard: 'S1' | 'S2';
  overallCompliance: number;
}

/**
 * ComplianceMatrixHeader Component
 * 
 * Enhanced header with:
 * - Gradient text
 * - Animated title
 * - Overall compliance score display
 */
export default function ComplianceMatrixHeader({ 
  ifrsStandard, 
  overallCompliance 
}: ComplianceMatrixHeaderProps) {
  const getComplianceColor = (score: number) => {
    if (score >= 70) return 'from-emerald-500 via-emerald-600 to-emerald-700';
    if (score >= 40) return 'from-amber-500 via-amber-600 to-amber-700';
    return 'from-red-500 via-red-600 to-red-700';
  };

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h3
        className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-dark to-accent"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Compliance Matrix - IFRS {ifrsStandard}
      </motion.h3>
      
      {/* Overall Compliance Score */}
      <motion.div
        className="relative p-6 rounded-2xl backdrop-blur-sm bg-white/50 dark:bg-slate-700/50 border border-white/40 dark:border-slate-600/40"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">
            Overall Compliance Score
          </span>
          <motion.span
            className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${getComplianceColor(overallCompliance)}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {overallCompliance.toFixed(1)}%
          </motion.span>
        </div>
        
        {/* Progress bar */}
        <div className="relative w-full h-4 rounded-full bg-gray-200/50 dark:bg-slate-600/50 overflow-hidden">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${getComplianceColor(overallCompliance)}`}
            initial={{ width: 0 }}
            animate={{ width: `${overallCompliance}%` }}
            transition={{ duration: 1.5, delay: 0.6, ease: 'easeOut' }}
            style={{
              boxShadow: `0 0 20px ${overallCompliance >= 70 ? '#10B981' : overallCompliance >= 40 ? '#F59E0B' : '#EF4444'}40`,
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
      </motion.div>
    </motion.div>
  );
}
