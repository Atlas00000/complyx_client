'use client';

import { motion } from 'framer-motion';

interface RequirementProgressBarProps {
  score: number;
  compliant: boolean;
}

/**
 * RequirementProgressBar Component
 * 
 * Enhanced progress bar with:
 * - Gradient fills
 * - Animated progress
 * - Glow effects
 */
export default function RequirementProgressBar({ 
  score, 
  compliant 
}: RequirementProgressBarProps) {
  const getGradient = (compliant: boolean, score: number) => {
    if (compliant) return 'from-emerald-500 via-emerald-600 to-emerald-700';
    if (score >= 40) return 'from-amber-500 via-amber-600 to-amber-700';
    return 'from-red-500 via-red-600 to-red-700';
  };

  const getGlowColor = (compliant: boolean, score: number) => {
    if (compliant) return '#10B981';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="relative w-full h-3 rounded-full bg-gray-200/50 dark:bg-slate-600/50 overflow-hidden">
      {/* Animated progress bar */}
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${getGradient(compliant, score)}`}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{
          boxShadow: `0 0 15px ${getGlowColor(compliant, score)}40`,
        }}
      />
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1.5,
          ease: 'linear',
        }}
      />
    </div>
  );
}
