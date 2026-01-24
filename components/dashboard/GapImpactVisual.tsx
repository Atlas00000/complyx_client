'use client';

import { motion } from 'framer-motion';

interface GapImpactVisualProps {
  gap: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * GapImpactVisual Component
 * 
 * Enhanced gap impact visual with:
 * - Gradient progress bar
 * - Animated progress
 * - Glow effects
 */
export default function GapImpactVisual({ 
  gap, 
  severity 
}: GapImpactVisualProps) {
  const getGradient = (severity: 'critical' | 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'critical':
        return 'from-red-500 via-red-600 to-red-700';
      case 'high':
        return 'from-orange-500 via-orange-600 to-orange-700';
      case 'medium':
        return 'from-amber-500 via-amber-600 to-amber-700';
      case 'low':
        return 'from-blue-500 via-blue-600 to-blue-700';
    }
  };

  const getGlowColor = (severity: 'critical' | 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'critical':
        return '#EF4444';
      case 'high':
        return '#F97316';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#3B82F6';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-gray-700 dark:text-slate-300">Gap Impact</span>
        <span className="font-bold" style={{ color: getGlowColor(severity) }}>
          {gap.toFixed(0)}%
        </span>
      </div>
      <div className="relative w-full h-3 rounded-full bg-gray-200/50 dark:bg-slate-600/50 overflow-hidden">
        {/* Animated progress bar */}
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${getGradient(severity)}`}
          initial={{ width: 0 }}
          animate={{ width: `${gap}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            boxShadow: `0 0 15px ${getGlowColor(severity)}40`,
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
    </div>
  );
}
