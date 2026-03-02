'use client';

import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export interface AssessmentTypeSwitchConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAndSwitch: () => void;
  onRestart: () => void;
  progress?: number; // e.g. 43 for "43% complete"
}

/**
 * Dialog when user wants to change assessment type mid-assessment.
 * Options: save progress and go to type selection, cancel (stay), or restart (abandon and start new).
 */
export default function AssessmentTypeSwitchConfirm({
  isOpen,
  onClose,
  onSaveAndSwitch,
  onRestart,
  progress,
}: AssessmentTypeSwitchConfirmProps) {
  const handleSaveAndSwitch = () => {
    onSaveAndSwitch();
    onClose();
  };

  const handleRestart = () => {
    onRestart();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Change assessment type?"
      size="small"
      closeOnBackdropClick={true}
      showCloseButton={true}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-slate-400">
          You're in the middle of an assessment
          {typeof progress === 'number' && (
            <span> ({progress}% complete)</span>
          )}
          . What would you like to do?
        </p>
        <div className="flex flex-col gap-2">
          <Button
            variant="primary"
            size="medium"
            fullWidth
            onClick={handleSaveAndSwitch}
          >
            Save progress & choose different type
          </Button>
          <Button
            variant="secondary"
            size="medium"
            fullWidth
            onClick={onClose}
          >
            Cancel (continue current assessment)
          </Button>
          <Button
            variant="ghost"
            size="medium"
            fullWidth
            onClick={handleRestart}
            className="text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
          >
            Restart (abandon and start new)
          </Button>
        </div>
      </div>
    </Modal>
  );
}
