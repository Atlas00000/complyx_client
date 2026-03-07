'use client';

interface MobileErrorBannerProps {
  message: string;
  onDismiss: () => void;
  visible?: boolean;
}

/**
 * MobileErrorBanner
 *
 * Dismissible banner for send/request errors on mobile. No Framer Motion.
 */
export default function MobileErrorBanner({
  message,
  onDismiss,
  visible = true,
}: MobileErrorBannerProps) {
  if (!visible || !message) return null;

  return (
    <div
      className="flex-shrink-0 flex items-center justify-between gap-3 px-4 py-3 bg-red-50 dark:bg-red-950/30 border-b border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-200"
      role="alert"
    >
      <p className="text-sm flex-1 min-w-0">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        aria-label="Dismiss"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
