'use client';

interface AssessmentProgressIndicatorProps {
  currentIndex: number; // 1-based (e.g. question 3 of 8 → currentIndex 3)
  total: number;
  label?: string; // e.g. "Question" (default)
  compact?: boolean; // inline text-only for chat message area
}

/**
 * In-chat assessment progress: "Question 3 of 8" with optional thin bar.
 * Use compact for inline use in chat UI.
 */
export default function AssessmentProgressIndicator({
  currentIndex,
  total,
  label = 'Question',
  compact = false,
}: AssessmentProgressIndicatorProps) {
  const progress = total > 0 ? Math.round((currentIndex / total) * 100) : 0;

  if (compact) {
    return (
      <span className="text-xs text-gray-500 dark:text-slate-400 whitespace-nowrap">
        {label} {currentIndex} of {total}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-gray-100 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700">
      <span className="text-sm font-medium text-gray-700 dark:text-slate-300 whitespace-nowrap">
        {label} {currentIndex} of {total}
      </span>
      <div className="flex-1 min-w-0 max-w-[120px] h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
