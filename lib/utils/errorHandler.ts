/**
 * Error handling utilities for API errors
 */

import { logger } from './logger';

export interface ErrorInfo {
  type: 'auth' | 'rateLimit' | 'network' | 'server' | 'unknown';
  message: string;
  userMessage: string;
  canRetry: boolean;
  retryAfter?: number; // seconds
}

/**
 * Parse error and extract error information
 */
export function parseError(error: unknown): ErrorInfo {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const lowerMessage = errorMessage.toLowerCase();

  // Log error for debugging
  logger.error('Error occurred', error instanceof Error ? error : new Error(errorMessage), {
    errorMessage,
    errorType: error instanceof Error ? error.constructor.name : typeof error,
  });

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
