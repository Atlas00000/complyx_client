'use client';

import { motion } from 'framer-motion';

interface CategoryScore {
  category: string;
  percentage: number;
}

interface CategoryBreakdownVisualProps {
  categoryScores: CategoryScore[];
}

/**
 * CategoryBreakdownVisual Component
 * 
 * Enhanced category breakdown with:
 * - Glassmorphism bars
 * - Animated progress
 * - Gradient fills
 * - Interactive hover effects
 */
export default function CategoryBreakdownVisual({
  categoryScores,
}: CategoryBreakdownVisualProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return '#10B981';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 70) return 'from-emerald-500 via-emerald-600 to-emerald-700';
    if (score >= 40) return 'from-amber-500 via-amber-600 to-amber-700';
    return 'from-red-500 via-red-600 to-red-700';
  };

  return (
    <div className="space-y-4">
      <motion.h4
        className="text-lg font-semibold text-gray-900 dark:text-slate-100"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        Category Breakdown
      </motion.h4>
      
      <div className="space-y-4">
        {categoryScores.map((category, index) => {
          const color = getScoreColor(category.percentage);
          const gradient = getScoreGradient(category.percentage);
          
          return (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              {/* Glassmorphism container */}
              <div className="relative p-4 rounded-2xl backdrop-blur-sm bg-white/50 dark:bg-slate-700/50 border border-white/40 dark:border-slate-600/40">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900 dark:text-slate-100 capitalize text-sm md:text-base">
                    {category.category}
                  </span>
                  <motion.span
                    className="text-lg font-bold"
                    style={{ color }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  >
                    {category.percentage.toFixed(0)}%
                  </motion.span>
                </div>
                
                {/* Progress bar container */}
                <div className="relative h-3 rounded-full bg-gray-200/50 dark:bg-slate-600/50 overflow-hidden">
                  {/* Animated progress bar with gradient */}
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${category.percentage}%` }}
                    transition={{ duration: 1.2, delay: 0.4 + index * 0.1, ease: 'easeOut' }}
                    style={{
                      boxShadow: `0 0 20px ${color}40`,
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
                
                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
