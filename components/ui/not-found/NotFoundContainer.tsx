'use client';

import { motion } from 'framer-motion';
import NotFoundBackground from './NotFoundBackground';
import NotFoundVisual from './NotFoundVisual';
import NotFoundMessage from './NotFoundMessage';
import NotFoundActions from './NotFoundActions';

/**
 * NotFoundContainer Component
 * 
 * Complete 404 page container with:
 * - Animated background
 * - 404 visual display
 * - Message text
 * - Action buttons
 * - Smooth entrance animations
 */
interface NotFoundContainerProps {
  title?: string;
  description?: string;
}

export default function NotFoundContainer({
  title = 'Page Not Found',
  description = "The page you're looking for doesn't exist or has been moved.",
}: NotFoundContainerProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <NotFoundBackground />
      
      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center gap-8 md:gap-12 px-4 py-12 max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* 404 Visual */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <NotFoundVisual />
        </motion.div>
        
        {/* Message */}
        <NotFoundMessage title={title} description={description} />
        
        {/* Actions */}
        <NotFoundActions />
      </motion.div>
      
      {/* Additional floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-primary/20 dark:bg-primary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.sin(i) * 30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}
