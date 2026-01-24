'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ChatInputCharacterCountProps {
  count: number;
  maxLength?: number;
}

/**
 * ChatInputCharacterCount Component
 * 
 * Animated character counter with:
 * - Smooth fade-in/out
 * - Color transitions
 * - Subtle animations
 */
export default function ChatInputCharacterCount({
  count,
  maxLength,
}: ChatInputCharacterCountProps) {
  if (count === 0) return null;

  const isNearLimit = maxLength && count > maxLength * 0.8;
  const isOverLimit = maxLength && count > maxLength;

  return (
    <AnimatePresence>
      <motion.div
        className="absolute bottom-3 right-4 z-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
      >
        <motion.span
          className={`text-xs font-medium px-2 py-1 rounded-lg backdrop-blur-sm ${
            isOverLimit
              ? 'text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-900/30'
              : isNearLimit
              ? 'text-orange-600 dark:text-orange-400 bg-orange-50/80 dark:bg-orange-900/30'
              : 'text-gray-500 dark:text-slate-400 bg-white/60 dark:bg-slate-700/60'
          }`}
          animate={{
            scale: isOverLimit ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 0.5,
            repeat: isOverLimit ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          {count}
          {maxLength && ` / ${maxLength}`}
        </motion.span>
      </motion.div>
    </AnimatePresence>
  );
}
