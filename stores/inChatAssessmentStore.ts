import { create } from 'zustand';

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

type InChatStep = 'idle' | 'choose_type' | 'choose_topic' | 'in_progress' | 'completed';

interface InChatAssessmentState {
  step: InChatStep;
  assessmentType: AssessmentType | null;
  microTopic: MicroTopic | null;
  assessmentId: string | null;
  totalQuestions: number;
  currentQuestion: InChatQuestion | null;
  progress: number;
  totalAnswered: number;
  completed: boolean;
  error: string | null;

  setStep: (step: InChatStep) => void;
  setAssessmentType: (type: AssessmentType | null) => void;
  setMicroTopic: (topic: MicroTopic | null) => void;
  setAssessmentSession: (params: {
    assessmentId: string;
    totalQuestions: number;
    firstQuestion: InChatQuestion | null;
  }) => void;
  setCurrentQuestion: (q: InChatQuestion | null) => void;
  setProgress: (progress: number, totalAnswered: number, completed: boolean) => void;
  setError: (error: string | null) => void;
  startChoosingType: () => void;
  chooseTopic: (topic: MicroTopic) => void;
  reset: () => void;
}

const initialState = {
  step: 'idle' as InChatStep,
  assessmentType: null as AssessmentType | null,
  microTopic: null as MicroTopic | null,
  assessmentId: null as string | null,
  totalQuestions: 0,
  currentQuestion: null as InChatQuestion | null,
  progress: 0,
  totalAnswered: 0,
  completed: false,
  error: null as string | null,
};

export const useInChatAssessmentStore = create<InChatAssessmentState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step, error: null }),
  setAssessmentType: (assessmentType) => set({ assessmentType, error: null }),
  setMicroTopic: (microTopic) => set({ microTopic, error: null }),
  setAssessmentSession: ({ assessmentId, totalQuestions, firstQuestion }) =>
    set({
      assessmentId,
      totalQuestions,
      currentQuestion: firstQuestion,
      step: 'in_progress',
      progress: 0,
      totalAnswered: 0,
      completed: false,
      error: null,
    }),
  setCurrentQuestion: (currentQuestion) => set({ currentQuestion }),
  setProgress: (progress, totalAnswered, completed) =>
    set({ progress, totalAnswered, completed, ...(completed ? { currentQuestion: null } : {}) }),
  setError: (error) => set({ error }),

  startChoosingType: () =>
    set({
      ...initialState,
      step: 'choose_type',
    }),

  chooseTopic: (microTopic) =>
    set({
      microTopic,
      step: 'choose_topic',
    }),

  reset: () => set(initialState),
}));
