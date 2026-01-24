'use client';

import { motion } from 'framer-motion';

interface GapActionItemsProps {
  actions: string[];
}

/**
 * GapActionItems Component
 * 
 * Enhanced action items list with:
 * - Glassmorphism container
 * - Animated list items
 * - Interactive styling
 */
export default function GapActionItems({ actions }: GapActionItemsProps) {
  if (!actions || actions.length === 0) return null;

  return (
    <motion.div
      className="relative p-6 rounded-2xl backdrop-blur-sm bg-white/50 dark:bg-slate-700/50 border border-white/40 dark:border-slate-600/40"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h4
        className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        Priority Actions
      </motion.h4>
      <ul className="space-y-3">
        {actions.map((action, index) => (
          <motion.li
            key={index}
            className="flex items-start gap-3 text-sm text-gray-700 dark:text-slate-300 group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <motion.span
              className="text-primary mt-1 text-lg font-bold"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatDelay: 2,
                ease: 'easeInOut',
              }}
            >
              •
            </motion.span>
            <span className="flex-1 group-hover:text-gray-900 dark:group-hover:text-slate-100 transition-colors">
              {action}
            </span>
          </motion.li>
        ))}
      </ul>
      
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
    </motion.div>
  );
}
