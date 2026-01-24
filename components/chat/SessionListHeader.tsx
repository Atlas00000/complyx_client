'use client';

import { motion } from 'framer-motion';

interface SessionListHeaderProps {
  onClose: () => void;
}

/**
 * SessionListHeader Component
 * 
 * Stunning header with:
 * - Animated title with gradient text
 * - Glassmorphism close button
 * - Smooth animations
 */
export default function SessionListHeader({ onClose }: SessionListHeaderProps) {
  return (
    <motion.div
      className="relative p-5 border-b border-white/20 dark:border-slate-700/30 flex items-center justify-between"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Inner glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent dark:from-primary/10 pointer-events-none" />
      
      {/* Title */}
      <motion.h2
        className="relative z-10 text-xl font-bold bg-gradient-to-r from-primary via-primary-dark to-accent bg-clip-text text-transparent"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        Chat History
      </motion.h2>
      
      {/* Close Button */}
      <motion.button
        onClick={onClose}
        className="relative z-10 p-2.5 rounded-xl backdrop-blur-md bg-white/60 dark:bg-slate-700/60 border border-white/30 dark:border-slate-600/50 text-gray-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-600/80 transition-all duration-200 shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.95 }}
        title="Close"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-primary/20 blur-md -z-10"
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.button>
    </motion.div>
  );
}
