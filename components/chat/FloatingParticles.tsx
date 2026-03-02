'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

/**
 * FloatingParticles Component
 * 
 * Creates subtle floating geometric particles/shapes
 * that add visual interest without being distracting.
 * Uses Forest Green & Slate color scheme.
 */

interface Particle {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

export default function FloatingParticles({ count = 8 }: { count?: number }) {
  // Use deterministic values to avoid hydration mismatch (server vs client)
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const seed = (i * 13 + 7) % 100;
      const seed2 = (i * 17 + 11) % 100;
      return {
        id: i,
        size: (seed % 40) / 10 + 2, // 2-6px
        x: seed,
        y: seed2,
        duration: 15 + (seed % 10),
        delay: seed2 % 5,
      };
    });
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full dark:bg-primary/20"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: 'rgba(6, 95, 70, 0.15)',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particle.delay,
          }}
        />
      ))}
      
      {/* Subtle geometric shapes */}
      <motion.div
        className="absolute top-1/4 left-1/3 w-1 h-16 bg-primary/10 dark:bg-primary/20 rounded-full"
        animate={{
          rotate: [0, 360],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-16 h-1 bg-accent/10 dark:bg-accent/20 rounded-full"
        animate={{
          rotate: [360, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      <motion.div
        className="absolute top-2/3 left-2/3 w-12 h-12 border border-primary/10 dark:border-primary/20 rounded-lg"
        animate={{
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
