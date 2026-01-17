'use client';

import { useState, useCallback } from 'react';
import { QuestionAPI, type Question, type NextQuestionRequest } from '@/lib/api/questionApi';

interface UseQuestionReturn {
  currentQuestion: Question | null;
  answeredQuestions: Set<string>;
  answeredAnswers: Array<{ questionId: string; value: string }>;
  progress: number;
  isLoading: boolean;
  error: string | null;
  getNextQuestion: (ifrsStandard?: 'S1' | 'S2', phase?: 'quick' | 'detailed' | 'followup') => Promise<void>;
  submitAnswer: (questionId: string, value: string) => void;
  resetAssessment: () => void;
  updateProgress: (ifrsStandard?: 'S1' | 'S2') => Promise<void>;
}

export function useQuestion(): UseQuestionReturn {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [answeredAnswers, setAnsweredAnswers] = useState<Array<{ questionId: string; value: string }>>([]);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getNextQuestion = useCallback(async (ifrsStandard?: 'S1' | 'S2', phase?: 'quick' | 'detailed' | 'followup') => {
    setIsLoading(true);
    setError(null);

    try {
      const request: NextQuestionRequest = {
        answeredQuestions: Array.from(answeredQuestions),
        answeredAnswers,
        ifrsStandard,
        phase,
      };

      const response = await QuestionAPI.getNextQuestion(request);

      if (response.question) {
        setCurrentQuestion(response.question);
      } else {
        setCurrentQuestion(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get next question');
      setCurrentQuestion(null);
    } finally {
      setIsLoading(false);
    }
  }, [answeredQuestions, answeredAnswers]);

  const submitAnswer = useCallback((questionId: string, value: string) => {
    setAnsweredQuestions((prev) => new Set([...prev, questionId]));
    setAnsweredAnswers((prev) => [...prev, { questionId, value }]);
    setCurrentQuestion(null);
  }, []);

  const resetAssessment = useCallback(() => {
    setCurrentQuestion(null);
    setAnsweredQuestions(new Set());
    setAnsweredAnswers([]);
    setProgress(0);
    setError(null);
  }, []);

  const updateProgress = useCallback(async (ifrsStandard?: 'S1' | 'S2') => {
    try {
      const response = await QuestionAPI.getProgress({
        answeredQuestions: Array.from(answeredQuestions),
        ifrsStandard,
      });
      setProgress(response.progress);
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  }, [answeredQuestions]);

  return {
    currentQuestion,
    answeredQuestions,
    answeredAnswers,
    progress,
    isLoading,
    error,
    getNextQuestion,
    submitAnswer,
    resetAssessment,
    updateProgress,
  };
}
