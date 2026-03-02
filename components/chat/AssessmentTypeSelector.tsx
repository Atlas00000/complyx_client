'use client';

import { motion } from 'framer-motion';
import type { AssessmentType } from '@/stores/inChatAssessmentStore';
import Button from '@/components/ui/Button';

interface AssessmentTypeSelectorProps {
  onSelect: (type: AssessmentType) => void;
  disabled?: boolean;
}

const types: Array<{ type: AssessmentType; label: string }> = [
  { type: 'quick', label: 'Quick' },
  { type: 'micro', label: 'Micro' },
  { type: 'full', label: 'Full' },
];

export default function AssessmentTypeSelector({ onSelect, disabled }: AssessmentTypeSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
        Which assessment would you like?
      </p>
      <div className="flex flex-wrap gap-2">
        {types.map(({ type, label }, index) => (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Button
              variant="secondary"
              size="medium"
              disabled={disabled}
              onClick={() => onSelect(type)}
              className="min-w-[90px]"
            >
              {label}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
