'use client';

import type { AssessmentType, MicroTopic } from '@/stores/inChatAssessmentStore';
import { useInChatAssessmentStore } from '@/stores/inChatAssessmentStore';

interface MobileAssessmentSelectionProps {
  onStartAssessment: () => Promise<void>;
  disabled?: boolean;
}

const TYPES: Array<{ type: AssessmentType; label: string }> = [
  { type: 'quick', label: 'Quick' },
  { type: 'micro', label: 'Micro' },
  { type: 'full', label: 'Full' },
];

const TOPICS: Array<{ topic: MicroTopic; label: string }> = [
  { topic: 'governance', label: 'Governance' },
  { topic: 'strategy', label: 'Strategy' },
  { topic: 'risk', label: 'Risk' },
  { topic: 'metrics', label: 'Metrics & Targets' },
];

/**
 * MobileAssessmentSelection
 *
 * Type and topic selection for mobile. Uses useInChatAssessmentStore.
 * No Framer Motion.
 */
export default function MobileAssessmentSelection({
  onStartAssessment,
  disabled = false,
}: MobileAssessmentSelectionProps) {
  const { step, assessmentType, setAssessmentType, setStep, chooseTopic, error } =
    useInChatAssessmentStore();

  const handleTypeSelect = async (type: AssessmentType) => {
    setAssessmentType(type);
    if (type === 'micro') {
      setStep('choose_topic');
    } else {
      await onStartAssessment();
    }
  };

  const handleTopicSelect = async (topic: MicroTopic) => {
    chooseTopic(topic);
    await onStartAssessment();
  };

  if (step === 'choose_type') {
    return (
      <div className="p-4 space-y-4">
        <p className="text-sm text-gray-600 dark:text-slate-400">
          Which assessment would you like?
        </p>
        <div className="flex flex-wrap gap-2">
          {TYPES.map(({ type, label }) => (
            <button
              key={type}
              type="button"
              disabled={disabled}
              onClick={() => handleTypeSelect(type)}
              className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100 font-medium border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              {label}
            </button>
          ))}
        </div>
        {error && (
          <p className="text-sm text-red-500 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (step === 'choose_topic' && assessmentType === 'micro') {
    return (
      <div className="p-4 space-y-4">
        <p className="text-sm text-gray-600 dark:text-slate-400">
          Which topic would you like to focus on?
        </p>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map(({ topic, label }) => (
            <button
              key={topic}
              type="button"
              disabled={disabled}
              onClick={() => handleTopicSelect(topic)}
              className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100 font-medium border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              {label}
            </button>
          ))}
        </div>
        {error && (
          <p className="text-sm text-red-500 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  return null;
}
