'use client';

import { useState, FormEvent, KeyboardEvent } from 'react';
import ChatInputContainer from './ChatInputContainer';
import ChatInputField from './ChatInputField';
import ChatInputActions from './ChatInputActions';
import ChatInputCharacterCount from './ChatInputCharacterCount';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onFileUpload?: (file: File) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ 
  onSendMessage, 
  onFileUpload,
  disabled = false,
  placeholder = 'Type your message...'
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !disabled) {
        handleSend();
      }
    }
  };

  const isValid = message.trim().length > 0 && !disabled;

  return (
    <ChatInputContainer onSubmit={handleSubmit}>
      <div className="p-4 md:p-6">
        <div className="flex items-end gap-3">
          {/* Input Field */}
          <div className="relative flex-1">
            <ChatInputField
              value={message}
              onChange={setMessage}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
            />
            
            {/* Character Count */}
            <ChatInputCharacterCount count={message.length} />
          </div>
          
          {/* Actions */}
          <ChatInputActions
            isValid={isValid}
            onSend={handleSend}
            onFileUpload={onFileUpload}
            disabled={disabled}
          />
        </div>
      </div>
    </ChatInputContainer>
  );
}
