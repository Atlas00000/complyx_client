'use client';

import { motion } from 'framer-motion';

interface GapSeveritySummaryProps {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

/**
 * GapSeveritySummary Component
 * 
 * Enhanced severity summary cards with:
 * - Glassmorphism effects
 * - Animated counters
 * - Gradient backgrounds
 */
export default function GapSeveritySummary({ 
  critical, 
  high, 
  medium, 
  low 
}: GapSeveritySummaryProps) {
  const severities = [
    { label: 'Critical', count: critical, gradient: 'from-red-500 to-red-600', color: '#EF4444' },
    { label: 'High', count: high, gradient: 'from-orange-500 to-orange-600', color: '#F97316' },
    { label: 'Medium', count: medium, gradient: 'from-amber-500 to-amber-600', color: '#F59E0B' },
    { label: 'Low', count: low, gradient: 'from-blue-500 to-blue-600', color: '#3B82F6' },
  ];

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h4 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">
        Gap Summary by Severity
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {severities.map((severity, index) => (
          <motion.div
            key={severity.label}
            className="relative p-5 rounded-2xl backdrop-blur-sm bg-white/50 dark:bg-slate-700/50 border border-white/40 dark:border-slate-600/40 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -4 }}
          >
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${severity.gradient} opacity-10`} />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                  {severity.label}
                </h5>
                <motion.span
                  className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${severity.gradient} text-white shadow-lg`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                >
                  {severity.count}
                </motion.span>
              </div>
              <motion.div
                className={`text-3xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r ${severity.gradient}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                {severity.count}
              </motion.div>
              <div className="text-xs text-gray-600 dark:text-slate-400">
                {severity.count === 1 ? 'gap' : 'gaps'}
              </div>
            </div>
            
            {/* Decorative glow */}
            <div
              className="absolute -inset-1 rounded-2xl blur-xl opacity-20 -z-10"
              style={{
                background: severity.color,
              }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
