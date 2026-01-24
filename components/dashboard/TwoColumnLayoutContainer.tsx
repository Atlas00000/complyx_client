'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TwoColumnLayoutContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * TwoColumnLayoutContainer Component
 * 
 * Creates a stunning two-column layout container with:
 * - Glassmorphism effects
 * - Animated gradient backgrounds
 * - Smooth transitions
 * - Enhanced spacing
 */
export default function TwoColumnLayoutContainer({ 
  children, 
  className = '' 
}: TwoColumnLayoutContainerProps) {
  return (
    <motion.div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
