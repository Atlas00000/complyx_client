'use client';

import { motion } from 'framer-motion';

interface RequirementStatusIndicatorProps {
  compliant: boolean;
  mandatory: boolean;
}

/**
 * RequirementStatusIndicator Component
 * 
 * Enhanced status indicator with:
 * - Dynamic styling
 * - Animated badges
 * - Gradient backgrounds
 */
export default function RequirementStatusIndicator({ 
  compliant, 
  mandatory 
}: RequirementStatusIndicatorProps) {
  if (compliant) {
    return (
      <motion.span
        className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
      >
        Compliant
      </motion.span>
    );
  }

  if (mandatory) {
    return (
      <motion.span
        className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
      >
        Mandatory
      </motion.span>
    );
  }

  return (
    <motion.span
      className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
    >
      Non-Compliant
    </motion.span>
  );
}
