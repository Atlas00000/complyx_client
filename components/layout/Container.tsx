'use client';

import { HTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: 'narrow' | 'standard' | 'wide' | 'full';
  className?: string;
}

const Container = ({
  children,
  size = 'standard',
  className = '',
  ...props
}: ContainerProps) => {
  // Size styles
  const sizeStyles = {
    narrow: 'max-w-2xl',
    standard: 'max-w-4xl',
    wide: 'max-w-7xl',
    full: 'max-w-full',
  };
  
  const containerClasses = `mx-auto px-4 lg:px-6 ${sizeStyles[size]} ${className}`;
  
  return (
    <motion.div
      className={containerClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Container;
