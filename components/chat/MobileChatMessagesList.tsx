'use client';

import { useRef, useEffect } from 'react';
import { useChatStore } from '@/stores/chatStore';
import MobileChatMessageBubble from './MobileChatMessageBubble';
import MobileChatEmptyState from './MobileChatEmptyState';
import MobileChatTypingIndicator from './MobileChatTypingIndicator';

/**
 * MobileChatMessagesList
 *
 * Scrollable messages area for mobile. Reads messages and isTyping from useChatStore.
 * Renders bubbles, empty state, or typing indicator. No Framer Motion.
 */
export default function MobileChatMessagesList() {
  const messages = useChatStore((s) => s.messages);
  const isTyping = useChatStore((s) => s.isTyping);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isTyping]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col gap-3 p-4 pb-6">
        {isEmpty && !isTyping ? (
          <MobileChatEmptyState />
        ) : (
          <>
            {messages.map((msg) => (
              <MobileChatMessageBubble
                key={msg.id}
                message={msg.content}
                isUser={msg.isUser}
              />
            ))}
            <MobileChatTypingIndicator isTyping={isTyping} />
            <div ref={scrollEndRef} />
          </>
        )}
      </div>
    </div>
  );
}
