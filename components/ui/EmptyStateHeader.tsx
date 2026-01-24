'use client';

import { motion } from 'framer-motion';

interface EmptyStateHeaderProps {
  title: string;
}

/**
 * EmptyStateHeader Component
 * 
 * Enhanced header with:
 * - Gradient text
 * - Animated title
 * - Smooth entrance
 */
export default function EmptyStateHeader({ title }: EmptyStateHeaderProps) {
  return (
    <motion.h3
      className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-dark to-accent"
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {title}
    </motion.h3>
  );
}
