'use client';

interface TypingIndicatorProps {
  isTyping?: boolean;
}

export default function TypingIndicator({ isTyping = true }: TypingIndicatorProps) {
  if (!isTyping) return null;

  return (
    <div className="flex justify-start w-full">
      <div className="bg-gray-200 text-gray-900 max-w-[80%] px-4 py-3 rounded-2xl">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600 mr-2">Complyx is typing</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
