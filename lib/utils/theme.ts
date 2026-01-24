/**
 * Theme Utilities
 * 
 * Utilities for managing light/dark mode theme switching
 */

export type Theme = 'light' | 'dark' | 'system';

/**
 * Get current theme from localStorage or system preference
 */
export const getTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  
  const stored = localStorage.getItem('theme') as Theme | null;
  if (stored && (stored === 'light' || stored === 'dark' || stored === 'system')) {
    return stored;
  }
  
  // Default to light mode
  return 'light';
};

/**
 * Get effective theme (resolves 'system' to actual light/dark)
 */
export const getEffectiveTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  
  const theme = getTheme();
  
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  return theme;
};

/**
 * Apply theme to document
 */
export const applyTheme = (theme: Theme): void => {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  const effectiveTheme = theme === 'system' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;
  
  if (effectiveTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  localStorage.setItem('theme', theme);
};

/**
 * Initialize theme on page load
 */
export const initTheme = (): void => {
  if (typeof window === 'undefined') return;
  
  const theme = getTheme();
  applyTheme(theme);
  
  // Listen for system theme changes (always set up listener for system option)
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = (_e: MediaQueryListEvent | MediaQueryList) => {
    const currentTheme = getTheme();
    if (currentTheme === 'system') {
      applyTheme('system');
    }
  };
  
  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange);
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(handleChange);
  }
};

/**
 * Toggle between light and dark mode
 */
export const toggleTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  
  const current = getEffectiveTheme();
  const newTheme = current === 'light' ? 'dark' : 'light';
  
  applyTheme(newTheme);
  return newTheme;
};

/**
 * Set specific theme
 */
export const setTheme = (theme: Theme): void => {
  applyTheme(theme);
};
