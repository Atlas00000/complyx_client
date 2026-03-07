'use client';

interface MobileDashboardMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

/**
 * MobileDashboardMenu
 *
 * Bottom sheet menu for mobile dashboard: Chat, Dashboard, Logout.
 * No Framer Motion. 48px min tap targets.
 */
export default function MobileDashboardMenu({
  isOpen,
  onClose,
  onLogout,
}: MobileDashboardMenuProps) {
  if (!isOpen) return null;

  const handleLogout = () => {
    onLogout?.();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[95] flex items-end justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-label="Dashboard menu"
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
          <a
            href="/"
            onClick={onClose}
            className="min-h-[48px] w-full flex items-center justify-center rounded-xl text-gray-800 dark:text-slate-200 font-medium hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Chat
          </a>
          <a
            href="/dashboard"
            onClick={onClose}
            className="min-h-[48px] w-full flex items-center justify-center rounded-xl text-gray-600 dark:text-slate-400 font-medium hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Dashboard
          </a>
          {onLogout && (
            <button
              type="button"
              onClick={handleLogout}
              className="min-h-[48px] w-full flex items-center justify-center rounded-xl text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-950/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              Log out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
