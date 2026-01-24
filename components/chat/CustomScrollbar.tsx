'use client';

import { ReactNode, useEffect, useRef } from 'react';

interface CustomScrollbarProps {
  children: ReactNode;
  className?: string;
}

/**
 * CustomScrollbar Component
 * 
 * Wraps content with a custom-styled scrollbar
 * that matches the Forest Green & Slate theme.
 * Adds smooth animations and modern styling.
 */
export default function CustomScrollbar({
  children,
  className = '',
}: CustomScrollbarProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add custom scrollbar class
    container.classList.add('custom-scrollbar');
  }, []);

  return (
    <div
      ref={containerRef}
      className={`
        h-full
        overflow-y-auto
        overflow-x-hidden
        custom-scrollbar
        ${className}
      `}
      style={{
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {children}
    </div>
  );
}
