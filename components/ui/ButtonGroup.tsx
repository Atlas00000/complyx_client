'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface ButtonGroupProps {
  children: ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'small' | 'medium' | 'large';
  className?: string;
}

const ButtonGroup = ({
  children,
  orientation = 'horizontal',
  spacing = 'small',
  className = '',
}: ButtonGroupProps) => {
  // Orientation styles
  const orientationStyles = {
    horizontal: 'flex-row',
    vertical: 'flex-col',
  };
  
  // Spacing styles
  const spacingStyles = {
    none: 'gap-0',
    small: 'gap-1',
    medium: 'gap-2',
    large: 'gap-3',
  };
  
  // Base styles
  const baseStyles = 'inline-flex';
  
  const groupClasses = `${baseStyles} ${orientationStyles[orientation]} ${spacingStyles[spacing]} ${className}`;
  
  return (
    <motion.div
      className={groupClasses}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export default ButtonGroup;
