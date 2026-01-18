'use client';

import { useState, useEffect } from 'react';

interface ProgressTrackerProps {
  progress: number; // 0-100
  answeredCount: number;
  totalCount: number;
  answeredQuestions?: Array<{
    questionId: string;
    question: string;
    answer: string;
    timestamp: Date;
  }>;
  onReviseAnswer?: (questionId: string) => void;
  estimatedTimeRemaining?: number; // minutes
  showDetails?: boolean;
  categoryProgress?: Array<{
    category: string;
    answered: number;
    total: number;
    progress: number;
  }>;
}

/**
 * Enhanced Progress Tracker with answer revision and detailed progress feedback
 */
export default function ProgressTracker({
  progress,
  answeredCount,
  totalCount,
  answeredQuestions = [],
  onReviseAnswer,
  estimatedTimeRemaining,
  showDetails = false,
  categoryProgress = [],
}: ProgressTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [previousProgress, setPreviousProgress] = useState(progress);

  // Track progress changes for animations
  useEffect(() => {
    setPreviousProgress(progress);
  }, [progress]);

  const formatTime = (minutes?: number): string => {
    if (!minutes) return '';
    if (minutes < 60) return `~${Math.ceil(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.ceil(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const getProgressColor = (progress: number): string => {
    if (progress < 33) return 'bg-red-500';
    if (progress < 66) return 'bg-yellow-500';
    if (progress < 100) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Main Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">
              Assessment Progress
            </span>
            {estimatedTimeRemaining && (
              <span className="text-xs text-gray-500">
                {formatTime(estimatedTimeRemaining)} remaining
              </span>
            )}
          </div>
          <span className="text-sm text-gray-600">
            {answeredCount} / {totalCount} questions
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`${getProgressColor(progress)} h-3 rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">
            {progress}% Complete
          </span>
          {showDetails && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isExpanded ? 'Hide Details' : 'Show Details'}
            </button>
          )}
        </div>
      </div>

      {/* Category Progress (if available) */}
      {categoryProgress.length > 0 && isExpanded && (
        <div className="mb-3 pt-3 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Progress by Category</h4>
          <div className="space-y-2">
            {categoryProgress.map((cat) => (
              <div key={cat.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{cat.category}</span>
                  <span className="text-gray-500">
                    {cat.answered} / {cat.total}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`${getProgressColor(cat.progress)} h-1.5 rounded-full transition-all duration-300`}
                    style={{ width: `${cat.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Answer History with Revision (if available) */}
      {answeredQuestions.length > 0 && isExpanded && onReviseAnswer && (
        <div className="pt-3 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Your Answers</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {answeredQuestions.slice(-10).reverse().map((qa) => (
              <div
                key={qa.questionId}
                className="flex items-start justify-between p-2 bg-gray-50 rounded text-xs hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-gray-700 font-medium truncate mb-1">
                    {qa.question}
                  </p>
                  <p className="text-gray-600 truncate">
                    {typeof qa.answer === 'string' ? qa.answer : JSON.stringify(qa.answer)}
                  </p>
                </div>
                <button
                  onClick={() => onReviseAnswer(qa.questionId)}
                  className="ml-2 px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors whitespace-nowrap"
                  title="Revise this answer"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
          {answeredQuestions.length > 10 && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Showing last 10 answers
            </p>
          )}
        </div>
      )}

      {/* Progress Milestones */}
      {isExpanded && (
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span className={progress >= 25 ? 'text-green-600 font-semibold' : ''}>
              {progress >= 25 ? '✓' : '○'} 25% - Started
            </span>
            <span className={progress >= 50 ? 'text-green-600 font-semibold' : ''}>
              {progress >= 50 ? '✓' : '○'} 50% - Halfway
            </span>
            <span className={progress >= 75 ? 'text-green-600 font-semibold' : ''}>
              {progress >= 75 ? '✓' : '○'} 75% - Almost Done
            </span>
            <span className={progress >= 100 ? 'text-green-600 font-semibold' : ''}>
              {progress >= 100 ? '✓' : '○'} 100% - Complete
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Hook for tracking assessment progress
 */
export function useProgressTracker(
  answeredCount: number,
  totalCount: number,
  options: {
    updateInterval?: number; // milliseconds
  } = {}
) {
  const { updateInterval = 1000 } = options;
  
  const [progress, setProgress] = useState(0);
  const [previousCount, setPreviousCount] = useState(0);

  useEffect(() => {
    // Calculate progress
    const newProgress = totalCount > 0 ? Math.min(100, Math.round((answeredCount / totalCount) * 100)) : 0;
    
    // Animate progress if changed
    if (answeredCount !== previousCount) {
      setPreviousCount(answeredCount);
      setProgress(newProgress);
    }
  }, [answeredCount, totalCount, previousCount]);

  // Calculate estimated time remaining (simple heuristic: 1-2 min per question)
  const remainingQuestions = totalCount - answeredCount;
  const avgTimePerQuestion = 1.5; // minutes
  const estimatedTimeRemaining = remainingQuestions * avgTimePerQuestion;

  return {
    progress,
    answeredCount,
    totalCount,
    estimatedTimeRemaining,
    remainingQuestions,
  };
}
