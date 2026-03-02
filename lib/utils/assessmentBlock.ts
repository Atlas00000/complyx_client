import type { AssessmentQuestionPayload, AssessmentOption } from '@/types/chat';

export interface InChatQuestionLike {
  id: string;
  text: string;
  type: string;
  options: string | null;
  categoryName: string;
}

/**
 * Build AssessmentQuestionPayload from API question for AssessmentQuestionBubble.
 */
export function questionToPayload(q: InChatQuestionLike): AssessmentQuestionPayload {
  const questionType = q.type as AssessmentQuestionPayload['questionType'];
  let options: AssessmentOption[] | undefined;
  if (questionType === 'multiple_choice' && q.options) {
    try {
      const parsed = JSON.parse(q.options) as Array<{ value?: string; label?: string; score?: number }>;
      options = parsed.map((o) => ({
        value: String(o.value ?? o.label ?? ''),
        label: o.label != null ? String(o.label) : undefined,
        score: typeof o.score === 'number' ? o.score : undefined,
      }));
    } catch {
      options = [];
    }
  }
  return {
    questionId: q.id,
    text: q.text,
    questionType: questionType ?? 'text',
    categoryName: q.categoryName,
    options,
    scaleMin: 1,
    scaleMax: 5,
  };
}

const RICH_TYPES = ['multiple_choice', 'yes_no', 'scale'];

export function isRichQuestionType(type: string): boolean {
  return RICH_TYPES.includes(type);
}
