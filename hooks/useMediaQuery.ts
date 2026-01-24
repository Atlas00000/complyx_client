/**
 * useMediaQuery Hook
 * 
 * Custom hook for responsive breakpoint detection
 * Provides reactive media query matching for mobile/tablet/desktop views
 */

import { useState, useEffect } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface BreakpointConfig {
  mobile: number;   // max-width for mobile
  tablet: number;  // max-width for tablet
  desktop: number; // min-width for desktop
}

const defaultBreakpoints: BreakpointConfig = {
  mobile: 640,   // sm breakpoint
  tablet: 1024,  // lg breakpoint
  desktop: 1024, // lg breakpoint and above
};

/**
 * Hook to detect current breakpoint
 */
export function useBreakpoint(config: BreakpointConfig = defaultBreakpoints): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < config.mobile) {
        setBreakpoint('mobile');
      } else if (width < config.tablet) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    // Initial check
    updateBreakpoint();

    // Listen for resize events with debounce
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateBreakpoint, 150);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [config]);

  return breakpoint;
}

/**
 * Hook to check if current viewport matches a media query
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Initial check
    setMatches(mediaQuery.matches);

    // Create event listener
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } 
    // Fallback for older browsers
    else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
}

/**
 * Hook to check if device is mobile
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 640px)');
}

/**
 * Hook to check if device is tablet
 */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
}

/**
 * Hook to check if device is desktop
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1025px)');
}

/**
 * Hook to check if device has touch capability
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore
      navigator.msMaxTouchPoints > 0
    );
  }, []);

  return isTouch;
}

/**
 * Hook to get viewport dimensions
 */
export function useViewport(): { width: number; height: number } {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Initial check
    updateViewport();

    // Listen for resize events with debounce
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateViewport, 150);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', updateViewport);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', updateViewport);
      clearTimeout(timeoutId);
    };
  }, []);

  return viewport;
}
