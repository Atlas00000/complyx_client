/**
 * Fetch wrapper with automatic logging
 * Wraps fetch calls to add request/response logging
 */

import { logger } from '@/lib/utils/logger';

export interface FetchOptions extends RequestInit {
  skipLogging?: boolean;
  logContext?: Record<string, unknown>;
}

/**
 * Fetch with automatic logging
 */
export async function fetchWithLogging(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { skipLogging = false, logContext = {}, ...fetchOptions } = options;
  const method = fetchOptions.method || 'GET';
  const startTime = Date.now();

  // Log request
  if (!skipLogging) {
    logger.apiRequest(method, url, {
      ...logContext,
      headers: fetchOptions.headers,
    });
  }

  try {
    const response = await fetch(url, fetchOptions);
    const duration = Date.now() - startTime;

    // Log response
    if (!skipLogging) {
      logger.apiResponse(method, url, response.status, duration, {
        ...logContext,
        statusText: response.statusText,
      });
    }

    return response;
  } catch (error) {
    const duration = Date.now() - startTime;

    // Log error
    if (!skipLogging) {
      logger.apiError(
        method,
        url,
        error instanceof Error ? error : new Error(String(error)),
        {
          ...logContext,
          duration,
        }
      );
    }

    throw error;
  }
}

/**
 * Fetch JSON with automatic logging
 */
export async function fetchJson<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const response = await fetchWithLogging(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return response.json();
}
