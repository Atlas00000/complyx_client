'use client';

import type { CompletionSummaryResponse } from '@/lib/api/inChatAssessmentApi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AssessmentCompletionSummaryProps {
  summary: CompletionSummaryResponse;
  onStartAnother?: () => void;
  /** Optional href for "View on Dashboard" (e.g. /dashboard?assessmentId=xxx). */
  dashboardHref?: string;
}

/**
 * Displays completion summary: overall score, readiness band, category breakdown, gaps, and summary text.
 */
export default function AssessmentCompletionSummary({
  summary,
  onStartAnother,
  dashboardHref,
}: AssessmentCompletionSummaryProps) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-primary/5 dark:bg-primary/10">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
          Assessment complete
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">{summary.overallPercentage}%</span>
          <span className="text-sm text-gray-600 dark:text-slate-400">
            ({summary.readinessBand})
          </span>
        </div>
        {summary.readinessBandMessage && (
          <p className="mt-1.5 text-sm text-gray-600 dark:text-slate-400">
            {summary.readinessBandMessage}
          </p>
        )}
      </div>

      <div className="p-4 space-y-4">
        {summary.categoryScores.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              By pillar
            </h4>
            <ul className="space-y-1.5">
              {summary.categoryScores.map((c) => (
                <li
                  key={c.category}
                  className="flex justify-between text-sm text-gray-700 dark:text-slate-300"
                >
                  <span>{c.category}</span>
                  <span className="font-medium">{c.percentage}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {summary.gaps.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-2">
              Areas to improve (&lt;50%)
            </h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-slate-400">
              {summary.gaps.map((g, i) => (
                <li key={i}>
                  {g.category && <span className="font-medium">{g.category}</span>}
                  {g.questionText && (
                    <span className="block truncate mt-0.5">{g.questionText}</span>
                  )}
                  {g.percentage != null && (
                    <span className="text-xs text-gray-500"> ({g.percentage}%)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {summary.summaryText && (
          <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
            <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-slate-300">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary.summaryText}</ReactMarkdown>
            </div>
          </div>
        )}

        {(dashboardHref || onStartAnother) && (
          <div className="pt-3 flex flex-wrap items-center gap-3">
            {dashboardHref && (
              <a
                href={dashboardHref}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors underline"
              >
                View on Dashboard
              </a>
            )}
            {onStartAnother && (
              <button
                type="button"
                onClick={onStartAnother}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Start another assessment
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
