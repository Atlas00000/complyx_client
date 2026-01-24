'use client';

import { ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInputActionsProps {
  isValid: boolean;
  onSend: () => void;
  onFileUpload?: (file: File) => void;
  disabled?: boolean;
}

/**
 * ChatInputActions Component
 * 
 * Enhanced action buttons with:
 * - Animated send button
 * - Glassmorphism file upload
 * - Smooth state transitions
 * - Enhanced hover effects
 */
export default function ChatInputActions({
  isValid,
  onSend,
  onFileUpload,
  disabled = false,
}: ChatInputActionsProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
      e.target.value = '';
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* File Upload Button */}
      {onFileUpload && (
        <motion.label
          className="relative cursor-pointer p-3.5 rounded-2xl overflow-hidden group"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Glassmorphism background */}
          <div
            className="absolute inset-0 backdrop-blur-md"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
            }}
          />
          
          {/* Dark mode glass */}
          <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-slate-700/80 via-slate-700/70 to-slate-700/80 backdrop-blur-md" />
          
          {/* Border */}
          <div className="absolute inset-0 rounded-2xl border-2 border-white/40 dark:border-slate-600/50" />
          
          {/* Content */}
          <div className="relative z-10">
            <input
              type="file"
              onChange={handleFileChange}
              disabled={disabled}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
            />
            <svg
              className="w-5 h-5 text-gray-700 dark:text-slate-300 group-hover:text-primary dark:group-hover:text-primary-light transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </div>
          
          {/* Shadow */}
          <div className="absolute -inset-1 bg-gradient-to-br from-gray-200/30 to-gray-300/20 dark:from-slate-700/30 dark:to-slate-600/20 rounded-2xl blur-lg opacity-40 -z-10 group-hover:opacity-60 transition-opacity" />
        </motion.label>
      )}
      
      {/* Send Button */}
      <motion.button
        type="submit"
        disabled={!isValid || disabled}
        className="relative p-4 rounded-2xl overflow-hidden group"
        whileHover={isValid ? { scale: 1.1, y: -2 } : {}}
        whileTap={isValid ? { scale: 0.95 } : {}}
        onClick={() => {
          if (isValid && !disabled) {
            onSend();
          }
        }}
      >
        {/* Gradient background */}
        <div
          className={`absolute inset-0 transition-opacity ${
            isValid
              ? 'bg-gradient-to-br from-primary via-primary-dark to-accent opacity-100'
              : 'bg-gradient-to-br from-gray-400 to-gray-500 opacity-50'
          }`}
        />
        
        {/* Animated shimmer */}
        {isValid && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
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
        )}
        
        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
        
        {/* Icon */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {isValid ? (
              <motion.svg
                key="send"
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ x: -5, opacity: 0, scale: 0.8 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: 5, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h8"
                />
              </motion.svg>
            ) : (
              <motion.svg
                key="disabled"
                className="w-5 h-5 text-white/70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h8"
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </div>
        
        {/* Enhanced shadow */}
        <div
          className={`absolute -inset-1 rounded-2xl blur-xl -z-10 transition-opacity ${
            isValid
              ? 'bg-gradient-to-br from-primary/40 to-accent/30 opacity-70 group-hover:opacity-90'
              : 'bg-gradient-to-br from-gray-400/20 to-gray-500/20 opacity-30'
          }`}
        />
      </motion.button>
    </div>
  );
}
