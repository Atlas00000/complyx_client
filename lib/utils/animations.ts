/**
 * Animation Utilities
 * 
 * Utilities for creating consistent, smooth animations
 * across the application.
 */

/**
 * Animation presets for common use cases
 */
export const animationPresets = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  fadeOut: {
    initial: { opacity: 1 },
    animate: { opacity: 0 },
    transition: { duration: 0.2, ease: 'easeIn' },
  },
  
  // Slide animations
  slideInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  slideInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  
  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  scaleOut: {
    initial: { opacity: 1, scale: 1 },
    animate: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2, ease: 'easeIn' },
  },
  scaleInCenter: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  
  // Modal animations
  modalBackdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
  modalContent: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  
  // Card animations
  cardHover: {
    whileHover: { y: -4, scale: 1.02 },
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  cardPress: {
    whileTap: { scale: 0.98 },
    transition: { duration: 0.1 },
  },
  
  // Button animations
  buttonHover: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  
  // Stagger animations (for lists)
  staggerContainer: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { staggerChildren: 0.1 },
  },
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  
  // Loading animations
  pulse: {
    animate: {
      opacity: [1, 0.5, 1],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  spin: {
    animate: {
      rotate: 360,
    },
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

/**
 * Get animation duration in milliseconds
 */
export const getAnimationDuration = (
  duration: 'micro' | 'standard' | 'moderate' | 'extended' = 'standard'
): number => {
  const durationMap = {
    micro: 100,
    standard: 200,
    moderate: 300,
    extended: 400,
  };

  return durationMap[duration];
};

/**
 * Get easing function
 */
export const getEasing = (
  type: 'ease-out' | 'ease-in' | 'ease-in-out' | 'spring' = 'ease-out'
): string => {
  const easingMap = {
    'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
    'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
    'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  };

  return easingMap[type];
};

/**
 * Create custom animation configuration
 */
export const createAnimation = (
  type: 'fade' | 'slide' | 'scale' | 'rotate',
  direction?: 'up' | 'down' | 'left' | 'right',
  duration: 'micro' | 'standard' | 'moderate' | 'extended' = 'standard',
  easing: 'ease-out' | 'ease-in' | 'ease-in-out' | 'spring' = 'ease-out'
) => {
  const durationMs = getAnimationDuration(duration);
  const easingFn = getEasing(easing);

  const baseConfig = {
    transition: {
      duration: durationMs / 1000,
      ease: easingFn,
    },
  };

  switch (type) {
    case 'fade':
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        ...baseConfig,
      };
    
    case 'slide':
      const slideDirection = direction || 'up';
      const axis = slideDirection === 'up' || slideDirection === 'down' ? 'y' : 'x';
      const value = slideDirection === 'up' || slideDirection === 'left' ? 20 : -20;
      
      return {
        initial: { opacity: 0, [axis]: value },
        animate: { opacity: 1, [axis]: 0 },
        ...baseConfig,
      };
    
    case 'scale':
      return {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        ...baseConfig,
      };
    
    case 'rotate':
      return {
        initial: { opacity: 0, rotate: -10 },
        animate: { opacity: 1, rotate: 0 },
        ...baseConfig,
      };
    
    default:
      return baseConfig;
  }
};

/**
 * Generate stagger delay for list items
 */
export const getStaggerDelay = (index: number, baseDelay: number = 0.1): number => {
  return index * baseDelay;
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation config respecting reduced motion preference
 */
export const getRespectfulAnimation = <T extends Record<string, any>>(
  animation: T,
  fallback?: T
): T => {
  if (prefersReducedMotion() && fallback) {
    return {
      ...fallback,
      transition: { duration: 0.01 },
    };
  }
  return animation;
};
