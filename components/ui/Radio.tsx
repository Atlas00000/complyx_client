'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      error,
      helperText,
      className = '',
      disabled,
      checked,
      ...props
    },
    ref
  ) => {
    // Base radio styles
    const radioBaseStyles = 'w-5 h-5 rounded-full border-2 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
    
    // Radio state styles
    const radioStyles = checked
      ? 'border-primary'
      : 'border-gray-300 bg-white';
    
    const radioClasses = `${radioBaseStyles} ${radioStyles} ${className}`;
    
    return (
      <div className="flex flex-col">
        <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {/* Radio Input */}
          <div className="relative">
            <input
              ref={ref}
              type="radio"
              className="sr-only"
              disabled={disabled}
              checked={checked}
              {...props}
            />
            <motion.div
              className={radioClasses}
              whileTap={!disabled ? { scale: 0.9 } : {}}
              onClick={() => !disabled && props.onChange?.({ target: { checked: true } } as any)}
            >
              {/* Inner Circle */}
              <AnimatePresence>
                {checked && (
                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-primary rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          
          {/* Label Text */}
          {label && (
            <span className="text-body text-gray-700 select-none">
              {label}
              {props.required && <span className="text-error ml-1">*</span>}
            </span>
          )}
        </label>
        
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

Radio.displayName = 'Radio';

export default Radio;
