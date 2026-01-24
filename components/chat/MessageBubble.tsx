'use client';

import { useState, useRef, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import Button from '@/components/ui/Button';
import MessageBubbleContainer from './MessageBubbleContainer';
import MessageBubbleGradient from './MessageBubbleGradient';
import MessageBubbleActions from './MessageBubbleActions';
import MessageBubbleTimestamp from './MessageBubbleTimestamp';
import MessageBubbleContent from './MessageBubbleContent';

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

function MessageBubble({ 
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
    setEditValue(message);
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

  return (
    <motion.div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full group`}
      id={messageId ? `message-${messageId}` : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <MessageBubbleContainer isUser={isUser} isHighlighted={isHighlighted}>
        <MessageBubbleGradient isUser={isUser}>
          <div className="relative px-6 py-5">
            {isEditing && isUser ? (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <textarea
                  ref={editInputRef}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleEditKeyDown}
                  className="w-full px-4 py-3 border-2 border-white/40 rounded-xl bg-white/15 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/60 resize-none backdrop-blur-sm"
                  rows={4}
                  placeholder="Edit your message..."
                />
                <div className="flex items-center gap-3 flex-wrap">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={handleSaveEdit}
                    className="bg-white/25 hover:bg-white/35 text-white border-white/40 backdrop-blur-md shadow-lg"
                  >
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={handleCancelEdit}
                    className="text-white/80 hover:text-white hover:bg-white/15 backdrop-blur-sm"
                  >
                    Cancel
                  </Button>
                  <span className="text-xs text-white/60">Press Enter to save, Esc to cancel</span>
                </div>
              </motion.div>
            ) : (
              <>
                <MessageBubbleContent
                  message={message}
                  isUser={isUser}
                  searchQuery={searchQuery}
                />
                <MessageBubbleTimestamp
                  timestamp={timestamp}
                  status={status}
                  isUser={isUser}
                />
              </>
            )}
            
            {/* Action buttons */}
            <MessageBubbleActions
              isUser={isUser}
              isHovered={isHovered}
              isCopied={isCopied}
              isRegenerating={isRegenerating}
              onCopy={handleCopy}
              onEdit={handleStartEdit}
              onRegenerate={onRegenerate ? () => messageId && onRegenerate(messageId) : undefined}
              showEdit={!!(isUser && onStartEdit && messageId)}
              showRegenerate={!!(!isUser && onRegenerate && messageId)}
            />
          </div>
        </MessageBubbleGradient>
      </MessageBubbleContainer>
    </motion.div>
  );
}

// Memoize MessageBubble to prevent unnecessary re-renders
// Only re-render if props actually change
export default memo(MessageBubble, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return (
    prevProps.message === nextProps.message &&
    prevProps.isUser === nextProps.isUser &&
    prevProps.timestamp === nextProps.timestamp &&
    prevProps.status === nextProps.status &&
    prevProps.searchQuery === nextProps.searchQuery &&
    prevProps.isHighlighted === nextProps.isHighlighted &&
    prevProps.messageId === nextProps.messageId &&
    prevProps.isRegenerating === nextProps.isRegenerating &&
    prevProps.isEditing === nextProps.isEditing
    // Note: Function props (onRegenerate, onEdit, etc.) are compared by reference
    // They should be wrapped in useCallback in parent component
  );
});
