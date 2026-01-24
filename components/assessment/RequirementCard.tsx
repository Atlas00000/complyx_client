'use client';

import { motion } from 'framer-motion';
import { RequirementStatus } from '@/lib/api/complianceApi';
import RequirementStatusIndicator from './RequirementStatusIndicator';
import RequirementProgressBar from './RequirementProgressBar';

interface RequirementCardProps {
  requirement: RequirementStatus;
  onRequirementClick?: (requirement: RequirementStatus) => void;
  index: number;
}

/**
 * RequirementCard Component
 * 
 * Enhanced requirement card with:
 * - Glassmorphism effects
 * - Interactive hover effects
 * - Smooth animations
 * - Dynamic styling based on status
 */
export default function RequirementCard({ 
  requirement, 
  onRequirementClick,
  index 
}: RequirementCardProps) {
  const getStatusGradient = (compliant: boolean, mandatory: boolean) => {
    if (compliant) return 'from-emerald-500/20 via-emerald-500/10 to-transparent';
    if (mandatory) return 'from-red-500/20 via-red-500/10 to-transparent';
    return 'from-amber-500/20 via-amber-500/10 to-transparent';
  };

  const getBorderColor = (compliant: boolean, mandatory: boolean) => {
    if (compliant) return 'border-emerald-500/30';
    if (mandatory) return 'border-red-500/30';
    return 'border-amber-500/30';
  };

  return (
    <motion.div
      className={`group relative p-5 rounded-2xl backdrop-blur-sm bg-white/50 dark:bg-slate-700/50 border-2 ${getBorderColor(requirement.compliant, requirement.mandatory)} cursor-pointer transition-all duration-300 ${
        onRequirementClick ? 'hover:scale-[1.02] hover:shadow-xl' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => onRequirementClick?.(requirement)}
      whileHover={{ y: -4 }}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getStatusGradient(requirement.compliant, requirement.mandatory)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-bold text-gray-900 dark:text-slate-100 text-lg">
                {requirement.code}
              </span>
              <RequirementStatusIndicator 
                compliant={requirement.compliant} 
                mandatory={requirement.mandatory} 
              />
            </div>
            <h4 className="text-base font-semibold text-gray-900 dark:text-slate-100 mb-2">
              {requirement.title}
            </h4>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-3">
          <RequirementProgressBar 
            score={requirement.score}
            compliant={requirement.compliant}
          />
        </div>
        
        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-slate-400">
          <span>
            {requirement.answeredQuestions} / {requirement.totalQuestions} questions answered
          </span>
          <span className="font-semibold">
            {requirement.score.toFixed(0)}%
          </span>
        </div>
      </div>
      
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(circle, ${requirement.compliant ? '#10B981' : requirement.mandatory ? '#EF4444' : '#F59E0B'}10 0%, transparent 70%)`,
        }}
      />
    </motion.div>
  );
}
