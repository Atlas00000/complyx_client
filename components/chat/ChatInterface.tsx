'use client';

import { useRef, useEffect } from 'react';

interface ChatInterfaceProps {
  children?: React.ReactNode;
}

export default function ChatInterface({ children }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  });

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex flex-col space-y-4">
          {children}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
