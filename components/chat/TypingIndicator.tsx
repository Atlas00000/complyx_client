'use client';

import { useState, useEffect, useRef } from 'react';

interface TypingIndicatorProps {
  isTyping?: boolean;
  progress?: number; // 0-1 progress indicator
  estimatedTime?: number; // Estimated time in seconds
  message?: string; // Optional progressive message preview
}

/**
 * Enhanced Typing Indicator with realistic delays and progressive rendering
 */
export default function TypingIndicator({ 
  isTyping = true, 
  progress,
  estimatedTime,
  message,
}: TypingIndicatorProps) {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [showTypingDots, setShowTypingDots] = useState(true);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messageIndexRef = useRef(0);

  // Progressive message rendering (typewriter effect)
  useEffect(() => {
    if (!message || !isTyping) {
      setDisplayedMessage('');
      messageIndexRef.current = 0;
      return;
    }

    // Calculate typing speed (words per minute, default 150 WPM)
    const wordsPerMinute = 150;
    const charsPerSecond = (wordsPerMinute * 5) / 60; // Average 5 chars per word
    const delayMs = Math.max(30, Math.floor(1000 / charsPerSecond)); // Minimum 30ms delay

    typingIntervalRef.current = setInterval(() => {
      if (messageIndexRef.current < message.length) {
        setDisplayedMessage(message.substring(0, messageIndexRef.current + 1));
        messageIndexRef.current += 1;
      } else {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
        setShowTypingDots(false);
      }
    }, delayMs);

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, [message, isTyping]);

  // Reset when typing stops
  useEffect(() => {
    if (!isTyping) {
      setDisplayedMessage('');
      setShowTypingDots(true);
      messageIndexRef.current = 0;
    }
  }, [isTyping]);

  if (!isTyping && !displayedMessage) return null;

  const formatTime = (seconds?: number): string => {
    if (!seconds) return '';
    if (seconds < 60) return `~${Math.ceil(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = Math.ceil(seconds % 60);
    return `~${minutes}m ${secs}s`;
  };

  return (
    <div className="flex justify-start w-full animate-fade-in">
      <div className="bg-gray-200 text-gray-900 max-w-[80%] px-4 py-3 rounded-2xl shadow-sm">
        {/* Progressive message preview */}
        {displayedMessage && (
          <div className="mb-2 text-sm">
            <span className="text-gray-700">{displayedMessage}</span>
            {messageIndexRef.current < message.length && (
              <span className="animate-pulse text-gray-400">|</span>
            )}
          </div>
        )}

        {/* Typing indicator */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {displayedMessage ? 'Complyx is still typing' : 'Complyx is typing'}
          </span>
          
          {/* Animated typing dots */}
          {showTypingDots && (
            <div className="flex gap-1">
              <div 
                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" 
                style={{ animationDelay: '0ms' }}
              />
              <div 
                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" 
                style={{ animationDelay: '150ms' }}
              />
              <div 
                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" 
                style={{ animationDelay: '300ms' }}
              />
            </div>
          )}

          {/* Progress indicator */}
          {progress !== undefined && progress > 0 && (
            <div className="ml-2 flex items-center gap-2">
              <div className="w-20 h-1 bg-gray-300 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              {estimatedTime && (
                <span className="text-xs text-gray-500">{formatTime(estimatedTime)}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Hook for progressive message rendering with realistic typing delays
 */
export function useProgressiveRendering(
  fullMessage: string,
  options: {
    wordsPerMinute?: number;
    enabled?: boolean;
  } = {}
): string {
  const { wordsPerMinute = 150, enabled = true } = options;
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    if (!enabled || !fullMessage) {
      setDisplayedText('');
      indexRef.current = 0;
      return;
    }

    // Calculate typing delay
    const charsPerSecond = (wordsPerMinute * 5) / 60;
    const delayMs = Math.max(20, Math.floor(1000 / charsPerSecond));

    const interval = setInterval(() => {
      if (indexRef.current < fullMessage.length) {
        setDisplayedText(fullMessage.substring(0, indexRef.current + 1));
        indexRef.current += 1;
      } else {
        clearInterval(interval);
      }
    }, delayMs);

    return () => clearInterval(interval);
  }, [fullMessage, enabled, wordsPerMinute]);

  return displayedText;
}

/**
 * Hook for realistic typing delays based on content length
 */
export function useTypingDelay(contentLength: number): number {
  // Calculate typing delay based on content length
  // Average typing speed: 40 WPM for AI, ~200 chars/minute
  const averageCharsPerMinute = 200;
  const estimatedSeconds = Math.ceil(contentLength / (averageCharsPerMinute / 60));
  
  // Add minimum delay for perceived responsiveness (1-2 seconds)
  const minDelay = 1000;
  const maxDelay = 5000; // Cap at 5 seconds
  
  return Math.max(minDelay, Math.min(maxDelay, estimatedSeconds * 1000));
}
