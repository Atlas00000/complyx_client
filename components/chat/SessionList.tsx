'use client';

import { useState } from 'react';
import { useSessionStore, type ChatSession } from '@/stores/sessionStore';

interface SessionListProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSession: (sessionId: string) => void;
}

export default function SessionList({ isOpen, onClose, onSelectSession }: SessionListProps) {
  const { sessions, activeSessionId, createSession, deleteSession, renameSession } = useSessionStore();
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleCreateSession = () => {
    const newSessionId = createSession();
    onSelectSession(newSessionId);
    onClose();
  };

  const handleSelectSession = (sessionId: string) => {
    onSelectSession(sessionId);
    onClose();
  };

  const handleStartRename = (session: ChatSession) => {
    setEditingSessionId(session.id);
    setEditName(session.name);
  };

  const handleSaveRename = (sessionId: string) => {
    if (editName.trim()) {
      renameSession(sessionId, editName.trim());
    }
    setEditingSessionId(null);
    setEditName('');
  };

  const handleCancelRename = () => {
    setEditingSessionId(null);
    setEditName('');
  };

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
    setShowDeleteConfirm(null);
    if (activeSessionId === sessionId && sessions.length > 1) {
      const remainingSessions = sessions.filter((s) => s.id !== sessionId);
      if (remainingSessions.length > 0) {
        onSelectSession(remainingSessions[0].id);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end">
      <div className="bg-white w-full max-w-sm h-full shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Chat History</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Create New Session Button */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={handleCreateSession}
            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-2">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No chat sessions yet</p>
              <p className="text-xs mt-2">Create a new chat to get started</p>
            </div>
          ) : (
            <div className="space-y-1">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                    activeSessionId === session.id
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-gray-100 border border-transparent'
                  }`}
                  onClick={() => handleSelectSession(session.id)}
                >
                  {editingSessionId === session.id ? (
                    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveRename(session.id);
                          } else if (e.key === 'Escape') {
                            handleCancelRename();
                          }
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        autoFocus
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveRename(session.id)}
                          className="px-2 py-1 text-xs bg-primary text-white rounded hover:bg-primary/90"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelRename}
                          className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{session.name}</h3>
                          {session.preview && (
                            <p className="text-xs text-gray-500 mt-1 truncate">{session.preview}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(session.updatedAt).toLocaleDateString()} • {session.messageCount} messages
                          </p>
                        </div>
                      </div>

                      {/* Action buttons - shown on hover */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartRename(session);
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Rename"
                        >
                          <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(session.id);
                          }}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                          title="Delete"
                        >
                          <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Delete confirmation */}
                      {showDeleteConfirm === session.id && (
                        <div
                          className="absolute inset-0 bg-white border-2 border-red-200 rounded-lg p-3 z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <p className="text-sm text-gray-900 mb-3">Delete this chat?</p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDeleteSession(session.id)}
                              className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
