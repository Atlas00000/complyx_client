import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatSession {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  preview?: string; // Last message preview
}

interface SessionState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  createSession: (name?: string) => string;
  deleteSession: (sessionId: string) => void;
  renameSession: (sessionId: string, newName: string) => void;
  setActiveSession: (sessionId: string) => void;
  updateSessionPreview: (sessionId: string, preview: string) => void;
  updateSessionMessageCount: (sessionId: string, count: number) => void;
  getSession: (sessionId: string) => ChatSession | undefined;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,

      createSession: (name?: string) => {
        const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const sessionName = name || `Chat ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        const now = new Date();

        const newSession: ChatSession = {
          id: sessionId,
          name: sessionName,
          createdAt: now,
          updatedAt: now,
          messageCount: 0,
        };

        set((state) => ({
          sessions: [newSession, ...state.sessions],
          activeSessionId: sessionId,
        }));

        return sessionId;
      },

      deleteSession: (sessionId: string) => {
        set((state) => {
          const newSessions = state.sessions.filter((s) => s.id !== sessionId);
          const newActiveSessionId =
            state.activeSessionId === sessionId
              ? newSessions.length > 0
                ? newSessions[0].id
                : null
              : state.activeSessionId;

          return {
            sessions: newSessions,
            activeSessionId: newActiveSessionId,
          };
        });
      },

      renameSession: (sessionId: string, newName: string) => {
        if (!newName.trim()) return;

        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId ? { ...s, name: newName.trim(), updatedAt: new Date() } : s
          ),
        }));
      },

      setActiveSession: (sessionId: string) => {
        set((state) => ({
          activeSessionId: sessionId,
          sessions: state.sessions.map((s) =>
            s.id === sessionId ? { ...s, updatedAt: new Date() } : s
          ),
        }));
      },

      updateSessionPreview: (sessionId: string, preview: string) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId
              ? { ...s, preview: preview.substring(0, 100), updatedAt: new Date() }
              : s
          ),
        }));
      },

      updateSessionMessageCount: (sessionId: string, count: number) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId ? { ...s, messageCount: count, updatedAt: new Date() } : s
          ),
        }));
      },

      getSession: (sessionId: string) => {
        return get().sessions.find((s) => s.id === sessionId);
      },
    }),
    {
      name: 'complyx-session-storage',
      partialize: (state) => ({
        sessions: state.sessions.map((s) => ({
          ...s,
          createdAt: s.createdAt.toISOString(),
          updatedAt: s.updatedAt.toISOString(),
        })),
        activeSessionId: state.activeSessionId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Rehydrate dates from strings
          state.sessions = state.sessions.map((s) => ({
            ...s,
            createdAt: typeof s.createdAt === 'string' ? new Date(s.createdAt) : s.createdAt,
            updatedAt: typeof s.updatedAt === 'string' ? new Date(s.updatedAt) : s.updatedAt,
          }));
        }
      },
    }
  )
);
