/**
 * Client telemetry API – report errors to backend for visibility (e.g. from mobile).
 * Fire-and-forget; does not throw.
 */

const getBaseUrl = (): string =>
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_API_URL || `${window.location.protocol}//${window.location.hostname}:3001`)
    : '';

export interface ReportErrorOptions {
  stack?: string;
  code?: string;
  url?: string;
  level?: string;
}

/**
 * Report a client error to POST /api/telemetry/error.
 * Safe to call from ErrorBoundary or API client; does not throw.
 */
export function reportClientError(message: string, options: ReportErrorOptions = {}): void {
  if (typeof window === 'undefined') return;

  const base = getBaseUrl();
  if (!base) return;

  const url = `${base}/api/telemetry/error`;
  const body = {
    message: String(message).slice(0, 2000),
    stack: options.stack?.slice(0, 5000),
    code: options.code,
    url: options.url ?? window.location.href,
    userAgent: navigator.userAgent,
    level: options.level ?? 'error',
  };

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // ignore
  }
}
