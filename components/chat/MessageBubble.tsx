'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import Button from '@/components/ui/Button';

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

  const formatTime = (date?: Date | string): string => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return '';
    
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(dateObj);
  };

  // Highlight search query in message text (for markdown, we'll highlight in the rendered content)
  const highlightText = (text: string, query?: string) => {
    if (!query || !query.trim()) {
      return text;
    }

    // Simple regex replacement for markdown content
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, (match) => `**${match}**`);
  };

  // Markdown components with custom styling
  const markdownComponents = {
    p: ({ children }: any) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
    h1: ({ children }: any) => <h1 className="text-h3 font-bold mb-3 mt-4 first:mt-0">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-h4 font-bold mb-2 mt-4 first:mt-0">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-h5 font-semibold mb-2 mt-3 first:mt-0">{children}</h3>,
    h4: ({ children }: any) => <h4 className="text-h6 font-semibold mb-2 mt-3 first:mt-0">{children}</h4>,
    ul: ({ children }: any) => <ul className="list-disc list-inside mb-3 space-y-1 ml-4">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-4">{children}</ol>,
    li: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary/30 pl-4 py-2 my-3 italic bg-gray-50 rounded-r">
        {children}
      </blockquote>
    ),
    code: ({ inline, children, className }: any) => {
      if (inline) {
        return (
          <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">
            {children}
          </code>
        );
      }
      return (
        <code className={`block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono mb-3 ${className || ''}`}>
          {children}
        </code>
      );
    },
    pre: ({ children }: any) => <pre className="mb-3">{children}</pre>,
    a: ({ href, children }: any) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:text-primary-dark underline"
      >
        {children}
      </a>
    ),
    strong: ({ children }: any) => (
      <strong className="font-semibold text-gray-900">
        {searchQuery && typeof children === 'string' && children.toLowerCase().includes(searchQuery.toLowerCase()) ? (
          <mark className="bg-warning-light text-gray-900 px-1 rounded font-medium">
            {children}
          </mark>
        ) : (
          children
        )}
      </strong>
    ),
    em: ({ children }: any) => <em className="italic">{children}</em>,
    hr: () => <hr className="my-4 border-gray-200" />,
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-3">
        <table className="min-w-full border-collapse border border-gray-200 rounded-lg">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => <thead className="bg-gray-50">{children}</thead>,
    tbody: ({ children }: any) => <tbody>{children}</tbody>,
    tr: ({ children }: any) => <tr className="border-b border-gray-200">{children}</tr>,
    th: ({ children }: any) => (
      <th className="px-4 py-2 text-left font-semibold text-gray-900 border border-gray-200">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="px-4 py-2 text-gray-700 border border-gray-200">
        {children}
      </td>
    ),
  };
  
  return (
    <motion.div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full group`}
      id={messageId ? `message-${messageId}` : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <motion.div
        className={`max-w-[80%] px-5 py-4 rounded-2xl break-words relative transition-all duration-200 ${
          isUser
            ? 'bg-primary text-white shadow-primary'
            : 'bg-white text-gray-900 shadow-md border border-gray-200'
        } ${
          isHighlighted ? 'ring-2 ring-warning ring-offset-2' : ''
        }`}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        {isEditing && isUser ? (
          <div className="space-y-3">
            <textarea
              ref={editInputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleEditKeyDown}
              className="w-full px-3 py-2 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
              rows={3}
              placeholder="Edit your message..."
            />
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="secondary"
                size="small"
                onClick={handleSaveEdit}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                Save
              </Button>
              <Button
                variant="ghost"
                size="small"
                onClick={handleCancelEdit}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <span className="text-xs text-white/50">Press Enter to save, Esc to cancel</span>
            </div>
          </div>
        ) : (
          <>
            <div className={`text-body leading-relaxed prose prose-sm max-w-none ${
              isUser 
                ? 'prose-invert prose-headings:text-white prose-p:text-white/90 prose-strong:text-white prose-code:text-white/90 prose-pre:bg-white/10' 
                : 'prose-gray prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900'
            }`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {searchQuery ? highlightText(message, searchQuery) : message}
              </ReactMarkdown>
            </div>
            <div className={`flex items-center justify-end gap-2 mt-3 text-xs ${
              isUser ? 'text-white/70' : 'text-gray-500'
            }`}>
              {timestamp && (
                <span>{formatTime(timestamp)}</span>
              )}
              {isUser && status === 'sending' && (
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-1"
                >
                  •
                </motion.span>
              )}
            </div>
          </>
        )}
        
        {/* Action buttons - shown on hover */}
        <AnimatePresence>
          {(isHovered || isCopied) && !isEditing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className={`absolute top-3 ${isUser ? 'left-3' : 'right-3'} flex gap-1.5`}
            >
              {/* Edit button - only for user messages */}
              {isUser && onStartEdit && messageId && (
                <motion.button
                  onClick={handleStartEdit}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isUser
                      ? 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  title="Edit message"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </motion.button>
              )}
              
              {/* Regenerate button - only for AI messages */}
              {!isUser && onRegenerate && messageId && (
                <motion.button
                  onClick={() => onRegenerate(messageId)}
                  disabled={isRegenerating}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isRegenerating
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  title={isRegenerating ? 'Regenerating...' : 'Regenerate response'}
                  whileHover={!isRegenerating ? { scale: 1.1 } : {}}
                  whileTap={!isRegenerating ? { scale: 0.9 } : {}}
                >
                  {isRegenerating ? (
                    <motion.svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </motion.svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                </motion.button>
              )}
              
              {/* Copy button */}
              <motion.button
                onClick={handleCopy}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isUser
                    ? isCopied
                      ? 'bg-secondary text-white'
                      : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                    : isCopied
                      ? 'bg-secondary text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                title={isCopied ? 'Copied!' : 'Copy message'}
                whileHover={!isCopied ? { scale: 1.1 } : {}}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {isCopied ? (
                    <motion.svg
                      key="check"
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  ) : (
                    <motion.svg
                      key="copy"
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
