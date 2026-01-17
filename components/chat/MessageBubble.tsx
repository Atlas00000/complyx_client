'use client';

import { useState, useRef, useEffect } from 'react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: Date | string;
  status?: 'sending' | 'sent' | 'delivered' | 'error';
  searchQuery?: string;
  isHighlighted?: boolean;
  messageId?: string;
  onRegenerate?: (messageId: string) => void;
  isRegenerating?: boolean;
  onEdit?: (messageId: string, newContent: string) => void;
  isEditing?: boolean;
  onStartEdit?: (messageId: string) => void;
  onCancelEdit?: () => void;
}

export default function MessageBubble({ 
  message, 
  isUser, 
  timestamp, 
  status = 'sent',
  searchQuery,
  isHighlighted = false,
  messageId,
  onRegenerate,
  isRegenerating = false,
  onEdit,
  isEditing = false,
  onStartEdit,
  onCancelEdit,
}: MessageBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [editValue, setEditValue] = useState(message);
  const editInputRef = useRef<HTMLTextAreaElement>(null);
  const { copy, isCopied } = useCopyToClipboard();

  // Focus edit input when editing starts
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.setSelectionRange(editValue.length, editValue.length);
    }
  }, [isEditing, editValue.length]);

  // Update edit value when message changes
  useEffect(() => {
    setEditValue(message);
  }, [message]);

  const handleCopy = async () => {
    await copy(message);
  };

  const handleStartEdit = () => {
    if (onStartEdit && messageId) {
      onStartEdit(messageId);
    }
  };

  const handleSaveEdit = () => {
    if (onEdit && messageId && editValue.trim() !== message.trim()) {
      onEdit(messageId, editValue.trim());
    } else if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleCancelEdit = () => {
    setEditValue(message); // Reset to original
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };
  const formatTime = (date?: Date | string): string => {
    if (!date) return '';
    
    // Handle both Date objects and date strings (from persistence)
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) return '';
    
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(dateObj);
  };

  const baseStyles = 'max-w-[80%] px-4 py-3 rounded-2xl break-words';
  const userStyles = 'bg-primary text-white ml-auto';
  const assistantStyles = 'bg-gray-200 text-gray-900 mr-auto';
  const highlightStyles = isHighlighted ? 'ring-2 ring-yellow-400 ring-offset-2' : '';

  // Highlight search query in message text
  const highlightText = (text: string, query?: string) => {
    if (!query || !query.trim()) {
      return text;
    }

    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-300 text-gray-900 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };
  
  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full group`}
      id={messageId ? `message-${messageId}` : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`${baseStyles} ${isUser ? userStyles : assistantStyles} ${highlightStyles} transition-all relative`}>
        {isEditing && isUser ? (
          <div className="space-y-2">
            <textarea
              ref={editInputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleEditKeyDown}
              className="w-full px-3 py-2 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
              rows={3}
              placeholder="Edit your message..."
            />
            <div className="flex items-center gap-2 text-xs text-white/70">
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded transition-colors"
              >
                Cancel
              </button>
              <span className="text-white/50">Press Enter to save, Esc to cancel</span>
            </div>
          </div>
        ) : (
          <>
            <div className="text-sm whitespace-pre-wrap">{highlightText(message, searchQuery)}</div>
            <div className={`flex items-center justify-end gap-2 mt-2 text-xs ${
              isUser ? 'text-white/70' : 'text-gray-500'
            }`}>
              {timestamp && (
                <span>{formatTime(timestamp)}</span>
              )}
              {isUser && status === 'sending' && (
                <span className="ml-1">•</span>
              )}
            </div>
          </>
        )}
        
        {/* Action buttons - shown on hover (not when editing) */}
        {(isHovered || isCopied) && !isEditing && (
          <div className={`absolute top-2 ${isUser ? 'left-2 flex-row-reverse' : 'right-2'} flex gap-1`}>
            {/* Edit button - only for user messages */}
            {isUser && onStartEdit && messageId && (
              <button
                onClick={handleStartEdit}
                className={`p-1.5 rounded-md transition-all ${
                  isUser 
                    ? 'bg-white/20 hover:bg-white/30 text-white' 
                    : 'bg-gray-300/80 hover:bg-gray-400 text-gray-700'
                }`}
                title="Edit message"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            
            {/* Regenerate button - only for AI messages */}
            {!isUser && onRegenerate && messageId && (
              <button
                onClick={() => onRegenerate(messageId)}
                disabled={isRegenerating}
                className={`p-1.5 rounded-md transition-all ${
                  isRegenerating
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-300/80 hover:bg-gray-400 text-gray-700'
                }`}
                title={isRegenerating ? 'Regenerating...' : 'Regenerate response'}
              >
                {isRegenerating ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
              </button>
            )}
            
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className={`p-1.5 rounded-md transition-all ${
                isUser 
                  ? 'bg-white/20 hover:bg-white/30 text-white' 
                  : 'bg-gray-300/80 hover:bg-gray-400 text-gray-700'
              } ${isCopied ? 'bg-green-500 text-white' : ''}`}
              title={isCopied ? 'Copied!' : 'Copy message'}
            >
              {isCopied ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
