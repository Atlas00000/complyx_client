'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useInChatAssessmentStore } from '@/stores/inChatAssessmentStore';
import {
  startInChatAssessment,
  submitInChatAnswer,
  getInChatAssessmentStatus,
} from '@/lib/api/inChatAssessmentApi';
import {
  saveInProgressAssessment,
  getInProgressAssessment,
  clearInProgressAssessment,
} from '@/lib/assessmentPersistence';
import type { AssessmentType, MicroTopic } from '@/stores/inChatAssessmentStore';

export function useInChatAssessment(userId: string | null) {
  const {
    assessmentId,
    assessmentType,
    microTopic,
    step,
    currentQuestion,
    totalQuestions,
    progress,
    totalAnswered,
    completed,
    error,
    setStep,
    setAssessmentType,
    setMicroTopic,
    setAssessmentSession,
    setCurrentQuestion,
    setProgress,
    setError,
    reset,
  } = useInChatAssessmentStore();

  const startChoosingType = useCallback(() => {
    useInChatAssessmentStore.getState().startChoosingType();
  }, []);

  const selectType = useCallback((type: AssessmentType) => {
    setAssessmentType(type);
    if (type === 'micro') {
      setStep('choose_topic');
    } else {
      setStep('choose_type'); // caller will then call startAssessment with type
    }
  }, [setAssessmentType, setStep]);

  const selectTopic = useCallback((topic: MicroTopic) => {
    setMicroTopic(topic);
  }, [setMicroTopic]);

  const startAssessment = useCallback(
    async (sessionId?: string) => {
      if (!userId) {
        setError('You must be logged in to start an assessment.');
        return;
      }
      const type = assessmentType || 'full';
      const topic = type === 'micro' ? microTopic : undefined;
      if (type === 'micro' && !topic) {
        setError('Please select a topic for the micro assessment.');
        return;
      }
      setError(null);
      try {
        const result = await startInChatAssessment({
          userId,
          sessionId,
          assessmentType: type,
          microTopic: topic ?? undefined,
        });
        setAssessmentSession({
          assessmentId: result.assessmentId,
          totalQuestions: result.totalQuestions,
          firstQuestion: result.firstQuestion,
        });
        saveInProgressAssessment(userId, result.assessmentId);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to start assessment');
      }
    },
    [userId, assessmentType, microTopic, setAssessmentSession, setError]
  );

  const submitAnswer = useCallback(
    async (questionId: string, value: string) => {
      if (!assessmentId) return;
      setError(null);
      try {
        const result = await submitInChatAnswer({
          assessmentId,
          questionId,
          value,
        });
        setCurrentQuestion(result.nextQuestion);
        setProgress(result.progress, result.totalAnswered, result.completed);
        if (result.completed) {
          clearInProgressAssessment();
          setStep('completed');
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to submit answer');
      }
    },
    [assessmentId, setCurrentQuestion, setProgress, setError]
  );

  const refreshStatus = useCallback(async () => {
    if (!assessmentId) return;
    try {
      const result = await getInChatAssessmentStatus(assessmentId);
      setCurrentQuestion(result.currentQuestion);
      setProgress(result.progress, result.totalAnswered, result.completed);
      if (result.completed) setStep('completed');
    } catch {
      // ignore
    }
  }, [assessmentId, setCurrentQuestion, setProgress, setStep]);

  const resumeAssessment = useCallback(
    async (targetAssessmentId: string) => {
      setError(null);
      try {
        const result = await getInChatAssessmentStatus(targetAssessmentId);
        setAssessmentType(result.assessmentType);
        setMicroTopic(result.microTopic ?? null);
        setAssessmentSession({
          assessmentId: result.assessmentId,
          totalQuestions: result.totalQuestions,
          firstQuestion: result.currentQuestion,
        });
        setProgress(result.progress, result.totalAnswered, result.completed);
        if (result.completed) {
          clearInProgressAssessment();
          setStep('completed');
        }
      } catch (e) {
        clearInProgressAssessment();
        setError(e instanceof Error ? e.message : 'Failed to resume assessment');
      }
    },
    [
      setAssessmentType,
      setMicroTopic,
      setAssessmentSession,
      setProgress,
      setStep,
      setError,
    ]
  );

  const resetWithPersistence = useCallback(() => {
    clearInProgressAssessment();
    reset();
  }, [reset]);

  // Week 4: restore in-progress assessment from localStorage on mount
  const hasRestoredRef = useRef(false);
  useEffect(() => {
    if (!userId || step !== 'idle') return;
    const stored = getInProgressAssessment(userId);
    if (!stored || hasRestoredRef.current) return;
    hasRestoredRef.current = true;
    resumeAssessment(stored.assessmentId).catch(() => {
      // Clear ref so user can retry via Resume chip
      hasRestoredRef.current = false;
    });
  }, [userId, step, resumeAssessment]);

  // Week 1: single source for canResume — guard against SSR and localStorage errors
  let storedInProgress: { userId: string; assessmentId: string } | null = null;
  if (typeof window !== 'undefined' && userId) {
    try {
      storedInProgress = getInProgressAssessment(userId);
    } catch {
      storedInProgress = null;
    }
  }
  const canResume = !!(userId && step === 'idle' && storedInProgress);

  return {
    step,
    assessmentType,
    microTopic,
    assessmentId,
    currentQuestion,
    totalQuestions,
    progress,
    totalAnswered,
    completed,
    error,
    canResume,
    storedAssessmentId: storedInProgress?.assessmentId ?? null,
    startChoosingType,
    selectType,
    selectTopic,
    startAssessment,
    submitAnswer,
    refreshStatus,
    resumeAssessment,
    reset: resetWithPersistence,
  };
}
