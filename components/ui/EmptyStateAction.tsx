'use client';

import { motion } from 'framer-motion';
import Button from './Button';

interface EmptyStateActionProps {
  label: string;
  onClick: () => void;
}

/**
 * EmptyStateAction Component
 * 
 * Enhanced action button with:
 * - Gradient styling
 * - Animated effects
 * - Hover interactions
 */
export default function EmptyStateAction({ label, onClick }: EmptyStateActionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-8"
    >
      <Button
        variant="primary"
        size="large"
        onClick={onClick}
        className="relative overflow-hidden group"
      >
        <span className="relative z-10">{label}</span>
        
        {/* Animated shimmer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: 'linear',
          }}
        />
      </Button>
    </motion.div>
  );
}
