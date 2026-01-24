'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSessionStore, type ChatSession } from '@/stores/sessionStore';
import SessionListBackground from './SessionListBackground';
import SessionListHeader from './SessionListHeader';
import SessionCard from './SessionCard';
import SessionCardContent from './SessionCardContent';
import SessionCardActions from './SessionCardActions';
import NewSessionButton from './NewSessionButton';
import SessionListEmptyState from './SessionListEmptyState';
import DeleteConfirmation from './DeleteConfirmation';
import CustomScrollbar from './CustomScrollbar';

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
  const [hoveredSessionId, setHoveredSessionId] = useState<string | null>(null);

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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-end">
        {/* Backdrop */}
        <SessionListBackground onClose={onClose} />
        
        {/* Sidebar */}
        <motion.div
          className="relative w-full max-w-sm h-full flex flex-col z-50"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* Glassmorphism Container */}
          <div className="relative flex-1 flex flex-col overflow-hidden">
            {/* Frosted glass background */}
            <div
              className="absolute inset-0 backdrop-blur-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
              }}
            />
            
            {/* Dark mode glass */}
            <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-slate-800/90 via-slate-800/85 to-slate-800/90 backdrop-blur-2xl" />
            
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 dark:from-primary/10 dark:via-transparent dark:to-accent/10" />
            
            {/* Border */}
            <div className="absolute left-0 inset-y-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent dark:via-primary/30" />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
              {/* Header */}
              <SessionListHeader onClose={onClose} />
              
              {/* New Session Button */}
              <NewSessionButton onClick={handleCreateSession} />
              
              {/* Sessions List */}
              <CustomScrollbar className="flex-1 min-h-0">
                <div className="p-3 space-y-2">
                  {sessions.length === 0 ? (
                    <SessionListEmptyState />
                  ) : (
                    sessions.map((session, index) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        isActive={activeSessionId === session.id}
                        onClick={() => handleSelectSession(session.id)}
                        index={index}
                      >
                        <div
                          onMouseEnter={() => setHoveredSessionId(session.id)}
                          onMouseLeave={() => setHoveredSessionId(null)}
                        >
                          <SessionCardContent
                            session={session}
                            isEditing={editingSessionId === session.id}
                            editName={editName}
                            onEditNameChange={setEditName}
                            onSave={() => handleSaveRename(session.id)}
                            onCancel={handleCancelRename}
                          />
                          
                          {/* Action buttons */}
                          {!editingSessionId && (
                            <SessionCardActions
                              onRename={() => handleStartRename(session)}
                              onDelete={() => setShowDeleteConfirm(session.id)}
                              isVisible={hoveredSessionId === session.id}
                            />
                          )}
                          
                          {/* Delete confirmation */}
                          <DeleteConfirmation
                            isVisible={showDeleteConfirm === session.id}
                            onConfirm={() => handleDeleteSession(session.id)}
                            onCancel={() => setShowDeleteConfirm(null)}
                          />
                        </div>
                      </SessionCard>
                    ))
                  )}
                </div>
              </CustomScrollbar>
            </div>
            
            {/* Edge glow */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-primary/20 to-transparent dark:from-primary/40 dark:via-primary/30" />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
