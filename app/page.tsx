'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useChatStore } from '@/stores/chatStore';
import { useSessionStore } from '@/stores/sessionStore';
import { useChatSearch } from '@/hooks/useChatSearch';
import { usePageLoading } from '@/hooks/usePageLoading';
import { Header, ResponsiveLayout, MobileHeader, MobileNavigation } from '@/components/layout';
import PageBackground from '@/components/layout/PageBackground';
import PageOverlay from '@/components/layout/PageOverlay';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { Button } from '@/components/ui';
import LoadingScreen from '@/components/ui/loading/LoadingScreen';
import ChatInterface from '@/components/chat/ChatInterface';
import MessageBubble from '@/components/chat/MessageBubble';
import ChatInput from '@/components/chat/ChatInput';
import MobileChatInput from '@/components/chat/MobileChatInput';
import TypingIndicator from '@/components/chat/TypingIndicator';
import SearchInput from '@/components/chat/SearchInput';
import SuggestedPrompts from '@/components/chat/SuggestedPrompts';
import SessionList from '@/components/chat/SessionList';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Home() {
  const isMobile = useIsMobile();
  
  // Page loading state - show for at least 1 second to ensure visibility
  const isPageLoading = usePageLoading({ minLoadingTime: 1000 });
  
  const {
    messages,
    isTyping,
    currentSessionId,
    addMessage,
    updateMessage,
    removeMessage,
    setIsTyping,
    setIfrsStandard,
    clearMessages,
    setCurrentSession,
  } = useChatStore();

  const {
    activeSessionId,
    createSession,
    setActiveSession,
    updateSessionPreview,
    updateSessionMessageCount,
  } = useSessionStore();

  const [welcomeSent, setWelcomeSent] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSessionListOpen, setIsSessionListOpen] = useState(false);
  const [regeneratingMessageId, setRegeneratingMessageId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    currentMatchIndex,
    currentResult,
    totalMatches,
    goToNextMatch,
    goToPreviousMatch,
    resetSearch,
    hasResults,
  } = useChatSearch(messages);

  // Initialize session on first load
  useEffect(() => {
    if (!currentSessionId && !activeSessionId) {
      const newSessionId = createSession();
      setCurrentSession(newSessionId);
      setActiveSession(newSessionId);
    } else if (activeSessionId && activeSessionId !== currentSessionId) {
      setCurrentSession(activeSessionId);
      setActiveSession(activeSessionId);
    }
  }, [currentSessionId, activeSessionId, createSession, setCurrentSession, setActiveSession]);

  // Sync session IDs
  useEffect(() => {
    if (activeSessionId && activeSessionId !== currentSessionId) {
      setCurrentSession(activeSessionId);
    }
  }, [activeSessionId, currentSessionId, setCurrentSession]);

  // Send welcome message on first load
  useEffect(() => {
    if (!welcomeSent && messages.length === 0 && currentSessionId) {
      setWelcomeSent(true);
      addMessage({
        content: "Hello! I'm Complyx, your AI assistant for IFRS standards and general accounting knowledge, with particular expertise in IFRS S1 (Sustainability-related Financial Information Disclosures) and IFRS S2 (Climate-related Disclosures). I can help you understand IFRS requirements, answer questions about compliance and accounting standards, and guide you through various aspects of financial reporting. How can I assist you today?",
        isUser: false,
      });
    }
  }, [messages.length, welcomeSent, addMessage, currentSessionId]);

  // Initialize IFRS standard if not set
  useEffect(() => {
    if (!setIfrsStandard) return;
    const storedStandard = localStorage.getItem('complyx-ifrs-standard') as 'S1' | 'S2' | null;
    if (!storedStandard) {
      setIfrsStandard('S1');
      localStorage.setItem('complyx-ifrs-standard', 'S1');
    } else {
      setIfrsStandard(storedStandard);
    }
  }, [setIfrsStandard]);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleStartEdit = useCallback((messageId: string) => {
    setEditingMessageId(messageId);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingMessageId(null);
  }, []);

  const handleEditMessage = useCallback(async (messageId: string, newContent: string) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1 || !messages[messageIndex].isUser) return;

    if (messages[messageIndex].content.trim() === newContent.trim()) {
      setEditingMessageId(null);
      return;
    }

    const messagesToRemove: string[] = [messageId];
    for (let i = messageIndex + 1; i < messages.length; i++) {
      if (messages[i].isUser) break;
      messagesToRemove.push(messages[i].id);
    }

    messagesToRemove.forEach((id) => removeMessage(id));
    updateMessage(messageId, { content: newContent });
    setEditingMessageId(null);
    setIsTyping(true);

    try {
      const conversationHistory = messages
        .slice(0, messageIndex)
        .map((m) => ({
          role: m.isUser ? 'user' : 'assistant',
          content: m.content,
        }));

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newContent,
          messages: conversationHistory,
          stream: false,
          useRAG: true,
          ragTopK: 5,
          ragMinScore: 0.5,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        addMessage({
          content: data.message,
          isUser: false,
        });
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        addMessage({
          content: errorData.error || 'Sorry, I encountered an error. Please try again.',
          isUser: false,
        });
      }
    } catch (error) {
      console.error('Edit message error:', error);
      addMessage({
        content: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
      });
    } finally {
      setIsTyping(false);
    }
  }, [messages, removeMessage, updateMessage, addMessage, setIsTyping]);

  const handleRegenerate = useCallback(async (messageId: string) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1 || messages[messageIndex].isUser) return;

    let userMessageIndex = -1;
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (messages[i].isUser) {
        userMessageIndex = i;
        break;
      }
    }

    if (userMessageIndex === -1) return;

    const userMessage = messages[userMessageIndex];
    removeMessage(messageId);
    setRegeneratingMessageId(messageId);
    setIsTyping(true);

    try {
      const conversationHistory = messages
        .slice(0, messageIndex)
        .map((m) => ({
          role: m.isUser ? 'user' : 'assistant',
          content: m.content,
        }));

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          messages: conversationHistory,
          stream: false,
          useRAG: true,
          ragTopK: 5,
          ragMinScore: 0.5,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        addMessage({
          content: data.message,
          isUser: false,
        });
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        addMessage({
          content: errorData.error || 'Sorry, I encountered an error while regenerating. Please try again.',
          isUser: false,
        });
      }
    } catch (error) {
      console.error('Regenerate error:', error);
      addMessage({
        content: 'Sorry, I encountered an error while regenerating. Please try again.',
        isUser: false,
      });
    } finally {
      setIsTyping(false);
      setRegeneratingMessageId(null);
    }
  }, [messages, removeMessage, addMessage, setIsTyping, setRegeneratingMessageId]);

  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.content) {
        updateSessionPreview(currentSessionId, lastMessage.content);
      }
      updateSessionMessageCount(currentSessionId, messages.length);
    }
  }, [messages, currentSessionId, updateSessionPreview, updateSessionMessageCount]);

  const handleSelectSession = useCallback((sessionId: string) => {
    setActiveSession(sessionId);
    setCurrentSession(sessionId);
    setWelcomeSent(false);
  }, [setActiveSession, setCurrentSession]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!currentSessionId) {
      const newSessionId = createSession();
      setCurrentSession(newSessionId);
      setActiveSession(newSessionId);
    }

    addMessage({
      content,
      isUser: true,
      status: 'sent',
    });

    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          messages: messages.map((m) => ({
            role: m.isUser ? 'user' : 'assistant',
            content: m.content,
          })),
          stream: false,
          useRAG: true,
          ragTopK: 5,
          ragMinScore: 0.5,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        addMessage({
          content: data.message,
          isUser: false,
        });
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        addMessage({
          content: errorData.error || 'Sorry, I encountered an error. Please try again.',
          isUser: false,
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({
        content: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
      });
    } finally {
      setIsTyping(false);
    }
  }, [currentSessionId, messages, addMessage, setIsTyping, createSession, setCurrentSession, setActiveSession]);

  const handleFileUpload = useCallback((file: File) => {
    console.log('File uploaded:', file.name);
  }, []);

  const handleClearChat = useCallback(() => {
    if (confirm('Are you sure you want to clear the chat? This will remove all messages.')) {
      clearMessages();
      setWelcomeSent(false);
      resetSearch();
    }
  }, [clearMessages, resetSearch]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, [setSearchQuery]);

  const handleSearchClose = useCallback(() => {
    setIsSearchOpen(false);
    resetSearch();
  }, [resetSearch]);

  const handleSearchToggle = useCallback(() => {
    setIsSearchOpen((prev) => {
      if (prev) {
        resetSearch();
      }
      return !prev;
    });
  }, [resetSearch]);

  useEffect(() => {
    if (currentResult?.messageId) {
      const element = document.getElementById(`message-${currentResult.messageId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentResult]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        resetSearch();
      }

      if (isSearchOpen && hasResults && searchQuery) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'g') {
          e.preventDefault();
          if (e.shiftKey) {
            goToPreviousMatch();
          } else {
            goToNextMatch();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, hasResults, searchQuery, goToNextMatch, goToPreviousMatch, resetSearch]);

  // Memoize mobile navigation items to prevent recreation on every render
  const mobileNavItems = useMemo(() => [
    {
      label: 'Chat',
      href: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ], []);

  // Show loading screen during initial page load
  if (isPageLoading) {
    return <LoadingScreen text="Loading Complyx..." />;
  }

  return (
    <ResponsiveLayout>
      {/* Animated Background */}
      <PageBackground />
      
      {/* Overlay Effects */}
      <PageOverlay />
      
      {/* Session List */}
      <SessionList
        isOpen={isSessionListOpen}
        onClose={() => setIsSessionListOpen(false)}
        onSelectSession={handleSelectSession}
      />

      {/* Search Input */}
      <SearchInput
        onSearch={handleSearch}
        onClose={handleSearchClose}
        isOpen={isSearchOpen}
        placeholder="Search messages..."
      />

      {/* Search Results Info */}
      {isSearchOpen && hasResults && searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-4 py-2 shadow-lg z-10 flex items-center gap-4"
        >
          <span className="text-sm text-gray-600 dark:text-slate-300">
            {currentMatchIndex + 1} of {searchResults.length} messages ({totalMatches} matches)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="small"
              onClick={goToPreviousMatch}
              title="Previous (Shift + Cmd/Ctrl + G)"
            >
              ↑ Prev
            </Button>
            <Button
              variant="ghost"
              size="small"
              onClick={goToNextMatch}
              title="Next (Cmd/Ctrl + G)"
            >
              Next ↓
            </Button>
          </div>
        </motion.div>
      )}

      {/* Header - Mobile or Desktop */}
      {isMobile ? (
        <MobileHeader
          title="Complyx"
          leftActions={
            <Button
              variant="ghost"
              size="small"
              onClick={() => setIsSessionListOpen(true)}
              title="Chat history"
              className="p-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </Button>
          }
          rightActions={
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="small"
                  onClick={handleSearchToggle}
                  title="Search"
                  className="p-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </Button>
              )}
            </div>
          }
          onMenuClick={() => setIsSessionListOpen(true)}
        />
      ) : (
        <Header
          title="Complyx"
          subtitle="IFRS S1 & S2 Readiness Assessment Assistant"
          leftActions={
            <Button
              variant="ghost"
              size="medium"
              onClick={() => setIsSessionListOpen(true)}
              title="Chat history"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              History
            </Button>
          }
          rightActions={
            <div className="flex items-center gap-3">
              {messages.length > 0 && (
                <>
                  <Button
                    variant="ghost"
                    size="medium"
                    onClick={handleSearchToggle}
                    title="Search messages (Cmd/Ctrl + K)"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </Button>
                  <Button
                    variant="ghost"
                    size="medium"
                    onClick={handleClearChat}
                    title="Clear chat history"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear Chat
                  </Button>
                </>
              )}
              <Button
                variant="primary"
                size="medium"
                onClick={() => window.location.href = '/dashboard'}
              >
                Dashboard
              </Button>
            </div>
          }
        />
      )}

      {/* Chat Interface */}
      <div className={`flex-1 min-h-0 flex flex-col ${isMobile ? 'pb-24' : ''}`}>
        <ChatInterface 
          isEmpty={messages.length === 0 && !isTyping}
          showSuggestedPrompts={messages.length <= 1 && !isTyping && !isSearchOpen}
          suggestedPrompts={
            messages.length <= 1 ? (
              <SuggestedPrompts
                onSelectPrompt={handleSendMessage}
                visible={!isTyping && !isSearchOpen}
                maxPrompts={isMobile ? 4 : 6}
              />
            ) : null
          }
          chatInput={
            isMobile ? (
              <MobileChatInput
                onSend={handleSendMessage}
                onFileUpload={handleFileUpload}
                placeholder="Ask me anything about IFRS standards..."
                fixed={!(messages.length <= 1 && !isTyping && !isSearchOpen)}
              />
            ) : (
              <ChatInput
                onSendMessage={handleSendMessage}
                onFileUpload={handleFileUpload}
                placeholder="Ask me anything about IFRS standards, accounting, or compliance..."
              />
            )
          }
        >
          {messages.map((message, index) => {
            const isHighlighted = currentResult?.messageId === message.id;
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: 'easeOut',
                }}
              >
                <MessageBubble
                  messageId={message.id}
                  message={message.content}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                  status={message.status}
                  searchQuery={searchQuery}
                  isHighlighted={isHighlighted}
                  onRegenerate={!message.isUser ? handleRegenerate : undefined}
                  isRegenerating={regeneratingMessageId === message.id}
                  onEdit={message.isUser ? handleEditMessage : undefined}
                  isEditing={editingMessageId === message.id}
                  onStartEdit={message.isUser ? handleStartEdit : undefined}
                  onCancelEdit={message.isUser ? handleCancelEdit : undefined}
                />
              </motion.div>
            );
          })}
          {isTyping && <TypingIndicator isTyping={isTyping} />}
        </ChatInterface>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <MobileNavigation items={mobileNavItems} />
      )}
    </ResponsiveLayout>
  );
}
