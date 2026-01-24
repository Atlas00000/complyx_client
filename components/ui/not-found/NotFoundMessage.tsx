'use client';

import { motion } from 'framer-motion';

/**
 * NotFoundMessage Component
 * 
 * Animated message text with:
 * - Gradient heading
 * - Smooth fade-in
 * - Staggered text animation
 */
interface NotFoundMessageProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function NotFoundMessage({
  title = 'Page Not Found',
  description = "The page you're looking for doesn't exist or has been moved.",
  className = '',
}: NotFoundMessageProps) {
  return (
    <motion.div
      className={`text-center space-y-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Title */}
      <motion.h2
        className="text-3xl md:text-4xl lg:text-5xl font-bold"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
          style={{
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {title}
        </span>
      </motion.h2>
      
      {/* Description */}
      <motion.p
        className="text-lg md:text-xl text-gray-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        {description}
      </motion.p>
      
      {/* Decorative line */}
      <motion.div
        className="w-24 h-1 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      />
    </motion.div>
  );
}
