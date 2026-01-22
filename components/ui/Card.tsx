'use client';

import { HTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'standard' | 'elevated' | 'interactive';
  children: ReactNode;
  hover?: boolean;
  onClick?: () => void;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const Card = ({
  variant = 'standard',
  children,
  hover = false,
  onClick,
  className = '',
  ...props
}: CardProps) => {
  // Base styles
  const baseStyles = 'bg-white rounded-xl transition-all duration-200 ease-out';
  
  // Variant styles
  const variantStyles = {
    standard: 'shadow-md',
    elevated: 'shadow-lg',
    interactive: 'shadow-md cursor-pointer',
  };
  
  // Hover styles
  const hoverStyles = hover || onClick ? 'hover:shadow-lg hover:-translate-y-1' : '';
  
  // Clickable styles
  const clickableStyles = onClick ? 'active:scale-[0.98]' : '';
  
  const cardClasses = `${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${clickableStyles} ${className}`;
  
  const cardContent = (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
  
  if (onClick) {
    return (
      <motion.div
        onClick={onClick}
        whileHover={hover ? { y: -4, scale: 1.02 } : {}}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={cardClasses}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cardClasses}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const CardHeader = ({ children, className = '', ...props }: CardHeaderProps) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardBody = ({ children, className = '', ...props }: CardBodyProps) => {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = '', ...props }: CardFooterProps) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Export Card with sub-components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
