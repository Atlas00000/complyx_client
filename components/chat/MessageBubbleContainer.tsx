'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MessageBubbleContainerProps {
  children: ReactNode;
  isUser: boolean;
  isHighlighted?: boolean;
  className?: string;
}

/**
 * MessageBubbleContainer Component
 * 
 * Creates a stunning container for message bubbles with:
 * - Glassmorphism effects for AI messages
 * - Dynamic gradients for user messages
 * - Enhanced shadows and depth
 * - Smooth hover animations
 * - Not boxed - more organic, rounded shapes
 */
export default function MessageBubbleContainer({
  children,
  isUser,
  isHighlighted = false,
  className = '',
}: MessageBubbleContainerProps) {
  if (isUser) {
    // User message with dynamic gradient
    return (
      <motion.div
        className={`relative max-w-[85%] ${className}`}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Gradient background with animated shimmer */}
        <div className="relative rounded-3xl overflow-hidden">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary/90" />
          
          {/* Animated shimmer overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: 'linear',
            }}
          />
          
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-3xl" />
          
          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
          
          {/* Enhanced shadow with color */}
          <div className="absolute -inset-1 bg-gradient-to-br from-primary/40 to-accent/30 rounded-3xl blur-xl opacity-60 -z-10" />
        </div>
        
        {/* Highlight ring */}
        {isHighlighted && (
          <motion.div
            className="absolute -inset-2 rounded-3xl border-2 border-warning ring-4 ring-warning/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    );
  }

  // AI message with glassmorphism
  return (
    <motion.div
      className={`relative max-w-[85%] ${className}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.01, y: -2 }}
    >
      {/* Glassmorphism container */}
      <div className="relative rounded-3xl overflow-hidden">
        {/* Frosted glass background */}
        <div
          className="absolute inset-0 backdrop-blur-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
          }}
        />
        
        {/* Dark mode glass */}
        <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-slate-800/90 via-slate-800/80 to-slate-800/90 backdrop-blur-xl" />
        
        {/* Subtle border with gradient */}
        <div className="absolute inset-0 rounded-3xl border border-white/40 dark:border-slate-700/50" />
        
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 dark:from-primary/10 dark:via-transparent dark:to-accent/10" />
        
        {/* Subtle shadow effect */}
        <div className="absolute -inset-1 bg-gradient-to-br from-gray-200/50 to-gray-300/30 dark:from-slate-700/50 dark:to-slate-600/30 rounded-3xl blur-lg opacity-50 -z-10" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
      
      {/* Highlight ring */}
      {isHighlighted && (
        <motion.div
          className="absolute -inset-2 rounded-3xl border-2 border-warning ring-4 ring-warning/20"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}
