'use client';

import { motion } from 'framer-motion';

/**
 * LoadingSpinner Component
 * 
 * Glassmorphism spinner with:
 * - Animated gradient ring
 * - Pulsing glow effects
 * - Smooth rotation
 * - Dynamic size support
 */
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'large',
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-24 h-24',
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/20 dark:bg-primary/30 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Main spinner ring with glassmorphism */}
      <div 
        className="relative w-full h-full rounded-full"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Dark mode background */}
        <div className="hidden dark:block absolute inset-0 rounded-full bg-gradient-to-br from-slate-800/90 via-slate-800/80 to-slate-800/90" />
        
        {/* Rotating gradient border using conic gradient */}
        <motion.div
          className="absolute inset-0 rounded-full p-1"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, rgb(6, 95, 70) 90deg, rgb(20, 184, 166) 180deg, rgb(6, 95, 70) 270deg, transparent 360deg)',
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className="w-full h-full rounded-full bg-white/90 dark:bg-slate-900/90" />
        </motion.div>
        
        {/* Inner rotating accent */}
        <motion.div
          className="absolute inset-3 rounded-full border-2 border-primary/20"
          animate={{ rotate: -360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
      
      {/* Center pulsing dot */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary z-10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
