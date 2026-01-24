'use client';

import { motion } from 'framer-motion';

/**
 * ProgressChartsHeader Component
 * 
 * Enhanced header with:
 * - Gradient text
 * - Animated title
 * - Smooth entrance
 */
export default function ProgressChartsHeader() {
  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h3
        className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-accent via-primary to-primary-dark"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Progress Over Time
      </motion.h3>
      <motion.p
        className="text-sm text-gray-600 dark:text-slate-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Track your assessment completion and progress trends
      </motion.p>
    </motion.div>
  );
}
