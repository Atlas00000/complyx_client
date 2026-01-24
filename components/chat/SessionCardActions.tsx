'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface SessionCardActionsProps {
  onRename: () => void;
  onDelete: () => void;
  isVisible: boolean;
}

/**
 * SessionCardActions Component
 * 
 * Enhanced action buttons with:
 * - Glassmorphism effects
 * - Smooth animations
 * - Better hover states
 */
export default function SessionCardActions({
  onRename,
  onDelete,
  isVisible,
}: SessionCardActionsProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute top-3 right-3 flex items-center gap-2 z-20"
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* Rename button */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onRename();
            }}
            className="p-2 rounded-xl backdrop-blur-md bg-white/70 dark:bg-slate-700/70 border border-white/40 dark:border-slate-600/50 text-gray-700 dark:text-slate-200 shadow-lg hover:bg-white dark:hover:bg-slate-600 transition-all duration-200 hover:shadow-xl"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            title="Rename"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </motion.button>
          
          {/* Delete button */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 rounded-xl backdrop-blur-md bg-red-500/80 dark:bg-red-600/80 border border-red-400/50 dark:border-red-500/50 text-white shadow-lg hover:bg-red-600 dark:hover:bg-red-700 transition-all duration-200 hover:shadow-xl"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
