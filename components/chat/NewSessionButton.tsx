'use client';

import { motion } from 'framer-motion';

interface NewSessionButtonProps {
  onClick: () => void;
}

/**
 * NewSessionButton Component
 * 
 * Stunning new session button with:
 * - Animated gradient background
 * - Shimmer effect
 * - Enhanced hover animations
 */
export default function NewSessionButton({ onClick }: NewSessionButtonProps) {
  return (
    <motion.div
      className="relative p-4 border-b border-white/20 dark:border-slate-700/30"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <motion.button
        onClick={onClick}
        className="relative w-full px-5 py-3 rounded-2xl overflow-hidden group"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-accent" />
        
        {/* Animated shimmer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
            ease: 'linear',
          }}
        />
        
        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center gap-2">
          <motion.svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.3 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </motion.svg>
          <span className="text-sm font-semibold text-white">New Chat</span>
        </div>
        
        {/* Enhanced shadow */}
        <div className="absolute -inset-1 bg-gradient-to-br from-primary/40 to-accent/30 rounded-2xl blur-xl opacity-60 -z-10 group-hover:opacity-80 transition-opacity" />
      </motion.button>
    </motion.div>
  );
}
