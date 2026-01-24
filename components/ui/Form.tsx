'use client';

import { FormHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onDrag' | 'onDragEnd' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragStart' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form = ({
  children,
  onSubmit,
  className = '',
  ...props
}: FormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };
  
  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`space-y-6 ${className}`}
      {...props}
    >
      {children}
    </motion.form>
  );
};

export default Form;
