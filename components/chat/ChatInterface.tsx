'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/layout';

interface ChatInterfaceProps {
  children?: ReactNode;
}

export default function ChatInterface({ children }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current && scrollContainerRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  });

  return (
    <div className="flex flex-col h-full w-full bg-gray-50">
      <Container size="standard" className="flex-1 min-h-0">
        <div 
          ref={scrollContainerRef}
          className="h-full overflow-y-auto overflow-x-hidden p-6 space-y-6"
          style={{ 
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <motion.div
            className="flex flex-col space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {children}
            <div ref={messagesEndRef} />
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
