'use client';

import { motion } from 'framer-motion';
import LoadingScreenBackground from './LoadingScreenBackground';
import LoadingSpinner from './LoadingSpinner';
import LoadingText from './LoadingText';
import LoadingProgressIndicator from './LoadingProgressIndicator';

/**
 * LoadingScreen Component
 * 
 * Complete loading screen with:
 * - Animated background
 * - Glassmorphism spinner
 * - Gradient text
 * - Progress indicator
 * - Smooth entrance animations
 */
interface LoadingScreenProps {
  text?: string;
  showProgress?: boolean;
  className?: string;
}

export default function LoadingScreen({
  text = 'Loading...',
  showProgress = false,
  className = '',
}: LoadingScreenProps) {
  return (
    <div className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background */}
      <LoadingScreenBackground />
      
      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center gap-8 px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Spinner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <LoadingSpinner size="large" />
        </motion.div>
        
        {/* Loading text */}
        <LoadingText text={text} />
        
        {/* Progress indicator */}
        {showProgress && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <LoadingProgressIndicator showPercentage={showProgress} />
          </motion.div>
        )}
      </motion.div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/20 dark:bg-primary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}
