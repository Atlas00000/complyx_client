'use client';

import { useEffect, useState } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { useSessionStore } from '@/stores/sessionStore';
import { useChatSearch } from '@/hooks/useChatSearch';
import ChatInterface from '@/components/chat/ChatInterface';
import MessageBubble from '@/components/chat/MessageBubble';
import ChatInput from '@/components/chat/ChatInput';
import TypingIndicator from '@/components/chat/TypingIndicator';
import SearchInput from '@/components/chat/SearchInput';
import SuggestedPrompts from '@/components/chat/SuggestedPrompts';
import SessionList from '@/components/chat/SessionList';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Home() {
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
    loadSessionMessages,
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

  // Chat search functionality
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
    // Set default to S1 for context
    const storedStandard = localStorage.getItem('complyx-ifrs-standard') as 'S1' | 'S2' | null;
    if (!storedStandard) {
      setIfrsStandard('S1');
      localStorage.setItem('complyx-ifrs-standard', 'S1');
    } else {
      setIfrsStandard(storedStandard);
    }
  }, [setIfrsStandard]);

  const handleStartEdit = (messageId: string) => {
    setEditingMessageId(messageId);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1 || !messages[messageIndex].isUser) return;

    // Don't edit if content is the same
    if (messages[messageIndex].content.trim() === newContent.trim()) {
      setEditingMessageId(null);
      return;
    }

    // Remove the old user message and any following AI responses
    // Find all messages after this user message until the next user message
    const messagesToRemove: string[] = [messageId];
    for (let i = messageIndex + 1; i < messages.length; i++) {
      if (messages[i].isUser) break;
      messagesToRemove.push(messages[i].id);
    }

    // Remove all messages that need to be removed
    messagesToRemove.forEach((id) => removeMessage(id));

    // Update the user message with new content
    updateMessage(messageId, { content: newContent });

    setEditingMessageId(null);
    setIsTyping(true);

    try {
      // Build conversation history up to this message (exclusive)
      const conversationHistory = messages
        .slice(0, messageIndex)
        .map((m) => ({
          role: m.isUser ? 'user' : 'assistant',
          content: m.content,
        }));

      // Send the edited message
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
  };

  const handleRegenerate = async (messageId: string) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1 || messages[messageIndex].isUser) return;

    // Find the user message that triggered this response
    let userMessageIndex = -1;
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (messages[i].isUser) {
        userMessageIndex = i;
        break;
      }
    }

    if (userMessageIndex === -1) return;

    const userMessage = messages[userMessageIndex];
    
    // Remove the AI message to regenerate
    removeMessage(messageId);
    setRegeneratingMessageId(messageId);

    setIsTyping(true);

    try {
      // Build conversation history up to the user message (exclusive of the message being regenerated)
      const conversationHistory = messages
        .slice(0, messageIndex)
        .map((m) => ({
          role: m.isUser ? 'user' : 'assistant',
          content: m.content,
        }));

      // Send regenerate request
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
  };

  // Update session preview and message count when messages change
  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.content) {
        updateSessionPreview(currentSessionId, lastMessage.content);
      }
      updateSessionMessageCount(currentSessionId, messages.length);
    }
  }, [messages, currentSessionId, updateSessionPreview, updateSessionMessageCount]);

  const handleCreateSession = () => {
    const newSessionId = createSession();
    setCurrentSession(newSessionId);
    setActiveSession(newSessionId);
    setWelcomeSent(false); // Reset welcome message flag for new session
  };

  const handleSelectSession = (sessionId: string) => {
    setActiveSession(sessionId);
    setCurrentSession(sessionId);
    setWelcomeSent(false); // Reset welcome message flag when switching sessions
  };

  const handleSendMessage = async (content: string) => {
    // Ensure we have a session
    if (!currentSessionId) {
      const newSessionId = createSession();
      setCurrentSession(newSessionId);
      setActiveSession(newSessionId);
    }

    // Add user message
    addMessage({
      content,
      isUser: true,
      status: 'sent',
    });

    setIsTyping(true);

    try {
      // Send to chat API with RAG enabled for context-aware responses
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
          useRAG: true, // Enable RAG for context-aware responses using knowledge base
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
  };

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name);
    // TODO: Implement file upload logic
  };

  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear the chat? This will remove all messages.')) {
      clearMessages();
      setWelcomeSent(false); // Reset welcome message flag so it shows again
      resetSearch(); // Clear search when clearing chat
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    resetSearch();
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      resetSearch();
    }
  };

  // Scroll to highlighted message when navigating search results
  useEffect(() => {
    if (currentResult?.messageId) {
      const element = document.getElementById(`message-${currentResult.messageId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentResult]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      
      // Escape to close search
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        resetSearch();
      }

      // Navigate search results when search is open and has results
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

  return (
    <div className="flex flex-col h-screen bg-gray-50 relative">
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
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-lg z-10 flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {currentMatchIndex + 1} of {searchResults.length} messages ({totalMatches} matches)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousMatch}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              title="Previous (Shift + Cmd/Ctrl + G)"
            >
              ↑ Prev
            </button>
            <button
              onClick={goToNextMatch}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              title="Next (Cmd/Ctrl + G)"
            >
              Next ↓
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complyx</h1>
          <p className="text-sm text-gray-600">IFRS S1 & S2 Readiness Assessment Assistant</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSessionListOpen(true)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold flex items-center gap-2"
            title="Chat history"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            History
          </button>
          {messages.length > 0 && (
            <>
              <button
                onClick={handleSearchToggle}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold flex items-center gap-2"
                title="Search messages (Cmd/Ctrl + K)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
              <button
                onClick={handleClearChat}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold flex items-center gap-2"
                title="Clear chat history"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Chat
              </button>
            </>
          )}
          <a
            href="/dashboard"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
          >
            Dashboard
          </a>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-hidden">
          <ChatInterface>
            {messages.map((message) => {
              const isHighlighted = currentResult?.messageId === message.id;
              return (
                <MessageBubble
                  key={message.id}
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
              );
            })}
            {isTyping && <TypingIndicator isTyping={isTyping} />}
          </ChatInterface>
        </div>

        {/* Suggested Prompts - shown when few/no messages */}
        {messages.length <= 1 && (
          <SuggestedPrompts
            onSelectPrompt={handleSendMessage}
            visible={!isTyping && !isSearchOpen}
            maxPrompts={6}
          />
        )}

        {/* Chat Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onFileUpload={handleFileUpload}
          placeholder="Ask me anything about IFRS standards, accounting, or compliance..."
        />
      </div>
    </div>
  );
}
