'use client';

import { motion } from 'framer-motion';
import type { MicroTopic } from '@/stores/inChatAssessmentStore';
import Button from '@/components/ui/Button';

interface AssessmentTopicSelectorProps {
  onSelect: (topic: MicroTopic) => void;
  disabled?: boolean;
}

const topics: Array<{ topic: MicroTopic; label: string }> = [
  { topic: 'governance', label: 'Governance' },
  { topic: 'strategy', label: 'Strategy' },
  { topic: 'risk', label: 'Risk' },
  { topic: 'metrics', label: 'Metrics & Targets' },
];

export default function AssessmentTopicSelector({ onSelect, disabled }: AssessmentTopicSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
        Which topic would you like to focus on?
      </p>
      <div className="flex flex-wrap gap-2">
        {topics.map(({ topic, label }, index) => (
          <motion.div
            key={topic}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Button
              variant="secondary"
              size="medium"
              disabled={disabled}
              onClick={() => onSelect(topic)}
              className="min-w-[100px]"
            >
              {label}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
