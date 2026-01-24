'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface DeleteConfirmationProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * DeleteConfirmation Component
 * 
 * Enhanced delete confirmation dialog with:
 * - Glassmorphism effects
 * - Smooth animations
 * - Better visual hierarchy
 */
export default function DeleteConfirmation({
  isVisible,
  onConfirm,
  onCancel,
}: DeleteConfirmationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden z-30"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glassmorphism background */}
          <div
            className="absolute inset-0 backdrop-blur-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
            }}
          />
          
          {/* Dark mode background */}
          <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-slate-800/90 via-slate-800/80 to-slate-800/90 backdrop-blur-xl" />
          
          {/* Red accent border */}
          <div className="absolute inset-0 rounded-2xl border-2 border-red-400/50 dark:border-red-500/50" />
          
          {/* Content */}
          <div className="relative z-10 p-5">
            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-4">
              Delete this chat?
            </p>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={onConfirm}
                className="px-4 py-2 text-xs font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Delete
              </motion.button>
              <motion.button
                onClick={onCancel}
                className="px-4 py-2 text-xs font-semibold bg-white/60 dark:bg-slate-600/60 text-gray-700 dark:text-slate-200 rounded-xl hover:bg-white/80 dark:hover:bg-slate-500/80 transition-colors backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
