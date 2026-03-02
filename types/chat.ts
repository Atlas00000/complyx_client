/**
 * Chat message and assessment question block types for rich message UI.
 */

export type AssessmentQuestionType = 'multiple_choice' | 'yes_no' | 'scale' | 'text';

export interface AssessmentOption {
  value: string;
  label?: string;
  score?: number;
}

export interface AssessmentQuestionPayload {
  questionId: string;
  text: string;
  questionType: AssessmentQuestionType;
  categoryName?: string;
  options?: AssessmentOption[] | string[];
  scaleMin?: number;
  scaleMax?: number;
}

export type ChatMessageType = 'text' | 'assessment_question';

export interface AssessmentQuestionMessage {
  type: 'assessment_question';
  payload: AssessmentQuestionPayload;
}

export interface TextMessage {
  type: 'text';
  content: string;
}

export type RichMessage = TextMessage | AssessmentQuestionMessage;
