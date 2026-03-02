'use client';

interface AssessmentContextHintProps {
  className?: string;
  /** When 'completed', shows copy that reflects a finished assessment. */
  variant?: 'default' | 'completed';
}

/**
 * Shown when the user is logged in so they know the chat may use their assessment to personalize answers.
 */
export default function AssessmentContextHint({
  className = '',
  variant = 'default',
}: AssessmentContextHintProps) {
  const isCompleted = variant === 'completed';
  const copy = isCompleted
    ? 'Your assessment results are used to personalize responses'
    : 'Using your assessment to personalize responses when relevant';
  const title = isCompleted
    ? 'Your completed assessment results are used to tailor responses.'
    : 'Your latest assessment results may be used to tailor responses when relevant.';

  return (
    <p
      className={`text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1.5 ${className}`}
      title={title}
    >
      <span aria-hidden className="text-primary/70">
        ●
      </span>
      {copy}
    </p>
  );
}
