'use client';

import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeaderLogo from './HeaderLogo';
import HeaderThemeToggle from './HeaderThemeToggle';

export interface MobileHeaderProps {
  logo?: ReactNode;
  title?: string;
  leftActions?: ReactNode;
  rightActions?: ReactNode;
  onMenuClick?: () => void;
  className?: string;
}

/**
 * MobileHeader Component
 * 
 * Optimized header for mobile devices with:
 * - Compact design
 * - Touch-friendly buttons
 * - Simplified layout
 * - Swipe gestures support
 */
const MobileHeader = ({
  logo,
  title = 'Complyx',
  leftActions,
  rightActions,
  onMenuClick,
  className = '',
}: MobileHeaderProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`relative sticky top-0 z-sticky ${className}`}
      style={{
        backdropFilter: `blur(${scrolled ? 10 : 8}px)`,
        WebkitBackdropFilter: `blur(${scrolled ? 10 : 8}px)`,
      }}
    >
      {/* Mobile-optimized background with reduced effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent dark:from-primary/10" />
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 dark:bg-primary/20 rounded-full blur-2xl" />
        <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 dark:bg-accent/20 rounded-full blur-2xl" />
      </div>

      {/* Mobile header content */}
      <div
        className="relative border-b border-white/20 dark:border-slate-700/30"
        style={{
          background: scrolled
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.85) 100%)',
        }}
      >
        <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-slate-800/95 via-slate-800/90 to-slate-800/95" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent dark:from-primary/10 pointer-events-none" />

        <div className="container-wide relative z-10">
          <div className="flex items-center justify-between h-14 px-3 w-full">
            {/* Left side - Logo and menu button */}
            <div className="flex items-center flex-shrink-0 gap-2">
              {onMenuClick && (
                <button
                  onClick={onMenuClick}
                  className="p-2 rounded-lg backdrop-blur-md bg-white/60 dark:bg-slate-700/60 border border-white/30 dark:border-slate-600/50 text-gray-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-600/80 transition-all duration-200 active:scale-95 touch-manipulation"
                  aria-label="Open menu"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              )}
              
              {logo || <HeaderLogo title={title} compact />}
            </div>

            {/* Right side - Actions and theme toggle */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {leftActions && (
                <div className="flex items-center gap-1">
                  {leftActions}
                </div>
              )}

              {rightActions && (
                <div className="flex items-center gap-1">
                  {rightActions}
                </div>
              )}

              <HeaderThemeToggle />
            </div>
          </div>
        </div>

        {/* Bottom border with gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent dark:via-primary/30" />
      </div>

      {/* Scroll indicator */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary"
            style={{ transformOrigin: 'left' }}
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default MobileHeader;
