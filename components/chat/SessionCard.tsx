'use client';

import { motion } from 'framer-motion';
import { type ChatSession } from '@/stores/sessionStore';

interface SessionCardProps {
  session: ChatSession;
  isActive: boolean;
  onClick: () => void;
  index: number;
  children: React.ReactNode;
}

/**
 * SessionCard Component
 * 
 * Stunning session card with:
 * - Glassmorphism effects
 * - Dynamic hover animations
 * - Active state highlighting
 * - Gradient overlays
 */
export default function SessionCard({
  isActive,
  onClick,
  index,
  children,
}: SessionCardProps) {
  return (
    <motion.div
      onClick={onClick}
      className="relative group cursor-pointer"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: 'easeOut',
      }}
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glassmorphism container */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* Frosted glass background */}
        <div
          className="absolute inset-0 backdrop-blur-xl"
          style={{
            background: isActive
              ? 'linear-gradient(135deg, rgba(6, 95, 70, 0.15) 0%, rgba(20, 184, 166, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%)',
          }}
        />
        
        {/* Dark mode glass */}
        <div
          className={`hidden dark:block absolute inset-0 ${
            isActive
              ? 'bg-gradient-to-br from-primary/25 via-primary/20 to-accent/20 backdrop-blur-xl'
              : 'bg-gradient-to-br from-slate-800/70 via-slate-800/60 to-slate-800/70 backdrop-blur-xl'
          }`}
        />
        
        {/* Active state gradient overlay */}
        {isActive && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/15 to-transparent"
            animate={{
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
        
        {/* Animated shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: 'linear',
          }}
        />
        
        {/* Border with gradient */}
        <div
          className={`absolute inset-0 rounded-2xl border-2 ${
            isActive
              ? 'border-primary/40 dark:border-primary/50'
              : 'border-white/30 dark:border-slate-700/40 group-hover:border-primary/30 dark:group-hover:border-primary/40'
          }`}
        />
        
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent dark:from-white/5" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Enhanced shadow */}
        <div
          className={`absolute -inset-1 rounded-2xl blur-lg opacity-40 -z-10 transition-opacity ${
            isActive
              ? 'bg-gradient-to-br from-primary/30 to-accent/20'
              : 'bg-gradient-to-br from-gray-200/30 to-gray-300/20 dark:from-slate-700/30 dark:to-slate-600/20 group-hover:opacity-60'
          }`}
        />
      </div>
    </motion.div>
  );
}
