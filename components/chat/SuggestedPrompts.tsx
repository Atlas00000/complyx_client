'use client';

import { suggestedPrompts, type SuggestedPrompt } from '@/data/promptTemplates';

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  visible?: boolean;
  maxPrompts?: number;
}

export default function SuggestedPrompts({
  onSelectPrompt,
  visible = true,
  maxPrompts = 6,
}: SuggestedPromptsProps) {
  if (!visible) return null;

  const promptsToShow = suggestedPrompts.slice(0, maxPrompts);

  const handlePromptClick = (prompt: SuggestedPrompt) => {
    onSelectPrompt(prompt.prompt);
  };

  const getCategoryIcon = (category: SuggestedPrompt['category']) => {
    switch (category) {
      case 'overview':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'compliance':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'requirements':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'assessment':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'guidance':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getCategoryColor = (category: SuggestedPrompt['category']) => {
    switch (category) {
      case 'overview':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case 'compliance':
        return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
      case 'requirements':
        return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
      case 'assessment':
        return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100';
      case 'guidance':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4">
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Suggested Questions</h3>
          <p className="text-xs text-gray-500">Click any prompt to get started</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {promptsToShow.map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => handlePromptClick(prompt)}
              className={`p-3 rounded-lg border-2 transition-all text-left group ${getCategoryColor(prompt.category)}`}
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex-shrink-0">
                  {getCategoryIcon(prompt.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium mb-1 group-hover:underline">{prompt.title}</h4>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
