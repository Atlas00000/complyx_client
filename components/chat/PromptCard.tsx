'use client';

import { motion } from 'framer-motion';
import { type SuggestedPrompt } from '@/data/promptTemplates';
import PromptIcon from './PromptIcon';

interface PromptCardProps {
  prompt: SuggestedPrompt;
  onClick: () => void;
  index: number;
}

/**
 * PromptCard Component
 * 
 * Stunning prompt card with:
 * - Glassmorphism effects
 * - Dynamic hover animations
 * - Gradient overlays
 * - Smooth transitions
 * - Not boxed - organic rounded design
 */
export default function PromptCard({ prompt, onClick, index }: PromptCardProps) {
  const getCategoryGradient = (category: SuggestedPrompt['category']) => {
    switch (category) {
      case 'overview':
        return 'from-blue-500/20 via-blue-400/15 to-transparent dark:from-blue-500/30 dark:via-blue-400/20';
      case 'compliance':
        return 'from-primary/20 via-primary-light/15 to-transparent dark:from-primary/30 dark:via-primary-light/20';
      case 'requirements':
        return 'from-purple-500/20 via-purple-400/15 to-transparent dark:from-purple-500/30 dark:via-purple-400/20';
      case 'assessment':
        return 'from-orange-500/20 via-orange-400/15 to-transparent dark:from-orange-500/30 dark:via-orange-400/20';
      case 'guidance':
        return 'from-accent/20 via-accent-light/15 to-transparent dark:from-accent/30 dark:via-accent-light/20';
      default:
        return 'from-gray-500/20 via-gray-400/15 to-transparent dark:from-gray-500/30 dark:via-gray-400/20';
    }
  };

  const getCategoryBorder = (category: SuggestedPrompt['category']) => {
    switch (category) {
      case 'overview':
        return 'border-blue-400/30 dark:border-blue-500/40';
      case 'compliance':
        return 'border-primary/30 dark:border-primary/40';
      case 'requirements':
        return 'border-purple-400/30 dark:border-purple-500/40';
      case 'assessment':
        return 'border-orange-400/30 dark:border-orange-500/40';
      case 'guidance':
        return 'border-accent/30 dark:border-accent/40';
      default:
        return 'border-gray-400/30 dark:border-gray-500/40';
    }
  };

  return (
    <motion.button
      onClick={onClick}
      className="relative group text-left"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glassmorphism container */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* Frosted glass background */}
        <div
          className="absolute inset-0 backdrop-blur-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
          }}
        />
        
        {/* Dark mode glass */}
        <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-slate-800/80 via-slate-800/70 to-slate-800/80 backdrop-blur-xl" />
        
        {/* Category gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(prompt.category)}`} />
        
        {/* Animated shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
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
        
        {/* Border with category color */}
        <div className={`absolute inset-0 rounded-2xl border-2 ${getCategoryBorder(prompt.category)}`} />
        
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent dark:from-white/5" />
        
        {/* Content */}
        <div className="relative z-10 p-5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <PromptIcon category={prompt.category} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-1 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                {prompt.title}
              </h4>
            </div>
          </div>
        </div>
        
        {/* Enhanced shadow with category color */}
        <div className={`absolute -inset-1 bg-gradient-to-br ${getCategoryGradient(prompt.category)} rounded-2xl blur-lg opacity-40 -z-10 group-hover:opacity-60 transition-opacity`} />
      </div>
    </motion.button>
  );
}
