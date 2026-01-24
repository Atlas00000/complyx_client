'use client';

import { motion } from 'framer-motion';

interface CategoryBreakdown {
  score: number;
  compliant: number;
  total: number;
}

interface CategoryBreakdownCardsProps {
  categoryBreakdown: {
    governance?: CategoryBreakdown;
    strategy?: CategoryBreakdown;
    risk?: CategoryBreakdown;
    metrics?: CategoryBreakdown;
  };
}

/**
 * CategoryBreakdownCards Component
 * 
 * Enhanced category breakdown cards with:
 * - Glassmorphism effects
 * - Animated counters
 * - Gradient backgrounds
 */
export default function CategoryBreakdownCards({ 
  categoryBreakdown 
}: CategoryBreakdownCardsProps) {
  const categories = [
    { key: 'governance', label: 'Governance', data: categoryBreakdown.governance },
    { key: 'strategy', label: 'Strategy', data: categoryBreakdown.strategy },
    { key: 'risk', label: 'Risk', data: categoryBreakdown.risk },
    { key: 'metrics', label: 'Metrics', data: categoryBreakdown.metrics },
  ].filter(cat => cat.data);

  if (categories.length === 0) return null;

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'from-emerald-500 to-emerald-600';
    if (score >= 40) return 'from-amber-500 to-amber-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h4 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">
        Category Breakdown
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category, index) => {
          if (!category.data) return null;
          
          return (
            <motion.div
              key={category.key}
              className="relative p-5 rounded-2xl backdrop-blur-sm bg-white/50 dark:bg-slate-700/50 border border-white/40 dark:border-slate-600/40 overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getScoreColor(category.data.score)} opacity-10`} />
              
              {/* Content */}
              <div className="relative z-10">
                <h5 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3 capitalize">
                  {category.label}
                </h5>
                <motion.div
                  className={`text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${getScoreColor(category.data.score)}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  {category.data.score.toFixed(0)}%
                </motion.div>
                <div className="text-xs text-gray-600 dark:text-slate-400">
                  {category.data.compliant} / {category.data.total} compliant
                </div>
              </div>
              
              {/* Decorative glow */}
              <div className={`absolute -inset-1 bg-gradient-to-br ${getScoreColor(category.data.score)} opacity-20 blur-xl -z-10`} />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
