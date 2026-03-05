import { getAccessToken } from './authApi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const CHAT_HISTORY_BASE = `${API_URL}/api/chat`;

function authHeaders(): HeadersInit {
  const token = getAccessToken();
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export interface ChatSessionResponse {
  id: string;
  userId: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string | null;
}

export interface ChatMessageResponse {
  id: string;
  sessionId: string;
  userId: string | null;
  role: string;
  content: string;
  metadata: unknown;
  createdAt: string;
}

/**
 * List chat sessions for the current user (requires auth).
 */
export async function listChatSessions(params?: {
  limit?: number;
  offset?: number;
}): Promise<{ sessions: ChatSessionResponse[]; total: number }> {
  const search = new URLSearchParams();
  if (params?.limit != null) search.set('limit', String(params.limit));
  if (params?.offset != null) search.set('offset', String(params.offset));
  const url = `${CHAT_HISTORY_BASE}/sessions${search.toString() ? `?${search}` : ''}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to list sessions' }));
    throw new Error(err.error || 'Failed to list sessions');
  }
  return res.json();
}

/**
 * Create or get a chat session (requires auth). If sessionId is provided and exists for user, returns it; otherwise creates a new one.
 */
export async function createOrGetChatSession(body?: {
  sessionId?: string;
  title?: string;
}): Promise<{ session: ChatSessionResponse }> {
  const res = await fetch(`${CHAT_HISTORY_BASE}/sessions`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body ?? {}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to create or get session' }));
    throw new Error(err.error || 'Failed to create or get session');
  }
  return res.json();
}

/**
 * Get messages for a session (requires auth).
 */
export async function getChatMessages(
  sessionId: string,
  params?: { limit?: number; cursor?: string }
): Promise<{ messages: ChatMessageResponse[]; nextCursor: string | null }> {
  const search = new URLSearchParams();
  if (params?.limit != null) search.set('limit', String(params.limit));
  if (params?.cursor) search.set('cursor', params.cursor);
  const url = `${CHAT_HISTORY_BASE}/sessions/${encodeURIComponent(sessionId)}/messages${search.toString() ? `?${search}` : ''}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to get messages' }));
    throw new Error(err.error || 'Failed to get messages');
  }
  return res.json();
}

/**
 * Save a message to a session (requires auth).
 */
export async function saveChatMessage(
  sessionId: string,
  role: string,
  content: string,
  metadata?: unknown
): Promise<{ message: ChatMessageResponse }> {
  const res = await fetch(`${CHAT_HISTORY_BASE}/sessions/${encodeURIComponent(sessionId)}/messages`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ role, content, metadata }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to save message' }));
    throw new Error(err.error || 'Failed to save message');
  }
  return res.json();
}
