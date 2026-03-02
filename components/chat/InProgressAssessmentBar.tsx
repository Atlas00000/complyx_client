'use client';

interface InProgressAssessmentBarProps {
  currentIndex: number;
  total: number;
  onChangeType: () => void;
  className?: string;
}

/**
 * Compact bar shown when an in-chat assessment is in progress.
 * Lets the user see they are in an assessment and offers "Change type".
 */
export default function InProgressAssessmentBar({
  currentIndex,
  total,
  onChangeType,
  className = '',
}: InProgressAssessmentBarProps) {
  return (
    <div
      className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 text-sm ${className}`}
      role="status"
      aria-label={`Assessment in progress, question ${currentIndex} of ${total}`}
    >
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        key={`${currentIndex}-${total}`}
      >
        Question {currentIndex} of {total}
      </div>
      <span className="text-gray-700 dark:text-slate-300 font-medium">
        Assessment in progress
        <span className="text-gray-500 dark:text-slate-400 font-normal ml-1">
          · Question {currentIndex} of {total}
        </span>
      </span>
      <button
        type="button"
        onClick={onChangeType}
        className="text-primary hover:underline font-medium shrink-0"
      >
        Change type
      </button>
    </div>
  );
}
