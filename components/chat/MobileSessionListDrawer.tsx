'use client';

import { useSessionStore } from '@/stores/sessionStore';

interface MobileSessionListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSession: (sessionId: string) => void;
}

/**
 * MobileSessionListDrawer
 *
 * Full-screen overlay session list for mobile. No Framer Motion.
 * Same API as SessionList: isOpen, onClose, onSelectSession.
 */
export default function MobileSessionListDrawer({
  isOpen,
  onClose,
  onSelectSession,
}: MobileSessionListDrawerProps) {
  const { sessions, activeSessionId, createSession } = useSessionStore();

  if (!isOpen) return null;

  const handleNewSession = () => {
    const id = createSession();
    onSelectSession(id);
    onClose();
  };

  const handleSelect = (sessionId: string) => {
    onSelectSession(sessionId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between h-14 px-4 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Chat history</h2>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-lg text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* New chat */}
      <div className="flex-shrink-0 p-3 border-b border-gray-200 dark:border-slate-700">
        <button
          type="button"
          onClick={handleNewSession}
          className="w-full py-3 rounded-xl bg-primary text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          New chat
        </button>
      </div>

      {/* Session list */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3">
        {sessions.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-slate-400 text-center py-8">No chats yet.</p>
        ) : (
          <ul className="space-y-2">
            {sessions.map((session) => (
              <li key={session.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(session.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary ${
                    activeSessionId === session.id
                      ? 'bg-primary/10 dark:bg-primary/20 border-primary/30 text-gray-900 dark:text-slate-100'
                      : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <p className="font-medium truncate">{session.name}</p>
                  {session.preview && (
                    <p className="text-xs text-gray-500 dark:text-slate-400 truncate mt-0.5">
                      {session.preview}
                    </p>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
