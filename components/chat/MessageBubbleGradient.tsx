'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MessageBubbleGradientProps {
  children: ReactNode;
  isUser: boolean;
}

/**
 * MessageBubbleGradient Component
 * 
 * Adds animated gradient overlays to message bubbles
 * for enhanced visual depth and interest.
 */
export default function MessageBubbleGradient({
  children,
  isUser,
}: MessageBubbleGradientProps) {
  if (!isUser) return <>{children}</>;

  return (
    <div className="relative">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/20 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
