'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface DynamicGradientOverlayProps {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

/**
 * DynamicGradientOverlay Component
 * 
 * Creates a gradient overlay that responds to scroll position,
 * creating a dynamic visual effect that enhances depth.
 */
export default function DynamicGradientOverlay({
  scrollContainerRef,
}: DynamicGradientOverlayProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const progress = scrollTop / (scrollHeight - clientHeight);
      setScrollProgress(Math.min(Math.max(progress, 0), 1));
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [scrollContainerRef]);

  // Calculate gradient positions based on scroll
  const topOpacity = 0.1 - scrollProgress * 0.1;
  const bottomOpacity = 0.05 + scrollProgress * 0.1;

  return (
    <>
      {/* Top gradient fade */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 pointer-events-none z-10"
        style={{
          opacity: topOpacity,
        }}
        animate={{
          opacity: topOpacity,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Bottom gradient fade */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-accent/10 via-accent/5 to-transparent dark:from-accent/20 dark:via-accent/10 pointer-events-none z-10"
        style={{
          opacity: bottomOpacity,
        }}
        animate={{
          opacity: bottomOpacity,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Center accent that moves with scroll */}
      <motion.div
        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent dark:via-primary/40 pointer-events-none z-10"
        style={{
          top: `${20 + scrollProgress * 60}%`,
        }}
        animate={{
          top: `${20 + scrollProgress * 60}%`,
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          top: { duration: 0.3 },
          opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
    </>
  );
}
