'use client';

import { motion } from 'framer-motion';

interface GapPriorityIndicatorProps {
  severity: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * GapPriorityIndicator Component
 * 
 * Enhanced priority indicator with:
 * - Dynamic styling
 * - Animated badges
 * - Gradient backgrounds
 */
export default function GapPriorityIndicator({ 
  severity 
}: GapPriorityIndicatorProps) {
  const getSeverityConfig = (severity: 'critical' | 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'critical':
        return {
          gradient: 'from-red-500 to-red-600',
          text: 'CRITICAL',
        };
      case 'high':
        return {
          gradient: 'from-orange-500 to-orange-600',
          text: 'HIGH',
        };
      case 'medium':
        return {
          gradient: 'from-amber-500 to-amber-600',
          text: 'MEDIUM',
        };
      case 'low':
        return {
          gradient: 'from-blue-500 to-blue-600',
          text: 'LOW',
        };
    }
  };

  const config = getSeverityConfig(severity);

  return (
    <motion.span
      className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${config.gradient} text-white shadow-lg uppercase tracking-wide`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
    >
      {config.text}
    </motion.span>
  );
}
