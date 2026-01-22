'use client';

import { TextareaHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  helperText?: string;
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      error,
      label,
      helperText,
      fullWidth = false,
      resize = 'vertical',
      className = '',
      disabled,
      rows = 4,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = 'w-full px-4 py-3 bg-white border rounded-lg text-body text-gray-900 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed';
    
    // Error styles
    const errorStyles = error ? 'border-error focus:ring-error focus:border-error' : 'border-gray-200';
    
    // Resize styles
    const resizeStyles = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };
    
    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';
    
    // Combine all styles
    const textareaClasses = `${baseStyles} ${errorStyles} ${resizeStyles[resize]} ${widthStyles} ${className}`;
    
    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        
        {/* Textarea */}
        <motion.textarea
          ref={ref}
          className={textareaClasses}
          disabled={disabled}
          rows={rows}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          {...props}
        />
        
        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-error flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </motion.p>
        )}
        
        {/* Helper Text */}
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
