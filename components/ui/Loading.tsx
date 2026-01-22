'use client';

import { motion } from 'framer-motion';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

const Skeleton = ({
  width = '100%',
  height = '1rem',
  rounded = 'md',
  className = '',
}: SkeletonProps) => {
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <motion.div
      className={`bg-gray-200 ${roundedStyles[rounded]} ${className}`}
      style={{ width, height }}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

// Pre-built skeleton components
export const SkeletonText = ({ lines = 3, className = '' }: { lines?: number; className?: string }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        width={i === lines - 1 ? '75%' : '100%'}
        height="0.875rem"
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className = '' }: { className?: string }) => (
  <div className={`p-6 space-y-4 ${className}`}>
    <Skeleton width="60%" height="1.5rem" />
    <SkeletonText lines={3} />
    <div className="flex gap-2">
      <Skeleton width="80px" height="2rem" rounded="lg" />
      <Skeleton width="80px" height="2rem" rounded="lg" />
    </div>
  </div>
);

export const SkeletonAvatar = ({ size = 40, className = '' }: { size?: number; className?: string }) => (
  <Skeleton width={size} height={size} rounded="full" className={className} />
);

export const SkeletonButton = ({ className = '' }: { className?: string }) => (
  <Skeleton width="120px" height="2.5rem" rounded="lg" className={className} />
);

export const SkeletonTable = ({ rows = 5, cols = 4, className = '' }: { rows?: number; cols?: number; className?: string }) => (
  <div className={`space-y-2 ${className}`}>
    {/* Header */}
    <div className="flex gap-4">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} width="100%" height="1rem" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <Skeleton key={colIndex} width="100%" height="1rem" />
        ))}
      </div>
    ))}
  </div>
);

export default Skeleton;
