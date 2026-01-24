'use client';

import { motion } from 'framer-motion';

/**
 * AnimatedBackground Component
 * 
 * Creates a stunning animated background with gradient orbs
 * that move subtly to create depth and visual interest.
 * Uses Forest Green & Slate color scheme.
 */
export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/3 to-secondary/5 dark:from-primary/15 dark:via-accent/8 dark:to-secondary/10" />
      
      {/* Primary Forest Green Orb - Top Left */}
      <motion.div
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/15 dark:bg-primary/25 rounded-full blur-3xl"
        animate={{
          x: [0, 80, 0],
          y: [0, 60, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Teal Accent Orb - Bottom Right */}
      <motion.div
        className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-accent/15 dark:bg-accent/25 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -80, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Sage Green Center Orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-secondary/10 dark:bg-secondary/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Additional subtle green glow - Top Right */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-[550px] h-[550px] bg-primary/8 dark:bg-primary/18 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Bottom Left Accent */}
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-accent/10 dark:bg-accent/20 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -40, 0],
          scale: [1, 1.25, 1],
        }}
        transition={{
          duration: 19,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Subtle mesh gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-primary/5 dark:to-primary/10" />
    </div>
  );
}
