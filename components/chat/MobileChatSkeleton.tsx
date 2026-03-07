'use client';

/**
 * MobileChatSkeleton
 *
 * Loading skeleton for mobile chat. Plain divs + Tailwind animate-pulse, no Framer Motion.
 */
export default function MobileChatSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-600 animate-pulse shrink-0" />
        <div className="flex-1 space-y-2 max-w-[80%]">
          <div className="h-3 rounded-lg bg-gray-200 dark:bg-slate-600 animate-pulse w-[60%]" />
          <div className="h-3 rounded-lg bg-gray-200 dark:bg-slate-600 animate-pulse w-[80%]" />
        </div>
      </div>
      <div className="flex justify-end">
        <div className="max-w-[70%] space-y-2">
          <div className="h-3 rounded-lg bg-gray-200 dark:bg-slate-600 animate-pulse w-[70%] ml-auto" />
        </div>
      </div>
      <div className="flex justify-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-600 animate-pulse shrink-0" />
        <div className="flex-1 space-y-2 max-w-[85%]">
          <div className="h-3 rounded-lg bg-gray-200 dark:bg-slate-600 animate-pulse w-[90%]" />
          <div className="h-3 rounded-lg bg-gray-200 dark:bg-slate-600 animate-pulse w-[60%]" />
        </div>
      </div>
    </div>
  );
}
