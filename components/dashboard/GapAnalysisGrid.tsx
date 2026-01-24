'use client';

import { motion } from 'framer-motion';
import GapCard from './GapCard';

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

interface GapAnalysisGridProps {
  gaps: Gap[];
  onGapClick?: (gap: Gap) => void;
  title: string;
}

/**
 * GapAnalysisGrid Component
 * 
 * Responsive grid layout for gaps with:
 * - Smooth animations
 * - Staggered entrance
 */
export default function GapAnalysisGrid({ 
  gaps, 
  onGapClick,
  title 
}: GapAnalysisGridProps) {
  if (gaps.length === 0) return null;

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h4
        className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {title}
      </motion.h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gaps.map((gap, index) => (
          <GapCard
            key={gap.requirementId}
            gap={gap}
            onGapClick={onGapClick}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
}
