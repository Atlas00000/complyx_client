'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/useMediaQuery';
import AnimatedBackground from './AnimatedBackground';
import FloatingParticles from './FloatingParticles';
import CustomScrollbar from './CustomScrollbar';
import DynamicGradientOverlay from './DynamicGradientOverlay';
import ChatEmptyState from './ChatEmptyState';

interface ChatInterfaceProps {
  children?: ReactNode;
  isEmpty?: boolean;
  suggestedPrompts?: ReactNode;
  chatInput?: ReactNode;
  showSuggestedPrompts?: boolean;
}

export default function ChatInterface({ 
  children, 
  isEmpty = false,
  suggestedPrompts,
  chatInput,
  showSuggestedPrompts = false,
}: ChatInterfaceProps) {
  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Calculate bottom padding based on mobile and whether messages exist
  const hasMessages = !isEmpty && children;
  const bottomPadding = isMobile && hasMessages && !showSuggestedPrompts 
    ? 'pb-32' // Account for fixed input + bottom nav on mobile
    : showSuggestedPrompts 
    ? 'pb-8 md:pb-10' 
    : isMobile && hasMessages
    ? 'pb-32'
    : '';

  const scrollToBottom = () => {
    if (messagesEndRef.current && scrollContainerRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  });

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden">
      {/* Animated Background Layer */}
      <AnimatedBackground />
      
      {/* Floating Particles Layer */}
      <FloatingParticles count={6} />
      
      {/* Main Content Container */}
      <div className="relative z-10 flex-1 min-h-0 flex items-center justify-center p-4 md:p-6 lg:p-8">
        <div className="w-full sm:w-[90%] md:w-[85%] lg:w-[85%] h-full flex flex-col">
          {/* Glassmorphism Container */}
          <motion.div
            className="relative flex-1 min-h-0 rounded-3xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.5) 100%)',
            }}
          >
            {/* Dark mode background */}
            <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-slate-800/70 via-slate-800/60 to-slate-800/70" />
            
            {/* Border with gradient */}
            <div className="absolute inset-0 rounded-3xl border border-white/30 dark:border-slate-700/40 pointer-events-none" />
            
            {/* Inner glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 dark:from-primary/10 dark:via-transparent dark:to-accent/10 pointer-events-none" />
            
            {/* Scrollable Content Area */}
            <CustomScrollbar className="flex-1 min-h-0">
              <div 
                ref={scrollContainerRef}
                className={`relative h-full p-6 md:p-8 lg:p-10 ${bottomPadding}`}
              >
                {/* Dynamic Gradient Overlay */}
                <DynamicGradientOverlay scrollContainerRef={scrollContainerRef} />
                
                {/* Content */}
                <motion.div
                  className="relative z-10 flex flex-col space-y-6 min-h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {isEmpty ? (
                    <ChatEmptyState />
                  ) : (
                    <>
                      {children}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </motion.div>
              </div>
            </CustomScrollbar>
            
            {/* Suggested Prompts - Inside container at bottom */}
            {showSuggestedPrompts && suggestedPrompts && (
              <div className="relative z-10 px-4 sm:px-6 pb-8 md:pb-6">
                {suggestedPrompts}
              </div>
            )}
            
            {/* Chat Input - Inside container at bottom */}
            {chatInput && (
              <div className="relative z-10">
                {chatInput}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Subtle edge glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent dark:via-primary/30" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent dark:via-accent/30" />
      </div>
    </div>
  );
}
