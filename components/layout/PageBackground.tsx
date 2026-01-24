'use client';

import { motion } from 'framer-motion';

/**
 * PageBackground Component
 * 
 * Creates a stunning animated background with:
 * - Large gradient orbs
 * - Subtle mesh gradients
 * - Depth layers
 * - Continuous motion
 */
export default function PageBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-50/95 to-primary/5 dark:from-slate-900 dark:via-slate-900 dark:to-primary/10" />
      
      {/* Large Primary Forest Green Orb - Top Left */}
      <motion.div
        className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 80, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Large Teal Accent Orb - Bottom Right */}
      <motion.div
        className="absolute -bottom-40 -right-40 w-[900px] h-[900px] bg-accent/10 dark:bg-accent/20 rounded-full blur-3xl"
        animate={{
          x: [0, -120, 0],
          y: [0, -100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Center Sage Green Orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[700px] h-[700px] bg-secondary/8 dark:bg-secondary/15 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Additional subtle green glow - Top Right */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-[750px] h-[750px] bg-primary/8 dark:bg-primary/15 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.6, 0.3],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Bottom Left Accent */}
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-[650px] h-[650px] bg-accent/8 dark:bg-accent/15 rounded-full blur-3xl"
        animate={{
          x: [0, 60, 0],
          y: [0, -50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Subtle mesh gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-primary/3 to-transparent dark:via-primary/5" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/2 to-transparent dark:via-accent/4" />
    </div>
  );
}
