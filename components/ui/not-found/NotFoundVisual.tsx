'use client';

import { motion } from 'framer-motion';

/**
 * NotFoundVisual Component
 * 
 * Animated 404 display with:
 * - Large gradient numbers
 * - Floating animation
 * - Glow effects
 * - Interactive hover states
 */
export default function NotFoundVisual() {
  const numbers = ['4', '0', '4'];
  
  return (
    <div className="relative flex items-center justify-center gap-2 md:gap-4">
      {numbers.map((num, index) => (
        <motion.div
          key={index}
          className="relative"
          initial={{ opacity: 0, y: 50, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.6,
            delay: index * 0.1,
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
          whileHover={{
            scale: 1.1,
            y: -10,
            transition: { duration: 0.2 },
          }}
        >
          {/* Number with gradient */}
          <motion.h1
            className="text-8xl md:text-9xl lg:text-[12rem] font-extrabold bg-gradient-to-br from-primary via-accent to-primary bg-clip-text text-transparent"
            style={{
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {num}
          </motion.h1>
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-30 blur-2xl -z-10"
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Floating particles around number */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/50"
              style={{
                left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 40}%`,
                top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 40}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      ))}
      
      {/* Connecting line effect */}
      <motion.div
        className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent -z-20"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </div>
  );
}
