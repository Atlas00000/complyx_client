'use client';

import { type Question } from '@/lib/api/questionApi';

interface QuestionCardProps {
  question: Question;
  onAnswer: (value: string) => void;
}

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const handleAnswer = (value: string) => {
    onAnswer(value);
  };

  const parseOptions = (options: string | null): string[] => {
    if (!options) return [];
    try {
      return JSON.parse(options);
    } catch {
      return [];
    }
  };

  const options = parseOptions(question.options);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
            IFRS {question.ifrsStandard}
          </span>
          <span className="text-xs text-gray-500 capitalize">{question.category.name}</span>
        </div>
        <p className="text-gray-900 font-medium">{question.text}</p>
        {question.requirement && (
          <p className="text-xs text-gray-500 mt-1">{question.requirement}</p>
        )}
      </div>

      <div className="space-y-2">
        {question.type === 'yes_no' && (
          <div className="flex gap-2">
            <button
              onClick={() => handleAnswer('yes')}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Yes
            </button>
            <button
              onClick={() => handleAnswer('no')}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
            >
              No
            </button>
          </div>
        )}

        {question.type === 'multiple_choice' && options.length > 0 && (
          <div className="space-y-2">
            {options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {question.type === 'text' && (
          <div className="space-y-2">
            <textarea
              placeholder="Type your answer..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  const value = (e.currentTarget as HTMLTextAreaElement).value.trim();
                  if (value) {
                    handleAnswer(value);
                    (e.currentTarget as HTMLTextAreaElement).value = '';
                  }
                }
              }}
            />
            <button
              onClick={() => {
                const textarea = document.querySelector('textarea');
                const value = textarea?.value.trim();
                if (value) {
                  handleAnswer(value);
                  if (textarea) textarea.value = '';
                }
              }}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Submit Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
