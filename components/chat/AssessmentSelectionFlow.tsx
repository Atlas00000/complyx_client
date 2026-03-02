'use client';

import { useInChatAssessmentStore } from '@/stores/inChatAssessmentStore';
import AssessmentTypeSelector from './AssessmentTypeSelector';
import AssessmentTopicSelector from './AssessmentTopicSelector';

interface AssessmentSelectionFlowProps {
  onStartAssessment: () => Promise<void>;
  disabled?: boolean;
}

/**
 * Renders type selector (Quick/Micro/Full) and topic selector (for Micro).
 * Calls onStartAssessment when type is chosen (Quick/Full) or topic is chosen (Micro).
 */
export default function AssessmentSelectionFlow({
  onStartAssessment,
  disabled,
}: AssessmentSelectionFlowProps) {
  const { step, assessmentType, setAssessmentType, setStep, chooseTopic, error } =
    useInChatAssessmentStore();

  const handleTypeSelect = async (type: 'quick' | 'micro' | 'full') => {
    setAssessmentType(type);
    if (type === 'micro') {
      setStep('choose_topic');
    } else {
      await onStartAssessment();
    }
  };

  const handleTopicSelect = async (topic: 'governance' | 'strategy' | 'risk' | 'metrics') => {
    chooseTopic(topic);
    await onStartAssessment();
  };

  if (step === 'choose_type') {
    return (
      <div className="space-y-2">
        <AssessmentTypeSelector onSelect={handleTypeSelect} disabled={disabled} />
        {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
      </div>
    );
  }

  if (step === 'choose_topic' && assessmentType === 'micro') {
    return (
      <div className="space-y-2">
        <AssessmentTopicSelector onSelect={handleTopicSelect} disabled={disabled} />
        {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
      </div>
    );
  }

  return null;
}
