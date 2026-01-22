'use client';

import { HTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'none' | 'small' | 'medium' | 'large';
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 6 | 12;
    xl?: 1 | 2 | 3 | 4 | 6 | 12;
  };
  className?: string;
}

const Grid = ({
  children,
  cols = 3,
  gap = 'medium',
  responsive,
  className = '',
  ...props
}: GridProps) => {
  // Gap styles
  const gapStyles = {
    none: 'gap-0',
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6',
  };
  
  // Column styles
  const getColClass = (cols: number) => {
    const colMap: Record<number, string> = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      6: 'grid-cols-6',
      12: 'grid-cols-12',
    };
    return colMap[cols] || 'grid-cols-3';
  };
  
  // Build responsive classes
  const responsiveClasses = responsive
    ? Object.entries(responsive)
        .map(([breakpoint, cols]) => {
          const breakpointMap: Record<string, string> = {
            sm: 'sm:',
            md: 'md:',
            lg: 'lg:',
            xl: 'xl:',
          };
          return `${breakpointMap[breakpoint]}${getColClass(cols)}`;
        })
        .join(' ')
    : '';
  
  const gridClasses = `grid ${getColClass(cols)} ${responsiveClasses} ${gapStyles[gap]} ${className}`;
  
  return (
    <motion.div
      className={gridClasses}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Grid;
