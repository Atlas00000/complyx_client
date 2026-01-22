'use client';

import { ReactNode } from 'react';
import Modal from './Modal';
import Button from './Button';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'warning';
  isLoading?: boolean;
}

const Dialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isLoading = false,
}: DialogProps) => {
  // Variant styles for confirm button
  const confirmVariant = variant === 'danger' ? 'primary' : variant === 'warning' ? 'primary' : 'primary';
  
  const handleConfirm = () => {
    onConfirm();
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="small"
      closeOnBackdropClick={!isLoading}
      closeOnEscape={!isLoading}
    >
      <div className="space-y-4">
        {/* Title */}
        <h3 className="text-h5 text-gray-900 font-semibold">{title}</h3>
        
        {/* Message */}
        <div className="text-body text-gray-600">
          {message}
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            variant="ghost"
            size="medium"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            size="medium"
            onClick={handleConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Dialog;
