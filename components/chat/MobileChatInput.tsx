'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ChatInputContainer from './ChatInputContainer';
import ChatInputField from './ChatInputField';
import ChatInputCharacterCount from './ChatInputCharacterCount';

export interface MobileChatInputProps {
  onSend: (message: string) => void;
  onFileUpload?: (file: File) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
  fixed?: boolean; // Whether to use fixed positioning (default: true)
}

/**
 * MobileChatInput Component
 * 
 * Mobile-optimized chat input with:
 * - Touch-friendly controls
 * - Mobile keyboard handling
 * - Auto-resize textarea
 * - Safe area insets support
 * - Optimized for mobile viewports
 */
const MobileChatInput = ({
  onSend,
  onFileUpload,
  placeholder = 'Type your message...',
  maxLength = 2000,
  disabled = false,
  className = '',
  fixed = true,
}: MobileChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // On mobile, allow Enter to send (no Shift+Enter needed)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
    // Reset input
    e.target.value = '';
  };

  return (
    <motion.div
      className={`mobile-chat-input ${fixed ? 'fixed' : 'relative'} bottom-0 left-0 right-0 z-40 ${className}`}
      initial={{ y: fixed ? 100 : 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={fixed ? {
        paddingBottom: `calc(env(safe-area-inset-bottom) + 64px)`,
      } : {
        marginTop: '1rem',
      }}
    >
      <ChatInputContainer onSubmit={handleSubmit}>
        <div className="flex items-end gap-2 w-full">
          {/* File upload button - mobile optimized */}
          {onFileUpload && (
            <label className="flex-shrink-0 touch-manipulation">
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                disabled={disabled}
              />
              <motion.button
                type="button"
                className="p-2.5 rounded-xl backdrop-blur-md bg-white/60 dark:bg-slate-700/60 border border-white/30 dark:border-slate-600/50 text-gray-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-600/80 transition-all duration-200 active:scale-95"
                whileTap={{ scale: 0.9 }}
                disabled={disabled}
                aria-label="Upload file"
              >
                <svg
                  className="w-5 h-5"
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
              </motion.button>
            </label>
          )}

          {/* Text input - mobile optimized */}
          <div className="flex-1 relative">
            <ChatInputField
              value={message}
              onChange={(value) => setMessage(value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
            />
          </div>

          {/* Send button - mobile optimized */}
          <motion.button
            type="submit"
            disabled={!message.trim() || disabled}
            className="flex-shrink-0 p-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 touch-manipulation"
            whileTap={{ scale: 0.9 }}
            aria-label="Send message"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h8"
              />
            </svg>
          </motion.button>
        </div>

        {/* Character count - mobile optimized */}
        {maxLength && (
          <div className="mt-1 px-2">
            <ChatInputCharacterCount
              count={message.length}
              maxLength={maxLength}
            />
          </div>
        )}
      </ChatInputContainer>
    </motion.div>
  );
};

export default MobileChatInput;
