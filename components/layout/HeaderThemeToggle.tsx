'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { getTheme, getEffectiveTheme, setTheme, Theme } from '@/lib/utils/theme';

/**
 * HeaderThemeToggle Component
 * 
 * Enhanced theme selector with:
 * - Three options: Light, Dark, System
 * - Glassmorphism effect
 * - Smooth icon transitions
 * - Dropdown menu
 */
export default function HeaderThemeToggle() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize theme state
    const theme = getTheme();
    const effective = getEffectiveTheme();
    setCurrentTheme(theme);
    setEffectiveTheme(effective);

    // Listen for theme changes
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setEffectiveTheme(getEffectiveTheme());
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (getTheme() === 'system') {
        setEffectiveTheme(getEffectiveTheme());
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
    } else {
      mediaQuery.addListener(handleSystemChange);
    }

    return () => {
      observer.disconnect();
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemChange);
      } else {
        mediaQuery.removeListener(handleSystemChange);
      }
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleThemeSelect = (theme: Theme) => {
    setTheme(theme);
    setCurrentTheme(theme);
    setEffectiveTheme(getEffectiveTheme());
    setIsOpen(false);
  };

  const getThemeIcon = () => {
    if (currentTheme === 'system') {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    }
    
    return effectiveTheme === 'dark' ? (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ) : (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  };

  const getThemeLabel = () => {
    if (currentTheme === 'system') {
      return `System (${effectiveTheme === 'dark' ? 'Dark' : 'Light'})`;
    }
    return currentTheme === 'dark' ? 'Dark' : 'Light';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl backdrop-blur-md bg-white/60 dark:bg-slate-700/60 border border-white/30 dark:border-slate-600/50 text-gray-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-600/80 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        title={`Theme: ${getThemeLabel()}`}
        aria-label={`Theme: ${getThemeLabel()}`}
        aria-expanded={isOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {getThemeIcon()}
        </motion.div>
        
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-primary/20 blur-md -z-10"
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-48 rounded-xl backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-white/30 dark:border-slate-600/50 shadow-2xl overflow-hidden z-50"
          >
            {/* Glassmorphism background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-white/85 dark:from-slate-800/95 dark:to-slate-800/85" />
            
            <div className="relative z-10">
              {(['light', 'dark', 'system'] as Theme[]).map((theme) => {
                const isSelected = currentTheme === theme;
                const themeLabel = theme === 'system' 
                  ? `System (${effectiveTheme === 'dark' ? 'Dark' : 'Light'})`
                  : theme === 'dark' 
                  ? 'Dark'
                  : 'Light';

                return (
                  <motion.button
                    key={theme}
                    onClick={() => handleThemeSelect(theme)}
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                      isSelected
                        ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light'
                        : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100/50 dark:hover:bg-slate-700/50'
                    }`}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      {theme === 'system' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      ) : theme === 'dark' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Label */}
                    <span className="flex-1 text-sm font-medium">{themeLabel}</span>
                    
                    {/* Checkmark */}
                    {isSelected && (
                      <motion.svg
                        className="w-5 h-5 text-primary dark:text-primary-light"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
