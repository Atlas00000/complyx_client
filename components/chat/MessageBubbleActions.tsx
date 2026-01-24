'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface MessageBubbleActionsProps {
  isUser: boolean;
  isHovered: boolean;
  isCopied: boolean;
  isRegenerating: boolean;
  onCopy: () => void;
  onEdit?: () => void;
  onRegenerate?: () => void;
  showEdit?: boolean;
  showRegenerate?: boolean;
}

/**
 * MessageBubbleActions Component
 * 
 * Enhanced action buttons with:
 * - Glassmorphism effects
 * - Smooth animations
 * - Better hover states
 * - Icon transitions
 */
export default function MessageBubbleActions({
  isUser,
  isHovered,
  isCopied,
  isRegenerating,
  onCopy,
  onEdit,
  onRegenerate,
  showEdit = false,
  showRegenerate = false,
}: MessageBubbleActionsProps) {
  if (!isHovered && !isCopied) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`absolute top-4 ${isUser ? 'left-4' : 'right-4'} flex gap-2 z-20`}
      >
        {/* Edit button - User messages */}
        {isUser && showEdit && onEdit && (
          <motion.button
            onClick={onEdit}
            className={`
              p-2.5 rounded-xl
              backdrop-blur-md
              bg-white/25 dark:bg-slate-700/60
              border border-white/30 dark:border-slate-600/50
              text-white
              shadow-lg shadow-primary/20
              transition-all duration-200
              hover:bg-white/35 dark:hover:bg-slate-600/70
              hover:shadow-xl hover:shadow-primary/30
            `}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            title="Edit message"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </motion.button>
        )}
        
        {/* Regenerate button - AI messages */}
        {!isUser && showRegenerate && onRegenerate && (
          <motion.button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className={`
              p-2.5 rounded-xl
              backdrop-blur-md
              bg-white/80 dark:bg-slate-700/80
              border border-gray-200/50 dark:border-slate-600/50
              text-gray-700 dark:text-slate-200
              shadow-lg
              transition-all duration-200
              hover:bg-white dark:hover:bg-slate-600
              hover:shadow-xl
              ${isRegenerating ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            whileHover={!isRegenerating ? { scale: 1.1, y: -2 } : {}}
            whileTap={!isRegenerating ? { scale: 0.95 } : {}}
            title={isRegenerating ? 'Regenerating...' : 'Regenerate response'}
          >
            {isRegenerating ? (
              <motion.svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </motion.svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </motion.button>
        )}
        
        {/* Copy button */}
        <motion.button
          onClick={onCopy}
          className={`
            p-2.5 rounded-xl
            backdrop-blur-md
            ${isUser 
              ? isCopied
                ? 'bg-secondary text-white border-secondary/50'
                : 'bg-white/25 dark:bg-slate-700/60 border-white/30 dark:border-slate-600/50 text-white'
              : isCopied
                ? 'bg-secondary text-white border-secondary/50'
                : 'bg-white/80 dark:bg-slate-700/80 border-gray-200/50 dark:border-slate-600/50 text-gray-700 dark:text-slate-200'
            }
            border shadow-lg
            transition-all duration-200
            hover:shadow-xl
            ${isCopied ? 'hover:bg-secondary-dark' : isUser ? 'hover:bg-white/35 dark:hover:bg-slate-600/70' : 'hover:bg-white dark:hover:bg-slate-600'}
          `}
          whileHover={!isCopied ? { scale: 1.1, y: -2 } : {}}
          whileTap={{ scale: 0.95 }}
          title={isCopied ? 'Copied!' : 'Copy message'}
        >
          <AnimatePresence mode="wait">
            {isCopied ? (
              <motion.svg
                key="check"
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </motion.svg>
            ) : (
              <motion.svg
                key="copy"
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
