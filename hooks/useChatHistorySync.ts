'use client';

import { useCallback } from 'react';
import { createOrGetChatSession, getChatMessages, listChatSessions } from '@/lib/api/chatHistoryApi';
import { useChatStore } from '@/stores/chatStore';
import { useSessionStore } from '@/stores/sessionStore';
import type { Message } from '@/stores/chatStore';

const SERVER_SESSION_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isServerSessionId(id: string): boolean {
  return SERVER_SESSION_REGEX.test(id);
}

/**
 * When logged in, ensure we have a server-backed chat session and return its id.
 * Creates one via API if needed and adds it to the session store.
 */
export function useEnsureServerSession() {
  const addServerSession = useSessionStore((s) => s.addServerSession);
  const setActiveSession = useSessionStore((s) => s.setActiveSession);
  const setCurrentSession = useChatStore((s) => s.setCurrentSession);

  return useCallback(async (): Promise<string | null> => {
    try {
      const { session } = await createOrGetChatSession({});
      addServerSession({
        id: session.id,
        name: session.title ?? undefined,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
        lastMessageAt: session.lastMessageAt ? new Date(session.lastMessageAt) : undefined,
      });
      setCurrentSession(session.id);
      setActiveSession(session.id);
      return session.id;
    } catch {
      return null;
    }
  }, [addServerSession, setActiveSession, setCurrentSession]);
}

/**
 * Load messages for a session from the server and merge into chat store.
 * No-op if not a server session id or on error.
 */
export function useLoadSessionHistory() {
  const setSessionMessagesFromServer = useChatStore((s) => s.setSessionMessagesFromServer);

  return useCallback(
    async (sessionId: string): Promise<void> => {
      if (!isServerSessionId(sessionId)) return;
      try {
        const { messages } = await getChatMessages(sessionId, { limit: 200 });
        const mapped: Message[] = messages.map((m) => ({
          id: m.id,
          content: m.content,
          isUser: m.role === 'user',
          timestamp: new Date(m.createdAt),
          status: 'sent',
        }));
        setSessionMessagesFromServer(sessionId, mapped);
      } catch {
        // Keep local messages on error
      }
    },
    [setSessionMessagesFromServer]
  );
}

/**
 * Fetch server sessions and replace session list (for logged-in user on load).
 */
export function useFetchServerSessions() {
  const setSessionsFromServer = useSessionStore((s) => s.setSessionsFromServer);
  const setActiveSession = useSessionStore((s) => s.setActiveSession);
  const setCurrentSession = useChatStore((s) => s.setCurrentSession);

  return useCallback(async (): Promise<boolean> => {
    try {
      const { sessions, total } = await listChatSessions({ limit: 100 });
      if (total === 0) return false;
      setSessionsFromServer(
        sessions.map((s) => ({
          id: s.id,
          name: s.title ?? undefined,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
          lastMessageAt: s.lastMessageAt ?? undefined,
        }))
      );
      const firstId = sessions[0]?.id;
      if (firstId) {
        setActiveSession(firstId);
        setCurrentSession(firstId);
      }
      return true;
    } catch {
      return false;
    }
  }, [setSessionsFromServer, setActiveSession, setCurrentSession]);
}

export { isServerSessionId };
