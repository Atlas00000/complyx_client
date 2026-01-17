import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AssessmentAnswer {
  questionId: string;
  value: string;
  timestamp: Date | string;
}

export interface CategoryScore {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
  answeredCount: number;
  totalCount: number;
}

export interface AssessmentScore {
  overallScore: number;
  overallPercentage: number;
  categoryScores: CategoryScore[];
  totalAnswered: number;
  totalQuestions: number;
}

interface AssessmentState {
  // Assessment metadata
  assessmentId: string | null;
  ifrsStandard: 'S1' | 'S2' | null;
  currentPhase: 'quick' | 'detailed' | 'followup' | null;
  status: 'in_progress' | 'completed' | 'paused';
  
  // Progress
  progress: number;
  answeredCount: number;
  totalCount: number;
  
  // Answers
  answers: AssessmentAnswer[];
  answeredQuestions: Set<string>;
  
  // Scores
  scores: AssessmentScore | null;
  
  // Actions
  setAssessmentId: (id: string | null) => void;
  setIfrsStandard: (standard: 'S1' | 'S2' | null) => void;
  setCurrentPhase: (phase: 'quick' | 'detailed' | 'followup' | null) => void;
  setStatus: (status: 'in_progress' | 'completed' | 'paused') => void;
  
  addAnswer: (questionId: string, value: string) => void;
  updateAnswer: (questionId: string, value: string) => void;
  removeAnswer: (questionId: string) => void;
  
  setProgress: (progress: number, answeredCount?: number, totalCount?: number) => void;
  setScores: (scores: AssessmentScore | null) => void;
  
  resetAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set) => ({
      // Initial state
      assessmentId: null,
      ifrsStandard: null,
      currentPhase: null,
      status: 'in_progress',
      progress: 0,
      answeredCount: 0,
      totalCount: 0,
      answers: [],
      answeredQuestions: new Set<string>(),
      scores: null,

      // Metadata setters
      setAssessmentId: (id) => set({ assessmentId: id }),
      setIfrsStandard: (standard) => set({ ifrsStandard: standard }),
      setCurrentPhase: (phase) => set({ currentPhase: phase }),
      setStatus: (status) => set({ status }),

      // Answer management
      addAnswer: (questionId, value) =>
        set((state) => {
          const answeredSet = new Set(state.answeredQuestions);
          answeredSet.add(questionId);

          // Check if answer already exists
          const existingIndex = state.answers.findIndex(a => a.questionId === questionId);
          const newAnswer: AssessmentAnswer = {
            questionId,
            value,
            timestamp: new Date(),
          };

          return {
            answers: existingIndex >= 0
              ? state.answers.map((a, idx) => idx === existingIndex ? newAnswer : a)
              : [...state.answers, newAnswer],
            answeredQuestions: answeredSet,
          };
        }),

      updateAnswer: (questionId, value) =>
        set((state) => ({
          answers: state.answers.map((a) =>
            a.questionId === questionId
              ? { ...a, value, timestamp: new Date() }
              : a
          ),
        })),

      removeAnswer: (questionId) =>
        set((state) => {
          const answeredSet = new Set(state.answeredQuestions);
          answeredSet.delete(questionId);

          return {
            answers: state.answers.filter(a => a.questionId !== questionId),
            answeredQuestions: answeredSet,
          };
        }),

      // Progress and scores
      setProgress: (progress, answeredCount, totalCount) =>
        set({
          progress,
          answeredCount: answeredCount ?? 0,
          totalCount: totalCount ?? 0,
        }),

      setScores: (scores) => set({ scores }),

      // Reset
      resetAssessment: () =>
        set({
          assessmentId: null,
          ifrsStandard: null,
          currentPhase: null,
          status: 'in_progress',
          progress: 0,
          answeredCount: 0,
          totalCount: 0,
          answers: [],
          answeredQuestions: new Set(),
          scores: null,
        }),
    }),
    {
      name: 'complyx-assessment-storage',
      partialize: (state) => ({
        assessmentId: state.assessmentId,
        ifrsStandard: state.ifrsStandard,
        currentPhase: state.currentPhase,
        status: state.status,
        progress: state.progress,
        answeredCount: state.answeredCount,
        totalCount: state.totalCount,
        answers: state.answers.map((ans) => ({
          ...ans,
          timestamp: ans.timestamp instanceof Date ? ans.timestamp.toISOString() : ans.timestamp,
        })),
        answeredQuestions: Array.from(state.answeredQuestions),
        scores: state.scores,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.answers = state.answers.map((ans) => ({
            ...ans,
            timestamp: typeof ans.timestamp === 'string' ? new Date(ans.timestamp) : ans.timestamp,
          }));
          state.answeredQuestions = new Set(state.answeredQuestions);
        }
      },
    }
  )
);
