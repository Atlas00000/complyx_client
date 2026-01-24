'use client';

import { useState, useEffect } from 'react';
import { Citations } from '@/components/ai/Citations';
import MessageBubble from './MessageBubble';

interface EnhancedMessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: Date | string;
  status?: 'sending' | 'sent' | 'delivered' | 'error';
  showCitations?: boolean;
  showRecommendations?: boolean;
  assessmentId?: string;
  answers?: Array<{ questionId: string; value: string }>;
  ifrsStandard?: 'S1' | 'S2';
}

export function EnhancedMessageBubble({
  message,
  isUser,
  timestamp,
  status,
  showCitations = true,
  showRecommendations = false,
}: EnhancedMessageBubbleProps) {
  const [citations, setCitations] = useState<boolean>(false);

  useEffect(() => {
    // Auto-extract citations from assistant messages if enabled
    if (!isUser && showCitations && message) {
      const hasCitations = message.includes('IFRS S') || message.includes('S1-') || message.includes('S2-');
      setCitations(hasCitations);
    }
  }, [message, isUser, showCitations]);

  // Only show enhancements for assistant messages
  if (isUser || (!showCitations && !showRecommendations)) {
    return (
      <MessageBubble
        message={message}
        isUser={isUser}
        timestamp={timestamp}
        status={status}
      />
    );
  }

  return (
    <div className="w-full space-y-2">
      <MessageBubble
        message={message}
        isUser={isUser}
        timestamp={timestamp}
        status={status}
      />
      
      {/* Citations */}
      {showCitations && citations && (
        <div className="ml-2 max-w-[80%]">
          <Citations text={message} showConfidence={false} />
        </div>
      )}
    </div>
  );
}
