'use client';

import { motion } from 'framer-motion';

interface ReadinessStatusBadgeProps {
  score: number;
}

/**
 * ReadinessStatusBadge Component
 * 
 * Enhanced status badge with:
 * - Dynamic styling based on score
 * - Gradient backgrounds
 * - Animated glow effects
 * - Smooth transitions
 */
export default function ReadinessStatusBadge({ score }: ReadinessStatusBadgeProps) {
  const getStatusConfig = (score: number) => {
    if (score >= 70) {
      return {
        text: 'Ready for Compliance',
        gradient: 'from-emerald-500 via-emerald-600 to-emerald-700',
        bgColor: '#10B981',
        glowColor: '#10B981',
      };
    }
    if (score >= 40) {
      return {
        text: 'Needs Improvement',
        gradient: 'from-amber-500 via-amber-600 to-amber-700',
        bgColor: '#F59E0B',
        glowColor: '#F59E0B',
      };
    }
    return {
      text: 'Critical Gaps Identified',
      gradient: 'from-red-500 via-red-600 to-red-700',
      bgColor: '#EF4444',
      glowColor: '#EF4444',
    };
  };

  const config = getStatusConfig(score);

  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div className="relative">
        {/* Badge container with gradient */}
        <motion.div
          className={`relative px-6 py-3 rounded-full bg-gradient-to-r ${config.gradient} text-white font-semibold text-sm md:text-base shadow-lg`}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
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
          
          {/* Text */}
          <span className="relative z-10">{config.text}</span>
        </motion.div>
        
        {/* Animated glow */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          style={{
            background: `${config.glowColor}40`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </motion.div>
  );
}
