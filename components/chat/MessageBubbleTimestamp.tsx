'use client';

import { motion } from 'framer-motion';

interface MessageBubbleTimestampProps {
  timestamp?: Date | string;
  status?: 'sending' | 'sent' | 'delivered' | 'error';
  isUser: boolean;
}

/**
 * MessageBubbleTimestamp Component
 * 
 * Elegant timestamp display with status indicator
 * and smooth animations.
 */
export default function MessageBubbleTimestamp({
  timestamp,
  status = 'sent',
  isUser,
}: MessageBubbleTimestampProps) {
  const formatTime = (date?: Date | string): string => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return '';
    
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(dateObj);
  };

  return (
    <motion.div
      className={`flex items-center justify-end gap-2 mt-4 text-xs ${
        isUser 
          ? 'text-white/70' 
          : 'text-gray-500 dark:text-slate-400'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {timestamp && (
        <span className="font-medium">{formatTime(timestamp)}</span>
      )}
      {isUser && status === 'sending' && (
        <motion.span
          className="flex items-center gap-1"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
          <span className="text-[10px]">Sending</span>
        </motion.span>
      )}
    </motion.div>
  );
}
