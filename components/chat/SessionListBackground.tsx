'use client';

import { motion } from 'framer-motion';

/**
 * SessionListBackground Component
 * 
 * Creates an animated backdrop with:
 * - Glassmorphism overlay
 * - Subtle gradient effects
 * - Smooth fade animations
 */
export default function SessionListBackground({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
}
