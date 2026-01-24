'use client';

import { useEffect } from 'react';
import { initTheme, getEffectiveTheme, getTheme } from '@/lib/utils/theme';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize theme immediately (defaults to light if not set)
    initTheme();
    
    // Ensure theme is applied on mount
    const theme = getTheme();
    const effectiveTheme = getEffectiveTheme();
    const root = document.documentElement;
    
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Set up system theme listener if theme is 'system'
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemChange = () => {
        const effective = getEffectiveTheme();
        if (effective === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };
      
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleSystemChange);
      } else {
        mediaQuery.addListener(handleSystemChange);
      }
      
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleSystemChange);
        } else {
          mediaQuery.removeListener(handleSystemChange);
        }
      };
    }
    
    return undefined;
  }, []);

  return <>{children}</>;
}
