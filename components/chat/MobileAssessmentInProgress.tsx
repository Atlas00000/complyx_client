'use client';

import type { InChatQuestion } from '@/stores/inChatAssessmentStore';
import type { Question } from '@/lib/api/questionApi';
import { questionToPayload, isRichQuestionType } from '@/lib/utils/assessmentBlock';
import AssessmentProgressIndicator from './AssessmentProgressIndicator';
import InProgressAssessmentBar from './InProgressAssessmentBar';
import AssessmentQuestionBubble from './AssessmentQuestionBubble';
import QuestionCard from './QuestionCard';
import InChatAssessmentSkipButton from './InChatAssessmentSkipButton';

interface MobileAssessmentInProgressProps {
  currentQuestion: InChatQuestion | null;
  totalQuestions: number;
  totalAnswered: number;
  onAnswer: (value: string) => void;
  onSkip: () => void;
  onChangeType: () => void;
  error?: string | null;
}

function questionToCardFormat(q: InChatQuestion): Question {
  return {
    id: q.id,
    text: q.text,
    type: q.type,
    options: q.options,
    order: q.order,
    category: { id: '', name: q.categoryName, description: null },
    ifrsStandard: 'S1',
    requirement: null,
    weight: 1,
    phase: 'quick',
    isActive: true,
    skipLogic: null,
  };
}

/**
 * MobileAssessmentInProgress
 *
 * Progress bar, current question, skip, and "Change type" for mobile. No motion.
 */
export default function MobileAssessmentInProgress({
  currentQuestion,
  totalQuestions,
  totalAnswered,
  onAnswer,
  onSkip,
  onChangeType,
  error,
}: MobileAssessmentInProgressProps) {
  const currentIndex = totalAnswered + 1;

  return (
    <div className="flex-shrink-0 space-y-2 px-4 py-2 border-t border-gray-200 dark:border-slate-700 bg-gray-50/80 dark:bg-slate-800/80">
      <AssessmentProgressIndicator
        currentIndex={currentIndex}
        total={totalQuestions}
        label="Question"
      />
      <InProgressAssessmentBar
        currentIndex={currentIndex}
        total={totalQuestions}
        onChangeType={onChangeType}
      />
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      {currentQuestion && (
        <div className="space-y-2">
          {isRichQuestionType(currentQuestion.type) ? (
            <AssessmentQuestionBubble
              payload={questionToPayload(currentQuestion)}
              onAnswer={onAnswer}
            />
          ) : (
            <QuestionCard
              question={questionToCardFormat(currentQuestion)}
              onAnswer={onAnswer}
            />
          )}
          <InChatAssessmentSkipButton onSkip={onSkip} label="I don't know" />
          <button
            type="button"
            onClick={onChangeType}
            className="text-sm text-gray-500 dark:text-slate-400 underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
          >
            Change assessment type
          </button>
        </div>
      )}
    </div>
  );
}
