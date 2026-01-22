'use client';

import { HTMLAttributes, ReactNode } from 'react';
import Label from './Label';

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: ReactNode;
}

const FormField = ({
  label,
  error,
  helperText,
  required = false,
  children,
  className = '',
  ...props
}: FormFieldProps) => {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {/* Label */}
      {label && (
        <Label required={required} error={!!error}>
          {label}
        </Label>
      )}
      
      {/* Input/Field */}
      <div>
        {children}
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="text-sm text-error flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
      
      {/* Helper Text */}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default FormField;
