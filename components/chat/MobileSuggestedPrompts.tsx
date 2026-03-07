'use client';

import { suggestedPrompts, type SuggestedPrompt } from '@/data/promptTemplates';

interface MobileSuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  maxPrompts?: number;
  visible?: boolean;
}

/**
 * MobileSuggestedPrompts
 *
 * Suggested prompt buttons for mobile. No Framer Motion.
 */
export default function MobileSuggestedPrompts({
  onSelectPrompt,
  maxPrompts = 4,
  visible = true,
}: MobileSuggestedPromptsProps) {
  if (!visible) return null;

  const prompts = suggestedPrompts.slice(0, maxPrompts);

  const handleClick = (prompt: SuggestedPrompt) => {
    onSelectPrompt(prompt.prompt);
  };

  return (
    <div className="flex-shrink-0 px-4 py-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50/80 dark:bg-slate-800/80">
      <p className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-2">Suggested</p>
      <div className="flex flex-wrap gap-2">
        {prompts.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handleClick(p)}
            className="px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {p.title}
          </button>
        ))}
      </div>
    </div>
  );
}
