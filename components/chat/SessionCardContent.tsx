'use client';

import { type ChatSession } from '@/stores/sessionStore';

interface SessionCardContentProps {
  session: ChatSession;
  isEditing: boolean;
  editName: string;
  onEditNameChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * SessionCardContent Component
 * 
 * Content display for session cards with:
 * - Session name and preview
 * - Timestamp and message count
 * - Edit mode with input
 */
export default function SessionCardContent({
  session,
  isEditing,
  editName,
  onEditNameChange,
  onSave,
  onCancel,
}: SessionCardContentProps) {
  if (isEditing) {
    return (
      <div className="p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          value={editName}
          onChange={(e) => onEditNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSave();
            } else if (e.key === 'Escape') {
              onCancel();
            }
          }}
          className="w-full px-3 py-2 text-sm bg-white/80 dark:bg-slate-700/80 text-gray-900 dark:text-slate-100 border-2 border-primary/30 dark:border-primary/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary backdrop-blur-sm"
          autoFocus
        />
        <div className="flex items-center gap-2">
          <button
            onClick={onSave}
            className="px-3 py-1.5 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-lg"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-semibold bg-white/60 dark:bg-slate-600/60 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-white/80 dark:hover:bg-slate-500/80 transition-colors backdrop-blur-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate mb-1">
            {session.name}
          </h3>
          {session.preview && (
            <p className="text-xs text-gray-600 dark:text-slate-400 mt-1 truncate leading-relaxed">
              {session.preview}
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-slate-500 mt-2 flex items-center gap-2">
            <span>{new Date(session.updatedAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{session.messageCount} messages</span>
          </p>
        </div>
      </div>
    </div>
  );
}
