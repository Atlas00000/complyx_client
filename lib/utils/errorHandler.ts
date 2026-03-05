/**
 * Error handling utilities for API errors
 */

import { logger } from './logger';

export interface ErrorInfo {
  type: 'auth' | 'forbidden' | 'rateLimit' | 'network' | 'server' | 'unknown';
  message: string;
  userMessage: string;
  canRetry: boolean;
  retryAfter?: number; // seconds
}

/** Error shape with optional code (e.g. from ApiError or dashboard API) */
function getErrorCode(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'code' in error && typeof (error as { code: unknown }).code === 'string') {
    return (error as { code: string }).code;
  }
  return undefined;
}

/**
 * Parse error and extract error information
 * Recognizes dashboard API codes: DASHBOARD_UNAUTHORIZED, DASHBOARD_FORBIDDEN, DASHBOARD_ERROR
 */
export function parseError(error: unknown): ErrorInfo {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const lowerMessage = errorMessage.toLowerCase();
  const code = getErrorCode(error);

  // Log error for debugging
  logger.error('Error occurred', error instanceof Error ? error : new Error(errorMessage), {
    errorMessage,
    errorType: error instanceof Error ? error.constructor.name : typeof error,
    code,
  });

  // Dashboard and API error codes take precedence
  if (code === 'DASHBOARD_UNAUTHORIZED') {
    return {
      type: 'auth',
      message: errorMessage,
      userMessage: 'Please sign in to view the dashboard.',
      canRetry: false,
    };
  }
  if (code === 'DASHBOARD_FORBIDDEN') {
    return {
      type: 'forbidden',
      message: errorMessage,
      userMessage: "You don't have access to this dashboard.",
      canRetry: false,
    };
  }
  if (code === 'DASHBOARD_ERROR') {
    return {
      type: 'server',
      message: errorMessage,
      userMessage: 'Dashboard is temporarily unavailable. Please try again.',
      canRetry: true,
    };
  }

  // Check for 401 Unauthorized
  if (lowerMessage.includes('401') || lowerMessage.includes('unauthorized')) {
    return {
      type: 'auth',
      message: errorMessage,
      userMessage: 'Authentication required. Please log in to view your scores.',
      canRetry: false,
    };
  }

  // Check for 429 Too Many Requests
  if (lowerMessage.includes('429') || lowerMessage.includes('too many requests')) {
    // Try to extract retry-after from error message or default to 60 seconds
    const retryMatch = errorMessage.match(/retry[-\s]after[:\s]+(\d+)/i);
    const retryAfter = retryMatch ? parseInt(retryMatch[1], 10) : 60;

    return {
      type: 'rateLimit',
      message: errorMessage,
      userMessage: `Too many requests. Please wait ${retryAfter} seconds before trying again.`,
      canRetry: true,
      retryAfter,
    };
  }

  // Check for network errors
  if (
    lowerMessage.includes('network') ||
    lowerMessage.includes('fetch') ||
    lowerMessage.includes('connection') ||
    lowerMessage.includes('failed to fetch')
  ) {
    return {
      type: 'network',
      message: errorMessage,
      userMessage: 'Network error. Please check your connection and try again.',
      canRetry: true,
    };
  }

  // Check for server errors (5xx)
  if (
    lowerMessage.includes('500') ||
    lowerMessage.includes('502') ||
    lowerMessage.includes('503') ||
    lowerMessage.includes('504') ||
    lowerMessage.includes('internal server error')
  ) {
    return {
      type: 'server',
      message: errorMessage,
      userMessage: 'Server error. Please try again in a few moments.',
      canRetry: true,
    };
  }

  // Unknown error
  return {
    type: 'unknown',
    message: errorMessage,
    userMessage: 'An unexpected error occurred. Please try again.',
    canRetry: true,
  };
}
