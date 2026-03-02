'use client';

export type AssessmentEntryVariant = 'start' | 'resume' | 'start_another' | 'login';

interface AssessmentEntryChipProps {
  variant: AssessmentEntryVariant;
  onStart: () => void;
  onResume: () => void;
  disabled?: boolean;
  className?: string;
}

const LABELS: Record<AssessmentEntryVariant, string> = {
  start: 'Start assessment',
  resume: 'Resume assessment',
  start_another: 'Start another assessment',
  login: 'Log in to start an assessment',
};

/**
 * Compact chip shown in the chat area to always offer a way to start or resume an assessment.
 * Uses plain button (no Framer Motion) to ensure reliable click handling.
 */
export default function AssessmentEntryChip({
  variant,
  onStart,
  onResume,
  disabled = false,
  className = '',
}: AssessmentEntryChipProps) {
  const isResume = variant === 'resume';
  const label = LABELS[variant];
  const handleClick = () => {
    if (isResume) onResume();
    else onStart();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`
        inline-flex items-center justify-center gap-1.5 h-8 px-3 text-sm font-semibold
        rounded-lg border transition-colors cursor-pointer
        bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200
        border-gray-200 dark:border-slate-600
        hover:bg-gray-200 dark:hover:bg-slate-600
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
      {label}
    </button>
  );
}
