'use client';

import { ReactNode, FormEvent } from 'react';
import { motion } from 'framer-motion';

interface ChatInputContainerProps {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

/**
 * ChatInputContainer Component
 * 
 * Creates a stunning container with:
 * - Glassmorphism effects
 * - Animated gradient overlays
 * - Smooth border transitions
 * - Enhanced depth
 */
export default function ChatInputContainer({ children, onSubmit }: ChatInputContainerProps) {
  return (
    <motion.form
      onSubmit={onSubmit}
      className="relative w-full overflow-hidden"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Glassmorphism background */}
      <div
        className="absolute inset-0 backdrop-blur-xl"
        style={{
          background: 'linear-gradient(to top, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.5) 100%)',
        }}
      />
      
      {/* Dark mode background */}
      <div className="hidden dark:block absolute inset-0 bg-gradient-to-t from-slate-800/80 via-slate-800/70 to-transparent backdrop-blur-xl" />
      
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 dark:from-primary/10 dark:via-transparent dark:to-accent/10"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Top border with gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent dark:via-primary/40" />
      
      {/* Inner glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent dark:from-primary/10 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.form>
  );
}
