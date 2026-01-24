'use client';

import { motion } from 'framer-motion';

/**
 * PageOverlay Component
 * 
 * Subtle overlay effects for depth:
 * - Animated gradient overlays
 * - Mesh patterns
 * - Depth layers
 */
export default function PageOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[5]">
      {/* Animated gradient mesh */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 dark:from-primary/5 dark:via-transparent dark:to-accent/5"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Subtle radial gradients */}
      <div
        className="absolute top-0 left-0 w-1/2 h-1/2"
        style={{
          background: 'radial-gradient(circle, rgba(6, 95, 70, 0.05) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-1/2 h-1/2 dark:opacity-100"
        style={{
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.05) 0%, transparent 70%)',
        }}
      />
      
      {/* Corner accents */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 dark:bg-accent/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
