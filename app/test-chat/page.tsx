'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { useQuestion } from '@/hooks/useQuestion';
import { QuestionAPI, type PhaseInfo } from '@/lib/api/questionApi';
import { AssessmentAPI } from '@/lib/api/assessmentApi';
import ChatInterface from '@/components/chat/ChatInterface';
import MessageBubble from '@/components/chat/MessageBubble';
import ChatInput from '@/components/chat/ChatInput';
import TypingIndicator from '@/components/chat/TypingIndicator';
import QuestionCard from '@/components/chat/QuestionCard';
import ProgressTracker from '@/components/chat/ProgressTracker';
import PhaseSelector from '@/components/chat/PhaseSelector';

export default function TestChatPage() {
  const {
    messages,
    isTyping,
    addMessage,
    setIsTyping,
    setCurrentQuestion,
    addAnswer,
    assessmentProgress,
    ifrsStandard,
    setIfrsStandard,
    answeredQuestions,
  } = useChatStore();

  const {
    assessmentId,
    progress: assessmentStoreProgress,
    answers: assessmentAnswers,
    setAssessmentId,
    setIfrsStandard: setAssessmentStandard,
    setCurrentPhase: setAssessmentPhase,
    setStatus,
    addAnswer: addAssessmentAnswer,
    setProgress: setAssessmentProgress,
    setScores,
  } = useAssessmentStore();

  const {
    currentQuestion,
    getNextQuestion,
    submitAnswer,
  } = useQuestion();

  const [totalQuestions, setTotalQuestions] = useState(0);
  const [phases, setPhases] = useState<PhaseInfo[]>([]);
  const [currentPhase, setCurrentPhase] = useState<'quick' | 'detailed' | 'followup' | null>(null);
  const [showPhaseSelector, setShowPhaseSelector] = useState(true);
  const [phaseComplete, setPhaseComplete] = useState(false);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Define all callback functions before useEffect hooks
  // Update progress using assessment API
  const updateAssessmentProgress = useCallback(async () => {
    if (!ifrsStandard || !currentPhase) return;

    try {
      const progressData = await AssessmentAPI.calculateProgress({
        answeredQuestions: Array.from(answeredQuestions),
        ifrsStandard,
        phase: currentPhase,
      });
      setAssessmentProgress(progressData.percentage, progressData.answeredCount, progressData.totalCount);
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  }, [answeredQuestions, ifrsStandard, currentPhase, setAssessmentProgress]);

  // Calculate scores when answers change
  const calculateScores = useCallback(async () => {
    if (!assessmentId || assessmentAnswers.length === 0) return;

    try {
      const scores = await AssessmentAPI.calculateScores({
        answers: assessmentAnswers.map(a => ({
          questionId: a.questionId,
          value: a.value,
        })),
        ifrsStandard: ifrsStandard || undefined,
        phase: currentPhase || undefined,
        assessmentId,
      });
      setScores(scores);
    } catch (error) {
      console.error('Failed to calculate scores:', error);
    }
  }, [assessmentId, assessmentAnswers, ifrsStandard, currentPhase, setScores]);

  // Auto-save functionality (every 30 seconds)
  const autoSave = useCallback(async () => {
    if (!assessmentId || assessmentAnswers.length === 0) return;

    try {
      await AssessmentAPI.autoSave({
        assessmentId,
        answers: assessmentAnswers.map(a => ({
          questionId: a.questionId,
          value: a.value,
        })),
        progress: assessmentStoreProgress,
      });
      console.log('Auto-saved assessment');
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [assessmentId, assessmentAnswers, assessmentStoreProgress]);

  // Load phase information
  useEffect(() => {
    const loadPhases = async () => {
      try {
        const phaseInfo = await QuestionAPI.getPhaseInfo(ifrsStandard || 'S1');
        setPhases(phaseInfo);
        
        // Get total questions for quick phase
        const quickQuestions = await QuestionAPI.getPhaseQuestions('quick', ifrsStandard || 'S1');
        setTotalQuestions(quickQuestions.length);
      } catch (error) {
        console.error('Failed to load phases:', error);
      }
    };

    if (ifrsStandard) {
      loadPhases();
    }
  }, [ifrsStandard]);

  // Initialize assessment when phase is selected
  useEffect(() => {
    const initializeAssessment = async () => {
      if (!currentPhase || !ifrsStandard) return;

      try {
        // Get questions for selected phase
        const phaseQuestions = await QuestionAPI.getPhaseQuestions(currentPhase, ifrsStandard);
        setTotalQuestions(phaseQuestions.length);

        // Get first question with selected phase
        await getNextQuestion(ifrsStandard, currentPhase);
      } catch (error) {
        console.error('Failed to initialize assessment:', error);
      }
    };

    if (currentPhase && !showPhaseSelector) {
      initializeAssessment();
    }
  }, [currentPhase, ifrsStandard, showPhaseSelector]);

  // Update current question in store when question changes
  useEffect(() => {
    if (currentQuestion) {
      setCurrentQuestion(currentQuestion.id);
      // Add question as assistant message
      addMessage({
        content: currentQuestion.text,
        isUser: false,
        questionId: currentQuestion.id,
      });
    }
  }, [currentQuestion]);

  // Update progress when answers change
  useEffect(() => {
    if (ifrsStandard && currentPhase) {
      updateAssessmentProgress();
    }
  }, [answeredQuestions.size, ifrsStandard, currentPhase, updateAssessmentProgress]);

  // Check if phase is complete
  useEffect(() => {
    const checkPhaseComplete = async () => {
      if (!currentPhase || !ifrsStandard) return;

      try {
        const phaseQuestions = await QuestionAPI.getPhaseQuestions(currentPhase, ifrsStandard);
        const phaseQuestionIds = new Set(phaseQuestions.map(q => q.id));
        const answeredCount = Array.from(answeredQuestions).filter(id => phaseQuestionIds.has(id)).length;
        
        if (answeredCount === phaseQuestions.length && phaseQuestions.length > 0) {
          setPhaseComplete(true);
          addMessage({
            content: `Great! You've completed the ${currentPhase === 'quick' ? 'Quick' : 'Detailed'} Assessment. Would you like to continue with the Detailed Assessment for a more comprehensive analysis?`,
            isUser: false,
          });
        }
      } catch (error) {
        console.error('Failed to check phase completion:', error);
      }
    };

    checkPhaseComplete();
  }, [answeredQuestions.size, currentPhase, ifrsStandard, answeredQuestions]);

  // Initialize assessment ID when phase is selected
  useEffect(() => {
    if (currentPhase && ifrsStandard && !assessmentId) {
      const newAssessmentId = `assessment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setAssessmentId(newAssessmentId);
      setAssessmentStandard(ifrsStandard);
      setAssessmentPhase(currentPhase);
      setStatus('in_progress');
    }
  }, [currentPhase, ifrsStandard, assessmentId, setAssessmentId, setAssessmentStandard, setAssessmentPhase, setStatus]);

  useEffect(() => {
    // Set up auto-save interval
    if (assessmentId && currentPhase) {
      autoSaveIntervalRef.current = setInterval(autoSave, 30000); // 30 seconds
    }
    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [assessmentId, currentPhase, autoSave]);

  const handlePhaseSelect = (phase: 'quick' | 'detailed' | 'followup') => {
    setCurrentPhase(phase);
    setAssessmentPhase(phase);
    setShowPhaseSelector(false);
    setPhaseComplete(false);
  };

  const handleStartAssessment = () => {
    // Phase selection triggers assessment start
  };

  const handleContinueToDetailed = async () => {
    setCurrentPhase('detailed');
    setPhaseComplete(false);
    setIsTyping(true);
    await getNextQuestion(ifrsStandard || 'S1', 'detailed');
    setIsTyping(false);
  };

  const handleSendMessage = async (content: string) => {
    // Add user message
    addMessage({
      content,
      isUser: true,
      status: 'sent',
    });

    // If there's a current question, treat the message as an answer
    if (currentQuestion) {
      submitAnswer(currentQuestion.id, content);
      addAnswer(currentQuestion.id, content);
      addAssessmentAnswer(currentQuestion.id, content);
      setCurrentQuestion(null);

      // Update progress
      await updateAssessmentProgress();

      // Calculate scores (async, non-blocking)
      calculateScores();

      // Get next question
      setIsTyping(true);
      await getNextQuestion(ifrsStandard || undefined, currentPhase || undefined);
      setIsTyping(false);
    } else {
      // Regular chat message - send to AI
      setIsTyping(true);

      try {
        const response = await fetch('http://localhost:3001/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: content,
            messages: messages.map((m) => ({
              role: m.isUser ? 'user' : 'assistant',
              content: m.content,
            })),
            stream: false,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          addMessage({
            content: data.message,
            isUser: false,
          });
        } else {
          addMessage({
            content: 'Sorry, I encountered an error. Please try again.',
            isUser: false,
          });
        }
      } catch (error) {
        addMessage({
          content: 'Sorry, I encountered an error. Please try again.',
          isUser: false,
        });
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleQuestionAnswer = async (value: string) => {
    if (!currentQuestion) return;

    // Add answer as user message
    addMessage({
      content: value,
      isUser: true,
      status: 'sent',
      questionId: currentQuestion.id,
    });

    // Submit answer to question hook
    submitAnswer(currentQuestion.id, value);
    
    // Add answer to chat store
    addAnswer(currentQuestion.id, value);
    
    // Add answer to assessment store
    addAssessmentAnswer(currentQuestion.id, value);
    
    setCurrentQuestion(null);

    // Update progress
    await updateAssessmentProgress();

    // Calculate scores (async, non-blocking)
    calculateScores();

    // Get next question
    setIsTyping(true);
    await getNextQuestion(ifrsStandard || undefined, currentPhase || undefined);
    setIsTyping(false);
  };

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name);
    // TODO: Implement file upload logic
  };

  // Initialize IFRS standard if not set
  useEffect(() => {
    if (!ifrsStandard) {
      setIfrsStandard('S1');
    }
  }, [ifrsStandard, setIfrsStandard]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-gray-900">Complyx Chat Test</h1>
        <p className="text-sm text-gray-600">Testing chat interface with phase-based question system</p>
      </div>

      {showPhaseSelector && phases.length > 0 && (
        <div className="flex-1 overflow-y-auto p-6">
          <PhaseSelector
            phases={phases}
            currentPhase={currentPhase || undefined}
            onPhaseSelect={handlePhaseSelect}
            onStartAssessment={handleStartAssessment}
          />
        </div>
      )}

      {!showPhaseSelector && (
        <>
          <ProgressTracker
            progress={assessmentStoreProgress || assessmentProgress}
            answeredCount={assessmentAnswers.length || answeredQuestions.size}
            totalCount={totalQuestions}
          />

          {phaseComplete && currentPhase === 'quick' && (
            <div className="w-full max-w-4xl mx-auto px-4 py-3 bg-primary/10 border-l-4 border-primary">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary">Quick Assessment Complete!</p>
                  <p className="text-xs text-gray-600 mt-1">Continue with Detailed Assessment for comprehensive analysis</p>
                </div>
                <button
                  onClick={handleContinueToDetailed}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  Continue to Detailed
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            <ChatInterface>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message.content}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                  status={message.status}
                />
              ))}
              {currentQuestion && (
                <QuestionCard
                  question={currentQuestion}
                  onAnswer={handleQuestionAnswer}
                />
              )}
              {isTyping && <TypingIndicator isTyping={isTyping} />}
            </ChatInterface>
          </div>

          <ChatInput
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUpload}
            placeholder={currentQuestion ? "Or type your answer here..." : "Type a message..."}
            disabled={!!currentQuestion}
          />
        </>
      )}
    </div>
  );
}
