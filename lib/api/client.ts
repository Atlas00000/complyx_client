import { fetchWithLogging, FetchOptions } from '@/lib/api/fetchWithLogging';
import { reportClientError } from '@/lib/api/telemetryApi';

export interface ApiErrorShape {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

export class ApiError extends Error {
  code?: string;
  status?: number;
  details?: unknown;

  constructor(payload: ApiErrorShape) {
    super(payload.message);
    this.name = 'ApiError';
    this.code = payload.code;
    this.status = payload.status;
    this.details = payload.details;
  }
}

export interface RequestConfig extends FetchOptions {
  /** If true, do not throw on non-2xx; just return Response */
  rawResponse?: boolean;
}

export async function requestJson<T>(
  url: string,
  config: RequestConfig = {}
): Promise<T> {
  const { rawResponse, ...fetchOptions } = config;

  const maxRetries = 2;
  let attempt = 0;
  let response: Response | null = null;

  // Basic retry loop for clearly transient errors
  //  - Network failures (fetch throws)
  //  - 502 / 503 / 504
  // Linear backoff with small delay between attempts
  // Note: Not suitable for idempotency-critical operations; keep usage to safe GET/POST reads.
  // Caller can disable by passing a custom implementation if needed.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      response = await fetchWithLogging(url, fetchOptions);
      if (![502, 503, 504].includes(response.status) || attempt >= maxRetries) {
        break;
      }
    } catch (err) {
      if (attempt >= maxRetries) {
        throw err;
      }
    }
    attempt += 1;
    await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
  }

  if (!response) {
    throw new ApiError({
      message: 'Request failed with no response',
      code: 'NETWORK_ERROR',
    });
  }

  if (rawResponse) {
    // @ts-expect-error - caller expects Response when rawResponse is true
    return response;
  }

  const status = response.status;
  let body: any = null;

  try {
    // Try to parse JSON; fall back to text
    const text = await response.text();
    body = text ? JSON.parse(text) : null;
  } catch {
    // Ignore JSON parse errors; body stays null or raw text
  }

  if (!response.ok) {
    const errorShape: ApiErrorShape = {
      message:
        (body && (body.error || body.message)) ||
        `Request failed with status ${status}`,
      code: body?.code,
      status,
      details: body,
    };
    reportClientError(errorShape.message, {
      code: errorShape.code,
      url,
      level: status >= 500 ? 'error' : 'warn',
    });
    throw new ApiError(errorShape);
  }

  return body as T;
}

