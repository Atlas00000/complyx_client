'use client';

import { HTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'accent';
  size?: 'small' | 'medium' | 'large';
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

const Badge = ({
  children,
  variant = 'default',
  size = 'medium',
  dot = false,
  removable = false,
  onRemove,
  className = '',
  ...props
}: BadgeProps) => {
  // Variant styles
  const variantStyles = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-secondary text-white',
    warning: 'bg-warning text-white',
    error: 'bg-error text-white',
    accent: 'bg-accent text-white',
  };
  
  // Size styles
  const sizeStyles = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-1 text-sm',
    large: 'px-3 py-1.5 text-body',
  };
  
  // Base styles
  const baseStyles = 'inline-flex items-center gap-1.5 font-medium rounded-full transition-all duration-200';
  
  const badgeClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  
  return (
    <motion.span
      className={badgeClasses}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {/* Dot indicator */}
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      )}
      
      {/* Badge content */}
      <span>{children}</span>
      
      {/* Remove button */}
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors duration-200"
          aria-label="Remove badge"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </motion.span>
  );
};

export default Badge;
