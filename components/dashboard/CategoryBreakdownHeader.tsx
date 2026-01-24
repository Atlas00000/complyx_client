'use client';

import { motion } from 'framer-motion';

/**
 * CategoryBreakdownHeader Component
 * 
 * Enhanced header with:
 * - Gradient text
 * - Animated title
 * - Smooth entrance
 */
export default function CategoryBreakdownHeader() {
  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h3
        className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-dark to-accent"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Category Breakdown
      </motion.h3>
      <motion.p
        className="text-sm text-gray-600 dark:text-slate-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Detailed performance across all compliance categories
      </motion.p>
    </motion.div>
  );
}
