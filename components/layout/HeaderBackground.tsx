'use client';

import { motion } from 'framer-motion';

/**
 * HeaderBackground Component
 * 
 * Creates an animated background with:
 * - Subtle gradient overlays
 * - Animated gradient orbs
 * - Glassmorphism base
 * - Dynamic depth effects
 */
export default function HeaderBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent dark:from-primary/10" />
      
      {/* Animated gradient orb - Left */}
      <motion.div
        className="absolute top-0 left-0 w-64 h-64 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Animated gradient orb - Right */}
      <motion.div
        className="absolute top-0 right-0 w-48 h-48 bg-accent/10 dark:bg-accent/20 rounded-full blur-3xl"
        animate={{
          x: [0, -20, 0],
          y: [0, 15, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Subtle mesh gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/3 to-transparent dark:via-primary/5" />
    </div>
  );
}
