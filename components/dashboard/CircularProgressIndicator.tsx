'use client';

import { motion } from 'framer-motion';

interface CircularProgressIndicatorProps {
  score: number;
  size?: number;
  animatedScore: number;
}

/**
 * CircularProgressIndicator Component
 * 
 * Enhanced circular progress with:
 * - Animated SVG gradients
 * - Dynamic color based on score
 * - Glow effects
 * - Smooth animations
 */
export default function CircularProgressIndicator({
  score,
  size = 240,
  animatedScore,
}: CircularProgressIndicatorProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return '#10B981'; // emerald-500
    if (score >= 40) return '#F59E0B'; // amber-500
    return '#EF4444'; // red-500
  };

  const getScoreGradient = (score: number) => {
    if (score >= 70) return ['#10B981', '#059669', '#047857']; // emerald gradient
    if (score >= 40) return ['#F59E0B', '#D97706', '#B45309']; // amber gradient
    return ['#EF4444', '#DC2626', '#B91C1C']; // red gradient
  };

  const color = getScoreColor(score);
  const gradient = getScoreGradient(score);
  const circumference = 2 * Math.PI * (size / 2 - 15);
  const offset = circumference - (score / 100) * circumference;
  const radius = size / 2 - 15;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* SVG Container */}
      <motion.div
        className="relative"
        initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Gradient definitions */}
          <defs>
            <linearGradient id={`progress-gradient-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradient[0]} stopOpacity="1" />
              <stop offset="50%" stopColor={gradient[1]} stopOpacity="1" />
              <stop offset="100%" stopColor={gradient[2]} stopOpacity="1" />
            </linearGradient>
            
            {/* Glow filter */}
            <filter id={`glow-${score}`}>
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(229, 231, 235, 0.3)"
            strokeWidth="24"
            className="dark:stroke-slate-700/50"
          />
          
          {/* Animated progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#progress-gradient-${score})`}
            strokeWidth="24"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: 'easeOut' }}
            strokeLinecap="round"
            filter={`url(#glow-${score})`}
            style={{
              strokeDasharray: circumference,
            }}
          />
          
          {/* Animated pulse ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeOpacity="0.3"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </svg>
      </motion.div>
      
      {/* Center content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Score number with gradient text */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <span
            className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${gradient[0]}, ${gradient[2]})`,
            }}
          >
            {Math.round(animatedScore)}
          </span>
          
          {/* Glow effect behind number */}
          <motion.div
            className="absolute inset-0 blur-xl"
            style={{
              background: `linear-gradient(135deg, ${gradient[0]}40, ${gradient[2]}40)`,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
        
        {/* Percentage label */}
        <motion.span
          className="text-sm font-medium text-gray-600 dark:text-slate-400 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          % Ready
        </motion.span>
      </div>
    </div>
  );
}
