import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'error';
  questionId?: string;
}

export interface Answer {
  questionId: string;
  value: string;
  timestamp: Date;
}

interface ChatState {
  sessionMessages: Record<string, Message[]>; // Messages by session ID
  messages: Message[]; // Current session messages (derived/computed)
  currentSessionId: string | null;
  isTyping: boolean;
  currentQuestionId: string | null;
  answeredQuestions: Set<string>;
  answers: Answer[];
  assessmentProgress: number;
  ifrsStandard: 'S1' | 'S2' | null;
  setCurrentSession: (sessionId: string | null) => void;
  loadSessionMessages: (sessionId: string | null) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
  setIsTyping: (isTyping: boolean) => void;
  setCurrentQuestion: (questionId: string | null) => void;
  addAnswer: (questionId: string, value: string) => void;
  setAssessmentProgress: (progress: number) => void;
  setIfrsStandard: (standard: 'S1' | 'S2' | null) => void;
  resetAssessment: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessionMessages: {},
      messages: [],
      currentSessionId: null,
      isTyping: false,
      currentQuestionId: null,
      answeredQuestions: new Set<string>(),
      answers: [],
      assessmentProgress: 0,
      ifrsStandard: null,

      setCurrentSession: (sessionId: string | null) => {
        set({ currentSessionId: sessionId });
        get().loadSessionMessages(sessionId);
      },

      loadSessionMessages: (sessionId: string | null) => {
        if (!sessionId) {
          set({ messages: [] });
          return;
        }

        const state = get();
        const messages = state.sessionMessages[sessionId] || [];
        set({ messages });
      },

      addMessage: (message) => {
        const state = get();
        const sessionId = state.currentSessionId;
        if (!sessionId) return;

        const newMessage: Message = {
          ...message,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
        };

        const updatedMessages = [...state.messages, newMessage];
        const updatedSessionMessages = {
          ...state.sessionMessages,
          [sessionId]: updatedMessages,
        };

        set({
          messages: updatedMessages,
          sessionMessages: updatedSessionMessages,
        });
      },

      updateMessage: (id, updates) => {
        const state = get();
        const sessionId = state.currentSessionId;
        if (!sessionId) return;

        const updatedMessages = state.messages.map((msg) =>
          msg.id === id ? { ...msg, ...updates } : msg
        );

        set({
          messages: updatedMessages,
          sessionMessages: {
            ...state.sessionMessages,
            [sessionId]: updatedMessages,
          },
        });
      },

      removeMessage: (id) => {
        const state = get();
        const sessionId = state.currentSessionId;
        if (!sessionId) return;

        const updatedMessages = state.messages.filter((msg) => msg.id !== id);

        set({
          messages: updatedMessages,
          sessionMessages: {
            ...state.sessionMessages,
            [sessionId]: updatedMessages,
          },
        });
      },

      clearMessages: () => {
        const state = get();
        const sessionId = state.currentSessionId;
        if (!sessionId) {
          set({ messages: [] });
          return;
        }

        set({
          messages: [],
          sessionMessages: {
            ...state.sessionMessages,
            [sessionId]: [],
          },
        });
      },

      setIsTyping: (isTyping) => set({ isTyping }),

      setCurrentQuestion: (questionId) => set({ currentQuestionId: questionId }),

      addAnswer: (questionId, value) =>
        set((state) => ({
          answeredQuestions: new Set([...state.answeredQuestions, questionId]),
          answers: [
            ...state.answers,
            { questionId, value, timestamp: new Date() },
          ],
          currentQuestionId: null,
        })),

      setAssessmentProgress: (progress) => set({ assessmentProgress: progress }),

      setIfrsStandard: (standard) => set({ ifrsStandard: standard }),

      resetAssessment: () =>
        set({
          currentQuestionId: null,
          answeredQuestions: new Set(),
          answers: [],
          assessmentProgress: 0,
          ifrsStandard: null,
        }),
    }),
    {
      name: 'complyx-chat-storage',
      partialize: (state) => ({
        sessionMessages: Object.fromEntries(
          Object.entries(state.sessionMessages).map(([sessionId, messages]) => [
            sessionId,
            messages.map((msg) => ({
              ...msg,
              timestamp: msg.timestamp.toISOString(),
            })),
          ])
        ),
        currentSessionId: state.currentSessionId,
        messages: [], // Don't persist current messages directly
        answeredQuestions: Array.from(state.answeredQuestions),
        answers: state.answers.map((ans) => ({
          ...ans,
          timestamp: ans.timestamp.toISOString(),
        })),
        assessmentProgress: state.assessmentProgress,
        ifrsStandard: state.ifrsStandard,
      }),
      // Rehydrate dates from strings and Set from array
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Rehydrate session messages with Date objects
          if (state.sessionMessages) {
            state.sessionMessages = Object.fromEntries(
              Object.entries(state.sessionMessages).map(([sessionId, messages]) => [
                sessionId,
                (messages as any[]).map((msg) => ({
                  ...msg,
                  timestamp: typeof msg.timestamp === 'string' ? new Date(msg.timestamp) : msg.timestamp,
                })),
              ])
            );
          }

          // Load messages for current session if available
          if (state.currentSessionId && state.sessionMessages) {
            state.messages = (state.sessionMessages[state.currentSessionId] || []).map((msg: any) => ({
              ...msg,
              timestamp: typeof msg.timestamp === 'string' ? new Date(msg.timestamp) : msg.timestamp,
            }));
          } else {
            state.messages = [];
          }
          
          // Rehydrate answers with Date objects
          if (state.answers) {
            state.answers = state.answers.map((ans) => ({
              ...ans,
              timestamp: typeof ans.timestamp === 'string' ? new Date(ans.timestamp) : ans.timestamp,
            }));
          }
          
          // Rehydrate Set from array
          if (Array.isArray((state as any).answeredQuestions)) {
            state.answeredQuestions = new Set((state as any).answeredQuestions);
          }
        }
      },
    }
  )
);
