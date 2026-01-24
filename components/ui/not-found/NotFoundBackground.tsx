'use client';

import { motion } from 'framer-motion';

/**
 * NotFoundBackground Component
 * 
 * Animated background for 404 page with:
 * - Dynamic gradient orbs
 * - Floating geometric shapes
 * - Particle effects
 * - Mesh gradients
 */
export default function NotFoundBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-primary/5 to-accent/10 dark:from-slate-900 dark:via-primary/10 dark:to-accent/15" />
      
      {/* Large animated orbs */}
      <motion.div
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/15 dark:bg-primary/25 rounded-full blur-3xl"
        animate={{
          x: [0, 150, 0],
          y: [0, 100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-accent/15 dark:bg-accent/25 rounded-full blur-3xl"
        animate={{
          x: [0, -150, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Floating geometric shapes */}
      {Array.from({ length: 8 }).map((_, i) => {
        const size = 40 + Math.random() * 60;
        const delay = i * 0.3;
        return (
          <motion.div
            key={i}
            className="absolute rounded-2xl border-2 border-primary/20 dark:border-primary/30 backdrop-blur-sm bg-white/10 dark:bg-slate-800/10"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${(i * 12.5) % 100}%`,
              top: `${(i * 15) % 100}%`,
              rotate: i * 45,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.sin(i) * 30, 0],
              rotate: [i * 45, i * 45 + 180, i * 45 + 360],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Infinity,
              delay,
              ease: 'easeInOut',
            }}
          />
        );
      })}
      
      {/* Mesh gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-primary/5 to-transparent dark:via-primary/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/3 to-transparent dark:via-accent/5" />
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-primary/40 dark:bg-primary/50 rounded-full"
            style={{
              left: `${(i * 3.33) % 100}%`,
              top: `${(i * 3.33) % 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.sin(i) * 20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 2, 1],
            }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}
