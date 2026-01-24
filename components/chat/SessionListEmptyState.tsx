'use client';

import { motion } from 'framer-motion';

/**
 * SessionListEmptyState Component
 * 
 * Elegant empty state with:
 * - Animated geometric shapes
 * - No clip art or emojis
 * - Smooth animations
 */
export default function SessionListEmptyState() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Animated geometric shapes */}
      <div className="relative mb-6">
        {/* Main circle */}
        <motion.div
          className="w-20 h-20 rounded-full border-3 border-primary/30 dark:border-primary/40 mx-auto"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20" />
        </motion.div>
        
        {/* Floating dots */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/40 dark:bg-primary/50"
            style={{
              top: `${30 + i * 25}%`,
              left: `${i % 2 === 0 ? '25%' : '75%'}`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}
        
        {/* Geometric lines */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            rotate: [0, 360],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-0.5 h-24 bg-gradient-to-b from-transparent via-accent/30 to-transparent transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            rotate: [360, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
      
      {/* Text content */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100 mb-2">
          No chat sessions yet
        </h3>
        <p className="text-sm text-gray-600 dark:text-slate-400">
          Create a new chat to get started
        </p>
      </motion.div>
    </motion.div>
  );
}
