const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export type AssessmentType = 'quick' | 'micro' | 'full';
export type MicroTopic = 'governance' | 'strategy' | 'risk' | 'metrics';

export interface InChatQuestion {
  id: string;
  text: string;
  type: string;
  options: string | null;
  order: number;
  categoryName: string;
}

export interface StartAssessmentResponse {
  assessmentId: string;
  totalQuestions: number;
  firstQuestion: InChatQuestion | null;
  assessmentType: AssessmentType;
  microTopic?: MicroTopic;
}

export interface SubmitAnswerResponse {
  assessmentId: string;
  nextQuestion: InChatQuestion | null;
  progress: number;
  completed: boolean;
  totalAnswered: number;
  totalQuestions: number;
}

export interface AssessmentStatusResponse {
  assessmentId: string;
  status: string;
  progress: number;
  assessmentType: AssessmentType;
  microTopic?: MicroTopic;
  totalQuestions: number;
  totalAnswered: number;
  completed: boolean;
  currentQuestion: InChatQuestion | null;
}

export interface CompletionSummaryResponse {
  assessmentId: string;
  overallPercentage: number;
  readinessBand: string;
  readinessBandMessage?: string;
  categoryScores: Array<{ category: string; percentage: number; questionCount: number }>;
  gaps: Array<{ type: string; category?: string; questionText?: string; percentage?: number }>;
  summaryText: string;
}

export async function startInChatAssessment(params: {
  userId: string;
  sessionId?: string;
  assessmentType: AssessmentType;
  microTopic?: MicroTopic;
}): Promise<StartAssessmentResponse> {
  const res = await fetch(`${API_URL}/api/assessment/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export async function submitInChatAnswer(params: {
  assessmentId: string;
  questionId: string;
  value: string;
}): Promise<SubmitAnswerResponse> {
  const res = await fetch(`${API_URL}/api/assessment/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export async function getInChatAssessmentStatus(
  assessmentId: string
): Promise<AssessmentStatusResponse> {
  const res = await fetch(`${API_URL}/api/assessment/status/${assessmentId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export async function getInChatAssessmentSummary(
  assessmentId: string
): Promise<CompletionSummaryResponse> {
  const res = await fetch(`${API_URL}/api/assessment/summary/${assessmentId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}
