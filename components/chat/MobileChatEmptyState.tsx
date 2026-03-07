'use client';

/**
 * MobileChatEmptyState
 *
 * Shown when there are no messages. No Framer Motion—plain layout for mobile.
 */
export default function MobileChatEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 min-h-[200px] px-6 text-center">
      <p className="text-gray-500 dark:text-slate-400 text-sm">
        No messages yet. Use the input below to start the conversation.
      </p>
    </div>
  );
}
