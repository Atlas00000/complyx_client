'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassmorphismContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * GlassmorphismContainer Component
 * 
 * Creates a frosted glass effect with backdrop blur
 * and subtle borders. Modern, elegant, and not boxed.
 */
export default function GlassmorphismContainer({
  children,
  className = '',
}: GlassmorphismContainerProps) {
  return (
    <motion.div
      className={`
        relative
        backdrop-blur-xl
        bg-white/60 dark:bg-slate-800/60
        border border-white/20 dark:border-slate-700/30
        rounded-3xl
        shadow-xl
        shadow-primary/5 dark:shadow-primary/10
        ${className}
      `}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%)',
      }}
    >
      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 dark:from-primary/10 dark:via-transparent dark:to-accent/10 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
