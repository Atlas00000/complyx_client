'use client';

import Button from '@/components/ui/Button';

interface InChatAssessmentSkipButtonProps {
  onSkip: () => void;
  disabled?: boolean;
  label?: string; // e.g. "Skip" or "I don't know"
}

/**
 * Button to skip the current assessment question. Submits a canonical "skip" value.
 */
export default function InChatAssessmentSkipButton({
  onSkip,
  disabled,
  label = "I don't know",
}: InChatAssessmentSkipButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="small"
      disabled={disabled}
      onClick={onSkip}
      className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300"
    >
      {label}
    </Button>
  );
}
