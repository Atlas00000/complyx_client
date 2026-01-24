'use client';

import { motion } from 'framer-motion';

/**
 * LoadingText Component
 * 
 * Animated gradient text with:
 * - Pulsing gradient animation
 * - Smooth fade in/out
 * - Dynamic text support
 */
interface LoadingTextProps {
  text?: string;
  className?: string;
}

export default function LoadingText({ 
  text = 'Loading...',
  className = '' 
}: LoadingTextProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <motion.h2
        className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
        style={{
          backgroundSize: '200% 100%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {text}
      </motion.h2>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-30 blur-xl -z-10"
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
}
