type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
}

interface LoggerConfig {
  minLevel?: LogLevel;
  enableConsole?: boolean;
  maxHistorySize?: number;
}

export class Logger {
  private static instance: Logger;
  private config: Required<LoggerConfig>;
  private history: LogEntry[] = [];

  private constructor(config: LoggerConfig = {}) {
    this.config = { minLevel: 'info',
      enableConsole: true,
      maxHistorySize: 1000,
      ...config
    };
  }

  static getInstance(config?: LoggerConfig): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(config);
    }
    return Logger.instance;
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
      error,
    };

    this.history.push(entry);
    if (this.history.length > this.config.maxHistorySize) {
      this.history.shift();
    }

    if (this.config.enableConsole) {
      const contextStr = context ? `\nContext: ${JSON.stringify(context, null, 2)}` : '';
      const errorStr = error ? `\nError: ${error.stack}` : '';
      
      const colorMap: Record<LogLevel, string> = {
        debug: '\x1b[36m', // Cyan
        info: '\x1b[32m',  // Green
        warn: '\x1b[33m',  // Yellow
        error: '\x1b[31m', // Red
      };

      const reset = '\x1b[0m';
      const color = colorMap[level];
      
      console.log(
        `${color}[${entry.timestamp.toISOString()}] [${level.toUpperCase()}]${reset} ${message}${contextStr}${errorStr}`,
        context || '',
        error || ''
      );
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('debug')) {
      this.log('debug', message, context);
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('info')) {
      this.log('info', message, context);
    }
  }

  warn(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('warn')) {
      this.log('warn', message, context);
    }
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    if (this.shouldLog('error')) {
      this.log('error', message, context, error);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.config.minLevel);
  }

  getHistory(
    filter?: { level?: LogLevel;
      startTime?: Date;
      endTime?: Date;
    }
  ): LogEntry[] {
    return this.history.filter(entry => {
      if (filter?.level && entry.level !== filter.level) return false;
      if (filter?.startTime && entry.timestamp < filter.startTime) return false;
      if (filter?.endTime && entry.timestamp > filter.endTime) return false;
      return true;
    });
  }

  clearHistory() {
    this.history = [];
  }

  setConfig(config: Partial<LoggerConfig>) {
    this.config = {
      ...this.config,
      ...config
    };
  }
} 