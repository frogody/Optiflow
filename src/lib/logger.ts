/**
 * Centralized logging utility for Optiflow
 * 
 * This module provides a standardized logging interface using Pino.
 * It respects the LOG_LEVEL environment variable and provides context-aware logging.
 */

import pino from 'pino';

// Get log level from environment or use default
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Base logger configuration
const baseLogger = pino({
  level: LOG_LEVEL,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});

// Log levels in order of verbosity
export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

/**
 * Logger interface
 */
export interface Logger {
  trace: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string | Error, ...args: any[]) => void;
  fatal: (message: string | Error, ...args: any[]) => void;
  child: (bindings: Record<string, any>) => Logger;
}

/**
 * Create a logger instance with the given context
 * 
 * @param context The context for this logger (e.g., module name, component name)
 * @param metadata Additional metadata to include with every log
 * @returns A configured logger instance
 * 
 * @example
 * ```typescript
 * // In a service file
 * const logger = createLogger('UserService');
 * 
 * async function createUser(userData) {
 *   logger.info('Creating new user', { email: userData.email });
 *   try {
 *     // ... user creation logic
 *     logger.info('User created successfully', { userId: newUser.id });
 *     return newUser;
 *   } catch (error) {
 *     logger.error('Failed to create user', { error, userData });
 *     throw error;
 *   }
 * }
 * ```
 */
export function createLogger(context: string, metadata: Record<string, any> = {}): Logger {
  return baseLogger.child({ context, ...metadata });
}

/**
 * Root logger instance for general use
 */
export const logger = createLogger('Optiflow');

export default logger; 