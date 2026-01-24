'use client';

import { useRef, useEffect, useState, ChangeEvent, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';

interface ChatInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

/**
 * ChatInputField Component
 * 
 * Enhanced textarea with:
 * - Glassmorphism styling
 * - Dynamic focus effects
 * - Animated borders
 * - Gradient glows
 */
export default function ChatInputField({
  value,
  onChange,
  onKeyDown,
  placeholder = 'Type your message...',
  disabled = false,
  onFocus,
  onBlur,
}: ChatInputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 120;
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [value]);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  return (
    <div className="flex-1 relative">
      <motion.div
        className="relative rounded-3xl overflow-hidden"
        animate={{
          scale: isFocused ? 1.01 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Glassmorphism background */}
        <div
          className="absolute inset-0 backdrop-blur-md"
          style={{
            background: isFocused
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
          }}
        />
        
        {/* Dark mode glass */}
        <div
          className={`hidden dark:block absolute inset-0 ${
            isFocused
              ? 'bg-gradient-to-br from-slate-700/90 via-slate-700/85 to-slate-700/90 backdrop-blur-md'
              : 'bg-gradient-to-br from-slate-700/80 via-slate-700/70 to-slate-700/80 backdrop-blur-md'
          }`}
        />
        
        {/* Focus gradient overlay */}
        {isFocused && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent dark:from-primary/15 dark:via-accent/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        {/* Animated border */}
        <motion.div
          className={`absolute inset-0 rounded-3xl border-2 ${
            isFocused
              ? 'border-primary/50 dark:border-primary/60'
              : 'border-white/40 dark:border-slate-600/50'
          }`}
          animate={{
            boxShadow: isFocused
              ? '0 0 20px rgba(6, 95, 70, 0.3), 0 0 40px rgba(20, 184, 166, 0.2)'
              : '0 0 0px rgba(6, 95, 70, 0), 0 0 0px rgba(20, 184, 166, 0)',
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/10 pointer-events-none" />
        
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="relative z-10 w-full px-5 py-4 pr-14 bg-transparent resize-none focus:outline-none disabled:cursor-not-allowed text-body text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-400"
          style={{ minHeight: '56px' }}
        />
        
        {/* Enhanced shadow */}
        <div
          className={`absolute -inset-1 rounded-3xl blur-xl -z-10 transition-opacity ${
            isFocused
              ? 'bg-gradient-to-br from-primary/30 to-accent/20 opacity-60'
              : 'bg-gradient-to-br from-gray-200/20 to-gray-300/20 dark:from-slate-700/20 dark:to-slate-600/20 opacity-40'
          }`}
        />
      </motion.div>
    </div>
  );
}
