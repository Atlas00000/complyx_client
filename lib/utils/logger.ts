/**
 * Client-side structured logging utility
 * Provides consistent logging with levels, context, and optional remote logging
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  [key: string]: unknown;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  userAgent?: string;
  url?: string;
  userId?: string;
}

const REMOTE_LOG_FLUSH_INTERVAL_MS = 30000;
const REMOTE_LOG_BUFFER_MAX = 20;
const REMOTE_INFO_SAMPLE_RATE = 0.1;
const MAX_MESSAGE_LENGTH_REMOTE = 2000;
const MAX_CONTEXT_STRING_LENGTH = 500;

const SENSITIVE_KEYS = new Set([
  'password', 'token', 'accessToken', 'refreshToken', 'authorization', 'cookie',
  'secret', 'apiKey', 'apikey', 'auth', 'credential', 'credentials',
]);

function sanitizeForRemote(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return value.slice(0, MAX_CONTEXT_STRING_LENGTH);
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  if (Array.isArray(value)) return value.slice(0, 20).map(sanitizeForRemote);
  if (typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      const lower = k.toLowerCase();
      if (SENSITIVE_KEYS.has(lower) || lower.includes('password') || lower.includes('token')) continue;
      out[k] = sanitizeForRemote(v);
    }
    return out;
  }
  return value;
}

function sanitizeContext(ctx: LogContext | undefined): LogContext | undefined {
  if (!ctx || typeof ctx !== 'object') return ctx;
  const out: LogContext = {};
  for (const [k, v] of Object.entries(ctx)) {
    const lower = k.toLowerCase();
    if (SENSITIVE_KEYS.has(lower) || lower.includes('password') || lower.includes('token')) continue;
    out[k] = sanitizeForRemote(v);
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

class Logger {
  private isDevelopment: boolean;
  private isProduction: boolean;
  private logLevel: LogLevel;
  private enableRemoteLogging: boolean;
  private remoteLogEndpoint?: string;
  private remoteLogBuffer: Array<{ level: string; message: string; timestamp: string; context?: LogContext }> = [];
  private remoteFlushTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isProduction = process.env.NODE_ENV === 'production';
    this.logLevel = (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || 'info';
    this.enableRemoteLogging = process.env.NEXT_PUBLIC_ENABLE_REMOTE_LOGGING === 'true';
    this.remoteLogEndpoint = process.env.NEXT_PUBLIC_LOG_ENDPOINT;
    this.initRemoteTransport();
  }

  private getTelemetryLogUrl(): string {
    const base = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? `${window.location.origin.replace(/:\d+$/, '')}:3001` : 'http://localhost:3001');
    return `${base}/api/telemetry/log`;
  }

  private initRemoteTransport(): void {
    if (typeof window === 'undefined' || !this.enableRemoteLogging) return;
    this.remoteFlushTimer = setInterval(() => this.flushRemoteBuffer(), REMOTE_LOG_FLUSH_INTERVAL_MS);
    const flushAndClear = () => {
      if (this.remoteFlushTimer !== null) {
        clearInterval(this.remoteFlushTimer);
        this.remoteFlushTimer = null;
      }
      this.flushRemoteBuffer();
    };
    window.addEventListener('beforeunload', flushAndClear);
    window.addEventListener('pagehide', flushAndClear);
  }

  private flushRemoteBuffer(): void {
    if (this.remoteLogBuffer.length === 0) return;
    const entries = [...this.remoteLogBuffer];
    this.remoteLogBuffer = [];
    const url = this.remoteLogEndpoint || this.getTelemetryLogUrl();
    const body = JSON.stringify({ entries });
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
    }
  }

  private pushToRemoteBuffer(level: LogLevel, message: string, context?: LogContext): void {
    if (!this.enableRemoteLogging) return;
    if (this.isProduction && (level === 'info' || level === 'debug') && Math.random() >= REMOTE_INFO_SAMPLE_RATE) return;
    const browserContext = this.getBrowserContext();
    const safeContext = sanitizeContext({ ...browserContext, ...context });
    const safeMessage = typeof message === 'string' ? message.slice(0, MAX_MESSAGE_LENGTH_REMOTE) : String(message).slice(0, MAX_MESSAGE_LENGTH_REMOTE);
    this.remoteLogBuffer.push({
      level,
      message: safeMessage,
      timestamp: new Date().toISOString(),
      context: safeContext,
    });
    if (this.remoteLogBuffer.length >= REMOTE_LOG_BUFFER_MAX) this.flushRemoteBuffer();
  }

  /**
   * Check if a log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  /**
   * Get browser context
   */
  private getBrowserContext(): {
    userAgent?: string;
    url?: string;
    isMobile?: boolean;
    viewportWidth?: number;
    viewportHeight?: number;
    connectionType?: string;
  } {
    if (typeof window === 'undefined') return {};

    const isMobile =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(max-width: 768px)').matches
        : false;

    const nav = navigator as Navigator & {
      connection?: { effectiveType?: string } | undefined;
    };

    return {
      userAgent: navigator.userAgent,
      url: window.location.href,
      isMobile,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      connectionType: nav.connection?.effectiveType,
    };
  }

  /**
   * Format log entry
   */
  private formatLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): LogEntry {
    const browserContext = this.getBrowserContext();
    
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
      ...browserContext,
    };
  }

  /**
   * Format console message with emoji and color
   */
  private formatConsoleMessage(entry: LogEntry): string {
    const emoji = {
      debug: '🔍',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
    }[entry.level];

    const prefix = `${emoji} [${entry.level.toUpperCase()}]`;
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const contextStr = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
    const errorStr = entry.error ? `\n  Error: ${entry.error.name}: ${entry.error.message}` : '';

    return `${prefix} [${timestamp}] ${entry.message}${contextStr}${errorStr}`;
  }

  /**
   * Core log method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry = this.formatLogEntry(level, message, context, error);

    // Console logging
    if (this.isDevelopment) {
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[consoleMethod](this.formatConsoleMessage(entry));
      
      // In development, also log full entry for debugging
      if (level === 'error' || level === 'debug') {
        console[consoleMethod]('Full log entry:', entry);
      }
    } else if (this.isProduction && (level === 'error' || level === 'warn')) {
      // In production, only log errors and warnings to console
      const consoleMethod = level === 'error' ? 'error' : 'warn';
      console[consoleMethod](this.formatConsoleMessage(entry));
    }

    // Remote transport: buffer then flush on error/warn immediately, or on interval/page unload
    if (this.enableRemoteLogging) {
      this.pushToRemoteBuffer(level, message, context);
      if (level === 'error' || level === 'warn') {
        this.flushRemoteBuffer();
      }
    }
  }

  /**
   * Debug level logging
   */
  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  /**
   * Info level logging
   */
  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  /**
   * Warning level logging
   */
  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  /**
   * Error level logging
   */
  error(message: string, error?: Error, context?: LogContext): void {
    this.log('error', message, context, error);
  }

  /**
   * Log API request
   */
  apiRequest(method: string, url: string, context?: LogContext): void {
    this.debug(`API Request: ${method} ${url}`, {
      ...context,
      method,
      url,
    });
  }

  /**
   * Log API response
   */
  apiResponse(method: string, url: string, status: number, duration?: number, context?: LogContext): void {
    const level = status >= 400 ? 'error' : status >= 300 ? 'warn' : 'info';
    this.log(level, `API Response: ${method} ${url} - ${status}`, {
      ...context,
      method,
      url,
      status,
      duration,
    });
  }

  /**
   * Log API error
   */
  apiError(method: string, url: string, error: Error, context?: LogContext): void {
    this.error(`API Error: ${method} ${url}`, error, {
      ...context,
      method,
      url,
    });
  }

  /**
   * Log user action
   */
  userAction(action: string, context?: LogContext): void {
    this.info(`User Action: ${action}`, context);
  }

  /**
   * Log performance metric
   */
  performance(metric: string, duration: number, context?: LogContext): void {
    this.debug(`Performance: ${metric}`, {
      ...context,
      metric,
      duration,
      unit: 'ms',
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export default for convenience
export default logger;
