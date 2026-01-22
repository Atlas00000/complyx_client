/**
 * Design System Utilities
 * 
 * Centralized utilities for consistent design system usage
 * across the application.
 */

/**
 * Get color variant based on theme
 */
export const getColorVariant = (
  color: 'primary' | 'secondary' | 'accent' | 'warning' | 'error',
  variant: 'default' | 'light' | 'dark' | 'muted' = 'default'
): string => {
  const colorMap = {
    primary: {
      default: '#2563EB',
      light: '#3B82F6',
      dark: '#1E40AF',
      muted: '#60A5FA',
    },
    secondary: {
      default: '#10B981',
      light: '#34D399',
      dark: '#059669',
      muted: '#6EE7B7',
    },
    accent: {
      default: '#8B5CF6',
      light: '#A78BFA',
      dark: '#7C3AED',
      muted: '#C4B5FD',
    },
    warning: {
      default: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
      muted: '#FCD34D',
    },
    error: {
      default: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
      muted: '#FCA5A5',
    },
  };

  return colorMap[color][variant];
};

/**
 * Get shadow class based on elevation level
 */
export const getShadowClass = (level: 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'md'): string => {
  const shadowMap = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  };

  return shadowMap[level];
};

/**
 * Get colored shadow class
 */
export const getColoredShadowClass = (
  color: 'primary' | 'secondary' | 'accent',
  size: 'default' | 'lg' = 'default'
): string => {
  const shadowMap = {
    primary: {
      default: 'shadow-primary',
      lg: 'shadow-primary-lg',
    },
    secondary: {
      default: 'shadow-secondary',
      lg: 'shadow-secondary-lg',
    },
    accent: {
      default: 'shadow-accent',
      lg: 'shadow-accent-lg',
    },
  };

  return shadowMap[color][size];
};

/**
 * Get border radius class
 */
export const getRadiusClass = (
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' = 'md'
): string => {
  const radiusMap = {
    xs: 'rounded-xs',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
  };

  return radiusMap[size];
};

/**
 * Get spacing class
 */
export const getSpacingClass = (
  size: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24
): string => {
  return `p-${size}`;
};

/**
 * Get transition class
 */
export const getTransitionClass = (
  duration: 'micro' | 'standard' | 'moderate' | 'extended' = 'standard',
  property: 'all' | 'colors' | 'transform' | 'opacity' = 'all'
): string => {
  const durationMap = {
    micro: 'transition-micro',
    standard: 'transition-standard',
    moderate: 'transition-moderate',
    extended: 'transition-extended',
  };

  return `${durationMap[duration]} transition-${property}`;
};

/**
 * Get animation class
 */
export const getAnimationClass = (
  type: 'fade-in' | 'fade-out' | 'slide-in-up' | 'slide-in-down' | 'scale-in' | 'scale-out'
): string => {
  const animationMap = {
    'fade-in': 'animate-fade-in',
    'fade-out': 'animate-fade-out',
    'slide-in-up': 'animate-slide-in-up',
    'slide-in-down': 'animate-slide-in-down',
    'scale-in': 'animate-scale-in',
    'scale-out': 'animate-scale-out',
  };

  return animationMap[type];
};

/**
 * Get container class based on width
 */
export const getContainerClass = (
  width: 'narrow' | 'standard' | 'wide' | 'full' = 'standard'
): string => {
  const containerMap = {
    narrow: 'container-narrow',
    standard: 'container-standard',
    wide: 'container-wide',
    full: 'w-full',
  };

  return containerMap[width];
};

/**
 * Get section padding class
 */
export const getSectionClass = (size: 'sm' | 'default' | 'lg' = 'default'): string => {
  const sectionMap = {
    sm: 'section-sm',
    default: 'section',
    lg: 'section-lg',
  };

  return sectionMap[size];
};

/**
 * Generate hover effect classes
 */
export const getHoverEffectClass = (
  effect: 'lift' | 'scale' | 'glow' | 'color' = 'lift'
): string => {
  const effectMap = {
    lift: 'hover:-translate-y-1 hover:shadow-lg transition-all transition-standard',
    scale: 'hover:scale-105 transition-transform transition-standard',
    glow: 'hover:shadow-primary-lg transition-shadow transition-standard',
    color: 'hover:bg-primary hover:text-white transition-colors transition-standard',
  };

  return effectMap[effect];
};

/**
 * Generate focus ring class
 */
export const getFocusRingClass = (
  color: 'primary' | 'secondary' | 'accent' | 'gray' = 'primary'
): string => {
  const ringMap = {
    primary: 'focus:ring-primary',
    secondary: 'focus:ring-secondary',
    accent: 'focus:ring-accent',
    gray: 'focus:ring-gray-400',
  };

  return `focus:outline-none focus:ring-2 focus:ring-offset-2 ${ringMap[color]}`;
};

/**
 * Generate text size class
 */
export const getTextSizeClass = (
  size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
): string => {
  return `text-${size}`;
};

/**
 * Generate font weight class
 */
export const getFontWeightClass = (
  weight: 'normal' | 'medium' | 'semibold' | 'bold' = 'normal'
): string => {
  const weightMap = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  return weightMap[weight];
};

/**
 * Combine multiple classes (utility for conditional classes)
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
