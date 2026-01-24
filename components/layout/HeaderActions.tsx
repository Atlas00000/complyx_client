'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface HeaderActionsProps {
  children: ReactNode;
  position?: 'left' | 'right';
}

/**
 * HeaderActions Component
 * 
 * Enhanced action buttons container with:
 * - Glassmorphism effects
 * - Smooth animations
 * - Staggered entrance
 */
export default function HeaderActions({ children, position = 'right' }: HeaderActionsProps) {
  return (
    <motion.div
      className={`flex items-center gap-2 ${position === 'left' ? 'hidden md:flex' : ''}`}
      initial={{ opacity: 0, x: position === 'right' ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}
