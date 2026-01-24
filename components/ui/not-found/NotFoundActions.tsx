'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';

/**
 * NotFoundActions Component
 * 
 * Interactive action buttons with:
 * - Glassmorphism design
 * - Hover animations
 * - Smooth transitions
 * - Icon support
 */
export default function NotFoundActions() {
  const router = useRouter();

  const actions = [
    {
      label: 'Go Home',
      variant: 'primary' as const,
      onClick: () => router.push('/'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'Go Back',
      variant: 'secondary' as const,
      onClick: () => window.history.back(),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      ),
    },
  ];

  return (
    <motion.div
      className="flex items-center justify-center gap-4 flex-wrap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      {actions.map((action, index) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant={action.variant}
            size="large"
            onClick={action.onClick}
            className="relative overflow-hidden group"
          >
            {/* Button glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-20 blur-xl"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            
            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
              {action.icon}
              {action.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
}
