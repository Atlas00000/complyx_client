'use client';

import { motion } from 'framer-motion';
import { type SuggestedPrompt } from '@/data/promptTemplates';

interface PromptCategoryBadgeProps {
  category: SuggestedPrompt['category'];
}

/**
 * PromptCategoryBadge Component
 * 
 * Subtle category indicator badge
 * with animated gradient effects.
 */
export default function PromptCategoryBadge({ category }: PromptCategoryBadgeProps) {
  const getCategoryLabel = (category: SuggestedPrompt['category']) => {
    switch (category) {
      case 'overview':
        return 'Overview';
      case 'compliance':
        return 'Compliance';
      case 'requirements':
        return 'Requirements';
      case 'assessment':
        return 'Assessment';
      case 'guidance':
        return 'Guidance';
      default:
        return '';
    }
  };

  const getCategoryStyles = (category: SuggestedPrompt['category']) => {
    switch (category) {
      case 'overview':
        return 'bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-400/30 dark:border-blue-500/40';
      case 'compliance':
        return 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light border-primary/30 dark:border-primary/40';
      case 'requirements':
        return 'bg-purple-500/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border-purple-400/30 dark:border-purple-500/40';
      case 'assessment':
        return 'bg-orange-500/10 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 border-orange-400/30 dark:border-orange-500/40';
      case 'guidance':
        return 'bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent-light border-accent/30 dark:border-accent/40';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300 border-gray-400/30 dark:border-gray-500/40';
    }
  };

  return (
    <motion.span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getCategoryStyles(category)}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {getCategoryLabel(category)}
    </motion.span>
  );
}
