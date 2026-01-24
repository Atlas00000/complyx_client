'use client';

import { motion } from 'framer-motion';

/**
 * EmptyStateVisual Component
 * 
 * Animated geometric shapes with:
 * - Floating orbs
 * - Rotating shapes
 * - Gradient effects
 * - No clip art or emojis
 */
export default function EmptyStateVisual() {
  return (
    <div className="relative w-64 h-64 mx-auto mb-8">
      {/* Central orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-primary via-primary-dark to-accent rounded-full transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          boxShadow: '0 0 60px rgba(6, 95, 70, 0.4)',
        }}
      />
      
      {/* Orbiting circles */}
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-br from-accent via-primary to-secondary rounded-full transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            rotate: [0, 360],
            x: [0, Math.cos((index * 2 * Math.PI) / 3) * 80],
            y: [0, Math.sin((index * 2 * Math.PI) / 3) * 80],
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 6 + index,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            boxShadow: `0 0 30px rgba(20, 184, 166, 0.3)`,
          }}
        />
      ))}
      
      {/* Floating particles */}
      {[
        { x: [0, 50, 0], y: [0, 30, 0], left: '20%', top: '20%' },
        { x: [0, -40, 0], y: [0, 50, 0], left: '60%', top: '30%' },
        { x: [0, 30, 0], y: [0, -40, 0], left: '40%', top: '60%' },
        { x: [0, -50, 0], y: [0, -30, 0], left: '70%', top: '70%' },
        { x: [0, 40, 0], y: [0, 40, 0], left: '30%', top: '80%' },
      ].map((particle, index) => (
        <motion.div
          key={index}
          className="absolute w-3 h-3 bg-primary rounded-full"
          animate={{
            x: particle.x,
            y: particle.y,
            opacity: [0.3, 0.7, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 4 + index * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            left: particle.left,
            top: particle.top,
          }}
        />
      ))}
      
      {/* Geometric lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <motion.circle
          cx="50%"
          cy="50%"
          r="100"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#065F46" stopOpacity="1" />
            <stop offset="100%" stopColor="#14B8A6" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
