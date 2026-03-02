'use client';

import type { AssessmentQuestionPayload, AssessmentOption } from '@/types/chat';

interface AssessmentQuestionBubbleProps {
  payload: AssessmentQuestionPayload;
  onAnswer: (value: string) => void;
  disabled?: boolean;
}

function parseOptions(
  options: AssessmentQuestionPayload['options']
): Array<{ value: string; label: string }> {
  if (!options || !Array.isArray(options)) return [];
  return options.map((o) => {
    if (typeof o === 'string') return { value: o, label: o };
    const opt = o as AssessmentOption;
    return { value: opt.value, label: opt.label ?? opt.value };
  });
}

/**
 * Rich assessment question bubble: MC, Yes/No, or Scale (1–5).
 * Renders as assistant-style bubble with inline choices.
 */
export default function AssessmentQuestionBubble({
  payload,
  onAnswer,
  disabled,
}: AssessmentQuestionBubbleProps) {
  const { questionId, text, questionType, categoryName, options, scaleMin = 1, scaleMax = 5 } = payload;
  const parsedOptions = parseOptions(options);

  return (
    <div
      className="rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] w-fit bg-gray-100 dark:bg-slate-700/80 border border-gray-200 dark:border-slate-600 shadow-sm"
      data-question-id={questionId}
    >
      {categoryName && (
        <span className="text-xs font-medium text-primary dark:text-primary-light uppercase tracking-wide">
          {categoryName}
        </span>
      )}
      <p className="mt-1 mb-3 text-gray-900 dark:text-slate-100 font-medium">{text}</p>

      {questionType === 'yes_no' && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onAnswer('Yes')}
            disabled={disabled}
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => onAnswer('No')}
            disabled={disabled}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-slate-200 text-sm font-medium hover:bg-gray-300 dark:hover:bg-slate-500 disabled:opacity-50 transition-colors"
          >
            No
          </button>
        </div>
      )}

      {questionType === 'multiple_choice' && parsedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {parsedOptions.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onAnswer(opt.value)}
              disabled={disabled}
              className="px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-sm text-left hover:border-primary dark:hover:border-primary/60 hover:bg-primary/5 dark:hover:bg-primary/10 disabled:opacity-50 transition-colors"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {questionType === 'scale' && (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: scaleMax - scaleMin + 1 }, (_, i) => scaleMin + i).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onAnswer(String(n))}
              disabled={disabled}
              className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-sm font-medium hover:border-primary dark:hover:border-primary/60 hover:bg-primary/5 disabled:opacity-50 transition-colors"
            >
              {n}
            </button>
          ))}
        </div>
      )}

      {questionType === 'text' && (
        <p className="text-sm text-gray-500 dark:text-slate-400 italic">
          Type your answer in the input below.
        </p>
      )}
    </div>
  );
}
