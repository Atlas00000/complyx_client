'use client';

import { motion } from 'framer-motion';

interface ReadinessScoreHeaderProps {
  score: number;
}

/**
 * ReadinessScoreHeader Component
 * 
 * Enhanced header with:
 * - Gradient text
 * - Animated title
 * - Status description
 */
export default function ReadinessScoreHeader({ score }: ReadinessScoreHeaderProps) {
  const getStatusDescription = (score: number) => {
    if (score >= 70) return 'High readiness';
    if (score >= 40) return 'Moderate readiness';
    return 'Low readiness';
  };

  return (
    <motion.div
      className="text-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <motion.h3
        className="text-2xl md:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-dark to-accent"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Overall Readiness Score
      </motion.h3>
      <motion.p
        className="text-sm md:text-base text-gray-600 dark:text-slate-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        {getStatusDescription(score)}
      </motion.p>
    </motion.div>
  );
}
