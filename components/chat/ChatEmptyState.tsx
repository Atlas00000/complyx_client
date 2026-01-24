'use client';

import { motion } from 'framer-motion';

/**
 * ChatEmptyState Component
 * 
 * Beautiful empty state for when there are no messages.
 * No clip art or emojis - uses elegant geometric shapes
 * and animations aligned with the Forest Green & Slate theme.
 */
export default function ChatEmptyState() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full min-h-[400px] px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Animated geometric shapes */}
      <div className="relative mb-8">
        {/* Main circle */}
        <motion.div
          className="w-24 h-24 rounded-full border-4 border-primary/20 dark:border-primary/30 mx-auto"
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
            className="absolute w-3 h-3 rounded-full bg-primary/30 dark:bg-primary/40"
            style={{
              top: `${20 + i * 30}%`,
              left: `${i % 2 === 0 ? '20%' : '80%'}`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}
        
        {/* Geometric lines */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            rotate: [0, 360],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-0.5 h-32 bg-gradient-to-b from-transparent via-accent/20 to-transparent transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            rotate: [360, 0],
            opacity: [0.2, 0.4, 0.2],
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
        className="text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-3">
          Start a Conversation
        </h3>
        <p className="text-body text-gray-600 dark:text-slate-400 leading-relaxed">
          Ask me anything about IFRS standards, accounting principles, or compliance requirements.
          I'm here to help you navigate the complexities of financial reporting.
        </p>
      </motion.div>
      
      {/* Subtle gradient accent */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/5 via-transparent to-transparent dark:from-primary/10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </motion.div>
  );
}
