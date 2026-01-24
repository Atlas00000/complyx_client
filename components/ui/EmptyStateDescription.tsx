'use client';

import { motion } from 'framer-motion';

interface EmptyStateDescriptionProps {
  description: string;
}

/**
 * EmptyStateDescription Component
 * 
 * Enhanced description with:
 * - Styled text
 * - Smooth animations
 * - Gradient accents
 */
export default function EmptyStateDescription({ description }: EmptyStateDescriptionProps) {
  return (
    <motion.p
      className="text-base md:text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {description}
    </motion.p>
  );
}
