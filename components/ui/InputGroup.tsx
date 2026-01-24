'use client';

import { HTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface InputGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragEnd' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragStart' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  children: ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'small' | 'medium' | 'large';
}

const InputGroup = ({
  children,
  orientation = 'vertical',
  spacing = 'medium',
  className = '',
  ...props
}: InputGroupProps) => {
  // Orientation styles
  const orientationStyles = {
    horizontal: 'flex-row items-end',
    vertical: 'flex-col',
  };
  
  // Spacing styles
  const spacingStyles = {
    none: 'gap-0',
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6',
  };
  
  // Base styles
  const baseStyles = 'flex';
  
  const groupClasses = `${baseStyles} ${orientationStyles[orientation]} ${spacingStyles[spacing]} ${className}`;
  
  return (
    <motion.div
      className={groupClasses}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default InputGroup;
