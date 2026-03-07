'use client';

interface MobileConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'primary' | 'danger';
}

/**
 * MobileConfirmDialog
 *
 * Reusable confirm overlay for mobile. No Framer Motion.
 */
export default function MobileConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  variant = 'primary',
}: MobileConfirmDialogProps) {
  if (!isOpen) return null;

  const confirmClass =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 text-white'
      : 'bg-primary text-white hover:bg-primary-dark';

  return (
    <div
      className="fixed inset-0 z-[105] flex items-end sm:items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-confirm-title"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl p-4">
        <h2
          id="mobile-confirm-title"
          className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2"
        >
          {title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">{message}</p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onConfirm}
            className={`w-full py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[44px] ${confirmClass} focus:ring-primary`}
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-3 rounded-xl font-medium bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
