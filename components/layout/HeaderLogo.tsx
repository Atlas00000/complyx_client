'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface HeaderLogoProps {
  logo?: ReactNode;
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

/**
 * HeaderLogo Component
 * 
 * Stunning logo/title with:
 * - Animated gradient text
 * - Smooth entrance animations
 * - Interactive hover effects
 */
export default function HeaderLogo({ logo, title = 'Complyx', subtitle, compact = false }: HeaderLogoProps) {
  if (logo) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        whileHover={{ scale: 1.05 }}
        className="flex items-center"
      >
        {logo}
      </motion.div>
    );
  }

  return (
    <motion.div
        className={`flex items-center ${compact ? 'gap-2' : 'gap-3'}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Logo icon/placeholder */}
      <motion.div
        className="relative flex-shrink-0"
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
            <div className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-xl bg-gradient-to-br from-primary via-primary-dark to-accent flex items-center justify-center shadow-lg shadow-primary/20`}>
              <span className={`text-white font-bold ${compact ? 'text-base' : 'text-lg'}`}>C</span>
            </div>
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-primary/30 blur-md"
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
      
      {/* Title and Subtitle */}
      <div className="flex flex-col">
        <motion.h1
          className={`${compact ? 'text-base' : 'text-xl'} font-bold bg-gradient-to-r from-primary via-primary-dark to-accent bg-clip-text text-transparent`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.h1>
        {subtitle && !compact && (
          <motion.p
            className="text-xs text-gray-600 dark:text-slate-400 hidden sm:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
