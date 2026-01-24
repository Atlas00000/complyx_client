'use client';

import { motion } from 'framer-motion';
import EmptyStateContainer from './EmptyStateContainer';
import EmptyStateHeader from './EmptyStateHeader';
import EmptyStateVisual from './EmptyStateVisual';
import EmptyStateDescription from './EmptyStateDescription';
import EmptyStateAction from './EmptyStateAction';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState = ({
  title,
  description,
  icon,
  action,
  className = '',
}: EmptyStateProps) => {
  return (
    <EmptyStateContainer className={className}>
      <div className="flex flex-col items-center justify-center text-center">
        {/* Visual Element */}
        {icon ? (
          <motion.div
            className="mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {icon}
          </motion.div>
        ) : (
          <EmptyStateVisual />
        )}

        {/* Header */}
        <EmptyStateHeader title={title} />

        {/* Description */}
        {description && (
          <EmptyStateDescription description={description} />
        )}

        {/* Action Button */}
        {action && (
          <EmptyStateAction label={action.label} onClick={action.onClick} />
        )}
      </div>
    </EmptyStateContainer>
  );
};

export default EmptyState;
