'use client';

interface MobileMoreMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onClearChat?: () => void;
  showClearChat?: boolean;
  dashboardHref?: string;
}

/**
 * MobileMoreMenu
 *
 * Overlay menu from header "More": Clear chat, Dashboard. No Framer Motion.
 */
export default function MobileMoreMenu({
  isOpen,
  onClose,
  onClearChat,
  showClearChat = false,
  dashboardHref = '/dashboard',
}: MobileMoreMenuProps) {
  if (!isOpen) return null;

  const handleClearChat = () => {
    onClearChat?.();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[95] flex items-end justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-label="More options"
    >
      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close menu"
      />
      <div
        className="relative w-full max-w-sm rounded-t-2xl bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 shadow-xl p-4 pb-[env(safe-area-inset-bottom)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          {showClearChat && onClearChat && (
            <button
              type="button"
              onClick={handleClearChat}
              className="min-h-[48px] w-full flex items-center justify-center rounded-xl text-red-600 dark:text-red-400 font-medium hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Clear chat
            </button>
          )}
          <a
            href={dashboardHref}
            onClick={onClose}
            className="min-h-[48px] w-full flex items-center justify-center rounded-xl text-gray-800 dark:text-slate-200 font-medium hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
