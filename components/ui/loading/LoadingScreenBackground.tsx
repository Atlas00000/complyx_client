'use client';

import { motion } from 'framer-motion';

/**
 * LoadingScreenBackground Component
 * 
 * Animated gradient orbs and mesh gradient overlay for loading screen
 * Creates a dynamic, immersive background effect
 */
export default function LoadingScreenBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-50/95 to-primary/5 dark:from-slate-900 dark:via-slate-900 dark:to-primary/10" />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-primary/20 dark:bg-primary/30 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute -bottom-40 -right-40 w-[900px] h-[900px] bg-accent/20 dark:bg-accent/30 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute top-1/2 left-1/2 w-[700px] h-[700px] bg-secondary/15 dark:bg-secondary/25 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-primary/5 to-transparent dark:via-primary/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/3 to-transparent dark:via-accent/5" />
      
      {/* Subtle particles effect */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 dark:bg-primary/40 rounded-full"
            style={{
              left: `${(i * 5) % 100}%`,
              top: `${(i * 7) % 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}
