'use client';

import { useRef, useEffect, useState, useCallback, ReactNode } from 'react';
import { motion } from 'framer-motion';
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
  /** Week 1: Content above input (e.g. Start/Resume assessment chip) */
  aboveInput?: ReactNode;
}

export default function ChatInterface({ 
  children, 
  isEmpty = false,
  suggestedPrompts,
  chatInput,
  showSuggestedPrompts = false,
  aboveInput,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  const bottomPadding = showSuggestedPrompts ? 'pb-6 sm:pb-8 md:pb-10' : '';

  const scrollToBottom = useCallback(() => {
    if (!isAutoScrollEnabled) return;
    if (messagesEndRef.current && scrollContainerRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [isAutoScrollEnabled]);

  // Auto-scroll only when user is near the bottom; disable when they scroll up
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - clientHeight - scrollTop;
      // If within 120px of bottom, keep auto-scroll enabled; otherwise, pause it
      setIsAutoScrollEnabled(distanceFromBottom < 120);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    // Initialize state based on initial position
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll when content changes and auto-scroll is allowed
  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom, children]);

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden">
      {/* Animated Background Layer */}
      <AnimatedBackground />
      
      {/* Floating Particles Layer */}
      <FloatingParticles count={6} />
      
      {/* Main Content Container - responsive padding and width */}
      <div className="relative z-10 flex-1 min-h-0 flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-4xl sm:w-[92%] md:w-[88%] lg:w-[85%] h-full flex flex-col">
          {/* Glassmorphism Container */}
          <motion.div
            className="relative flex-1 min-h-0 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col"
            initial={false}
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
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-white/30 dark:border-slate-700/40 pointer-events-none" />
            
            {/* Inner glow */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 dark:from-primary/10 dark:via-transparent dark:to-accent/10 pointer-events-none" />
            
            {/* Scrollable Content Area */}
            <CustomScrollbar className="flex-1 min-h-0">
              <div 
                ref={scrollContainerRef}
                className={`relative h-full p-4 sm:p-6 md:p-8 lg:p-10 ${bottomPadding}`}
              >
                {/* Dynamic Gradient Overlay */}
                <DynamicGradientOverlay scrollContainerRef={scrollContainerRef} />
                
                {/* Content */}
                <motion.div
                  className="relative z-10 flex flex-col space-y-4 sm:space-y-6 min-h-full"
                  initial={false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {isEmpty ? (
                    <ChatEmptyState primaryAction={aboveInput} />
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
              <div className="relative z-10 px-3 sm:px-4 md:px-6 pb-6 sm:pb-8">
                {suggestedPrompts}
              </div>
            )}

            {/* Week 1: Start/Resume chip - above input. z-20 + pointer-events-auto so chip is clickable */}
            {aboveInput && !isEmpty && (
              <div className="relative z-20 shrink-0 px-3 sm:px-4 md:px-6 pb-2 flex justify-center min-h-[2.5rem] pointer-events-auto">
                {aboveInput}
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
