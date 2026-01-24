'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragEnd' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragStart' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
    
    // Variant styles
    const variantStyles = {
      primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary active:scale-[0.98] shadow-primary hover:shadow-primary-lg',
      secondary: 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 hover:border-gray-300 dark:hover:border-slate-500 focus:ring-gray-500 active:scale-[0.98]',
      ghost: 'bg-transparent text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 focus:ring-gray-400 active:scale-[0.98]',
    };
    
    // Size styles
    const sizeStyles = {
      small: 'h-8 px-3 text-sm gap-1.5',
      medium: 'h-10 px-4 text-body gap-2',
      large: 'h-12 px-5 text-body-lg gap-2.5',
    };
    
    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';
    
    // Combine all styles
    const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`;
    
    return (
      <motion.button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
        whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        {...props}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <motion.svg
            className="absolute w-4 h-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </motion.svg>
        )}
        
        {/* Content */}
        <span className={`flex items-center ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children && <span>{children}</span>}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
