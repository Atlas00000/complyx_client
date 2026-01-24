'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * LoadingProgressIndicator Component
 * 
 * Animated progress bar with:
 * - Smooth progress animation
 * - Gradient fill
 * - Glassmorphism container
 * - Optional percentage display
 */
interface LoadingProgressIndicatorProps {
  showPercentage?: boolean;
  className?: string;
}

export default function LoadingProgressIndicator({
  showPercentage = false,
  className = '',
}: LoadingProgressIndicatorProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress (for actual loading, pass progress as prop)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`w-full max-w-xs ${className}`}>
      {/* Progress bar container */}
      <div
        className="relative h-2 rounded-full overflow-hidden backdrop-blur-md bg-white/20 dark:bg-slate-800/20 border border-white/30 dark:border-slate-700/30"
        style={{
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Progress fill */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-accent to-primary"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            boxShadow: '0 0 20px rgba(6, 95, 70, 0.5)',
          }}
        />
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
      
      {/* Percentage display */}
      {showPercentage && (
        <motion.div
          className="mt-2 text-sm text-gray-600 dark:text-slate-400 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {Math.round(progress)}%
        </motion.div>
      )}
    </div>
  );
}
