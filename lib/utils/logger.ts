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

class Logger {
  private isDevelopment: boolean;
  private isProduction: boolean;
  private logLevel: LogLevel;
  private enableRemoteLogging: boolean;
  private remoteLogEndpoint?: string;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isProduction = process.env.NODE_ENV === 'production';
    this.logLevel = (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || 'info';
    this.enableRemoteLogging = process.env.NEXT_PUBLIC_ENABLE_REMOTE_LOGGING === 'true';
    this.remoteLogEndpoint = process.env.NEXT_PUBLIC_LOG_ENDPOINT;
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
  private getBrowserContext(): { userAgent?: string; url?: string } {
    if (typeof window === 'undefined') return {};
    
    return {
      userAgent: navigator.userAgent,
      url: window.location.href,
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
   * Send log to remote endpoint (if enabled)
   */
  private async sendRemoteLog(entry: LogEntry): Promise<void> {
    if (!this.enableRemoteLogging || !this.remoteLogEndpoint) {
      return;
    }

    try {
      // Use sendBeacon for better reliability (doesn't block page unload)
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(entry)], { type: 'application/json' });
        navigator.sendBeacon(this.remoteLogEndpoint, blob);
      } else {
        // Fallback to fetch
        await fetch(this.remoteLogEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
          keepalive: true,
        });
      }
    } catch (error) {
      // Silently fail remote logging to avoid breaking the app
      console.warn('Failed to send remote log:', error);
    }
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

    // Remote logging (async, non-blocking)
    if (this.enableRemoteLogging) {
      this.sendRemoteLog(entry).catch(() => {
        // Silently fail
      });
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
