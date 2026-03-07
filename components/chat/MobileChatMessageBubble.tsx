'use client';

interface MobileChatMessageBubbleProps {
  message: string;
  isUser: boolean;
}

/**
 * MobileChatMessageBubble
 *
 * Single message bubble for mobile chat. No Framer Motion—plain div + Tailwind.
 * User messages on the right, assistant on the left.
 */
export default function MobileChatMessageBubble({ message, isUser }: MobileChatMessageBubbleProps) {
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
          isUser
            ? 'bg-primary text-white rounded-br-md'
            : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-600 rounded-bl-md'
        }`}
      >
        <p className="whitespace-pre-wrap break-words leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
