'use client';

export interface MobileAssessmentTypeSwitchConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAndSwitch: () => void;
  onRestart: () => void;
  progress?: number;
}

/**
 * Mobile assessment type switch confirm overlay. No Modal/motion.
 */
export default function MobileAssessmentTypeSwitchConfirm({
  isOpen,
  onClose,
  onSaveAndSwitch,
  onRestart,
  progress,
}: MobileAssessmentTypeSwitchConfirmProps) {
  if (!isOpen) return null;

  const handleSave = () => {
    onSaveAndSwitch();
    onClose();
  };

  const handleRestart = () => {
    onRestart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4 bg-black/50">
      <div
        className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl p-4"
        role="dialog"
        aria-labelledby="mobile-type-switch-title"
        aria-modal="true"
      >
        <h2 id="mobile-type-switch-title" className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
          Change assessment type?
        </h2>
        <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
          You&apos;re in the middle of an assessment
          {typeof progress === 'number' && <span> ({progress}% complete)</span>}.
          What would you like to do?
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-primary text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Save progress & choose different type
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Cancel (continue current)
          </button>
          <button
            type="button"
            onClick={handleRestart}
            className="w-full py-3 rounded-xl text-amber-600 dark:text-amber-400 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Restart (abandon and start new)
          </button>
        </div>
      </div>
    </div>
  );
}
