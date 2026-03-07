'use client';

interface MobileChatTypingIndicatorProps {
  isTyping: boolean;
}

/**
 * MobileChatTypingIndicator
 *
 * Typing indicator for mobile. No Framer Motion—CSS-only bounce on dots.
 */
export default function MobileChatTypingIndicator({ isTyping }: MobileChatTypingIndicatorProps) {
  if (!isTyping) return null;

  return (
    <div className="flex justify-start w-full">
      <div className="max-w-[80%] px-4 py-3 bg-white dark:bg-slate-800 rounded-2xl rounded-bl-md border border-gray-200 dark:border-slate-600 shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 bg-gray-400 dark:bg-slate-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
          <span className="ml-2 text-xs text-gray-500 dark:text-slate-400">Complyx is typing...</span>
        </div>
      </div>
    </div>
  );
}
