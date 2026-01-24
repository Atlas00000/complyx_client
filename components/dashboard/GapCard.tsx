'use client';

import { motion } from 'framer-motion';
import GapPriorityIndicator from './GapPriorityIndicator';
import GapImpactVisual from './GapImpactVisual';

interface Gap {
  requirementId: string;
  code: string;
  title: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  gap: number;
  score: number;
  mandatory: boolean;
  answeredQuestions: number;
  totalQuestions: number;
  missingAnswers: string[];
  recommendations: string[];
}

interface GapCardProps {
  gap: Gap;
  onGapClick?: (gap: Gap) => void;
  index: number;
}

/**
 * GapCard Component
 * 
 * Enhanced gap card with:
 * - Glassmorphism effects
 * - Interactive hover effects
 * - Smooth animations
 * - Dynamic styling based on severity
 */
export default function GapCard({ 
  gap, 
  onGapClick,
  index 
}: GapCardProps) {
  const getSeverityGradient = (severity: 'critical' | 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'critical':
        return 'from-red-500/20 via-red-500/10 to-transparent';
      case 'high':
        return 'from-orange-500/20 via-orange-500/10 to-transparent';
      case 'medium':
        return 'from-amber-500/20 via-amber-500/10 to-transparent';
      case 'low':
        return 'from-blue-500/20 via-blue-500/10 to-transparent';
    }
  };

  const getBorderColor = (severity: 'critical' | 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'critical':
        return 'border-red-500/30';
      case 'high':
        return 'border-orange-500/30';
      case 'medium':
        return 'border-amber-500/30';
      case 'low':
        return 'border-blue-500/30';
    }
  };

  const getGlowColor = (severity: 'critical' | 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'critical':
        return '#EF4444';
      case 'high':
        return '#F97316';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#3B82F6';
    }
  };

  return (
    <motion.div
      className={`group relative p-5 rounded-2xl backdrop-blur-sm bg-white/50 dark:bg-slate-700/50 border-2 ${getBorderColor(gap.severity)} cursor-pointer transition-all duration-300 ${
        onGapClick ? 'hover:scale-[1.02] hover:shadow-xl' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => onGapClick?.(gap)}
      whileHover={{ y: -4 }}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getSeverityGradient(gap.severity)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="font-bold text-gray-900 dark:text-slate-100 text-lg">
                {gap.code}
              </span>
              <GapPriorityIndicator severity={gap.severity} />
              {gap.mandatory && (
                <motion.span
                  className="px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Mandatory
                </motion.span>
              )}
            </div>
            <h4 className="text-base font-semibold text-gray-900 dark:text-slate-100 mb-3">
              {gap.title}
            </h4>
          </div>
        </div>
        
        {/* Gap Impact Visual */}
        <div className="mb-3">
          <GapImpactVisual gap={gap.gap} severity={gap.severity} />
        </div>
        
        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-slate-400 mb-3">
          <span>
            Gap: {gap.gap.toFixed(0)}% • Score: {gap.score.toFixed(0)}%
          </span>
          {gap.answeredQuestions !== undefined && gap.totalQuestions !== undefined && (
            <span>
              {gap.answeredQuestions} / {gap.totalQuestions} questions
            </span>
          )}
        </div>
        
        {/* Recommendations Preview */}
        {gap.recommendations && gap.recommendations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/20 dark:border-slate-600/30">
            <div className="text-xs font-semibold text-gray-700 dark:text-slate-300 mb-2">
              Recommendations:
            </div>
            <ul className="space-y-1">
              {gap.recommendations.slice(0, 2).map((rec, idx) => (
                <li key={idx} className="text-xs text-gray-600 dark:text-slate-400 flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(circle, ${getGlowColor(gap.severity)}10 0%, transparent 70%)`,
        }}
      />
    </motion.div>
  );
}
