'use client';

import { useState, useCallback, KeyboardEvent, FormEvent } from 'react';
import { useKeyboardOffset } from '@/hooks/useKeyboardOffset';

interface MobileChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * MobileChatInput
 *
 * Chat input for mobile: textarea + send button. Fixed at bottom with safe-area.
 * No Framer Motion. Self-contained state.
 */
export default function MobileChatInput({
  onSendMessage,
  disabled = false,
  placeholder = 'Type your message...',
}: MobileChatInputProps) {
  const [value, setValue] = useState('');
  const keyboardOffset = useKeyboardOffset();

  const send = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed && !disabled) {
      onSendMessage(trimmed);
      setValue('');
    }
  }, [value, disabled, onSendMessage]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    send();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div
      className="flex-shrink-0 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"
      style={{
        paddingBottom: keyboardOffset > 0 ? `${keyboardOffset}px` : 'env(safe-area-inset-bottom)',
      }}
    >
      <form onSubmit={handleSubmit} className="p-3 flex gap-2 items-end">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 min-h-[44px] max-h-28 px-4 py-3 rounded-xl resize-none bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-slate-100 placeholder:text-gray-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary text-base"
          aria-label="Message"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Send"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
}
