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
  variant: 'default' | 'light' | 'dark' | 'muted' = 'default',
  isDark: boolean = false
): string => {
  // Light mode colors (Forest Green & Slate)
  const lightColorMap = {
    primary: {
      default: '#065F46', // Forest Green
      light: '#10B981', // Emerald
      dark: '#047857', // Dark Emerald
      muted: '#6B9B7A', // Sage Green
    },
    secondary: {
      default: '#6B9B7A', // Sage Green
      light: '#6EE7B7', // Light Emerald
      dark: '#047857', // Dark Emerald
      muted: '#A7F3D0', // Light Sage
    },
    accent: {
      default: '#14B8A6', // Teal
      light: '#5EEAD4', // Light Teal
      dark: '#0D9488', // Dark Teal
      muted: '#2DD4BF', // Medium Teal
    },
    warning: {
      default: '#F97316', // Orange
      light: '#FB923C', // Light Orange
      dark: '#EA580C', // Dark Orange
      muted: '#FDBA74', // Muted Orange
    },
    error: {
      default: '#EF4444', // Red
      light: '#F87171', // Light Red
      dark: '#DC2626', // Dark Red
      muted: '#FCA5A5', // Muted Red
    },
  };

  // Dark mode colors (Balanced Dark Slate)
  const darkColorMap = {
    primary: {
      default: '#10B981', // Emerald (brighter for dark)
      light: '#34D399', // Light Emerald
      dark: '#059669', // Dark Emerald
      muted: '#6EE7B7', // Muted Emerald
    },
    secondary: {
      default: '#6EE7B7', // Sage
      light: '#A7F3D0', // Light Sage
      dark: '#34D399', // Dark Sage
      muted: '#D1FAE5', // Muted Sage
    },
    accent: {
      default: '#14B8A6', // Teal
      light: '#5EEAD4', // Light Teal
      dark: '#0D9488', // Dark Teal
      muted: '#2DD4BF', // Medium Teal
    },
    warning: {
      default: '#FB923C', // Orange
      light: '#FCD34D', // Light Orange
      dark: '#F97316', // Dark Orange
      muted: '#FED7AA', // Muted Orange
    },
    error: {
      default: '#F87171', // Red
      light: '#FCA5A5', // Light Red
      dark: '#EF4444', // Dark Red
      muted: '#FECACA', // Muted Red
    },
  };

  const colorMap = isDark ? darkColorMap : lightColorMap;
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
