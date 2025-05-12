/**
 * Sentry integration for Optiflow
 * 
 * This module provides error tracking and performance monitoring via Sentry.
 * It should be initialized in app layout for client-side monitoring and in
 * API routes for server-side monitoring.
 */

// Use try/catch to avoid build failures if Sentry is not installed
let Sentry: any;

try {
  Sentry = require('@sentry/nextjs');
} catch (e) {
  // Create a mock Sentry object if the package is not available
  Sentry = {
    init: () => {},
    setUser: () => {},
    addBreadcrumb: () => {},
    captureException: () => '',
    captureMessage: () => '',
    startTransaction: () => ({}),
    flush: async () => true,
    BrowserTracing: class {},
    Replay: class {}
  };
  console.warn('Sentry package not found, using mock implementation');
}

/**
 * Sentry initialization options
 */
export interface SentryOptions {
  /** Sentry DSN from dashboard */
  dsn: string;
  /** Environment (production, development, staging) */
  environment?: string;
  /** Release version */
  release?: string;
  /** Sample rate for performance monitoring (0-1) */
  tracesSampleRate?: number;
  /** User information for tracking */
  user?: {
    id?: string;
    email?: string;
    username?: string;
    role?: string;
  };
  /** Initial scope tags */
  tags?: Record<string, string>;
  /** Additional context */
  context?: Record<string, any>;
}

/**
 * Initialize Sentry for error monitoring
 * 
 * Call this function in your app layout or entry point
 * 
 * @param options Sentry configuration options
 * @returns true if initialization was successful
 * 
 * @example
 * ```typescript
 * // In layout.tsx
 * export default function RootLayout({ children }: { children: React.ReactNode }) {
 *   // Only initialize in production
 *   if (process.env.NODE_ENV === 'production') {
 *     initializeSentry({
 *       dsn: process.env.SENTRY_DSN!,
 *       environment: process.env.VERCEL_ENV || 'development',
 *       tracesSampleRate: 0.1
 *     });
 *   }
 *   
 *   return (
 *     <html lang="en">
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 * ```
 */
export function initializeSentry(options: SentryOptions): boolean {
  // Skip initialization if dsn is not provided
  if (!options.dsn) {
    console.warn('Sentry DSN not provided, skipping initialization');
    return false;
  }
  
  try {
    Sentry.init({
      dsn: options.dsn,
      environment: options.environment || process.env.NODE_ENV,
      release: options.release || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
      tracesSampleRate: options.tracesSampleRate || 0.1,
      
      // Default integrations
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay({
          // Capture 10% of all sessions
          sessionSampleRate: 0.1,
          // Capture 100% of sessions with errors
          errorSampleRate: 1.0,
        }),
      ],
    });
    
    // Set user information if provided
    if (options.user) {
      Sentry.setUser(options.user);
    }
    
    // Set initial tags
    if (options.tags) {
      Sentry.setTags(options.tags);
    }
    
    // Add additional context
    if (options.context) {
      Object.entries(options.context).forEach(([key, value]) => {
        Sentry.setContext(key, value);
      });
    }
    
    return true;
  } catch (error) {
    console.error('Failed to initialize Sentry:', error);
    return false;
  }
}

/**
 * Set the current user context in Sentry
 * 
 * @param user User information
 */
export function setUser(user: Sentry.User | null): void {
  Sentry.setUser(user);
}

/**
 * Clear the current user context in Sentry
 */
export function clearUser(): void {
  Sentry.setUser(null);
}

/**
 * Add breadcrumb to the current Sentry scope
 * 
 * @param breadcrumb Breadcrumb data
 */
export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb): void {
  Sentry.addBreadcrumb(breadcrumb);
}

/**
 * Capture an exception in Sentry
 * 
 * @param exception Error object
 * @param context Additional context
 */
export function captureException(exception: any, context?: Sentry.CaptureContext): string {
  return Sentry.captureException(exception, context);
}

/**
 * Capture a custom message in Sentry
 * 
 * @param message Message to capture
 * @param level Severity level
 */
export function captureMessage(message: string, level?: Sentry.SeverityLevel): string {
  return Sentry.captureMessage(message, level);
}

/**
 * Start a new Sentry transaction for performance monitoring
 * 
 * @param context Transaction context
 * @returns Transaction object
 */
export function startTransaction(context: Sentry.TransactionContext): Sentry.Transaction {
  return Sentry.startTransaction(context);
}

/**
 * Flush all events before application closes
 * 
 * @param timeout Maximum time to wait in ms
 * @returns Promise that resolves when flush completes
 */
export async function flush(timeout?: number): Promise<boolean> {
  return Sentry.flush(timeout);
}

// Re-export Sentry types
export type {
  User as SentryUser,
  Breadcrumb as SentryBreadcrumb,
  Transaction as SentryTransaction,
  TransactionContext as SentryTransactionContext,
  SeverityLevel as SentrySeverityLevel,
  CaptureContext as SentryCaptureContext
} from '@sentry/nextjs';

/**
 * Mock Sentry implementation for local development
 * This prevents errors with OpenTelemetry and other dependencies
 */

// Mock the Sentry API
const mockSentry = {
  captureException: (error: Error) => {
    console.error('[Mock Sentry] Captured exception:', error);
    return 'mock-error-id';
  },
  captureMessage: (message: string) => {
    console.log('[Mock Sentry] Captured message:', message);
    return 'mock-message-id';
  },
  init: () => {
    console.log('[Mock Sentry] Initialized');
  },
  flush: async () => {
    console.log('[Mock Sentry] Flushed');
    return true;
  }
};

// Export a mock version of the Sentry API
export { mockSentry as default };

// Mock user monitoring functions
export function monitorUser(userId: string, email?: string) {
  console.log('[Mock Sentry] Monitoring user:', { userId, email });
}

// Mock error monitoring functions
export function captureUserError(error: Error, userId?: string) {
  console.error('[Mock Sentry] User error:', error, { userId });
}

// Mock Sentry trace function
export function startSentryTransaction(name: string, operation: string) {
  console.log('[Mock Sentry] Starting transaction:', { name, operation });
  return {
    finish: () => console.log('[Mock Sentry] Finished transaction:', { name }),
    setTag: (key: string, value: string) => console.log('[Mock Sentry] Set tag:', { key, value }),
    setData: (key: string, value: any) => console.log('[Mock Sentry] Set data:', { key, value })
  };
} 