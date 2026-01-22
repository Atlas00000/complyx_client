'use client';

import { LabelHTMLAttributes, ReactNode } from 'react';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  required?: boolean;
  error?: boolean;
}

const Label = ({
  children,
  required = false,
  error = false,
  className = '',
  ...props
}: LabelProps) => {
  // Base styles
  const baseStyles = 'block text-sm font-medium mb-2';
  
  // Color styles
  const colorStyles = error ? 'text-error' : 'text-gray-700';
  
  const labelClasses = `${baseStyles} ${colorStyles} ${className}`;
  
  return (
    <label className={labelClasses} {...props}>
      {children}
      {required && <span className="text-error ml-1">*</span>}
    </label>
  );
};

export default Label;
