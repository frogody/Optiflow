'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Log error details to console for debugging
    console.group('Error caught by ErrorBoundary:');
    console.error('Error:', error);
    console.error('Component Stack:', info.componentStack);
    if (error.stack) {
      console.error('Error Stack:', error.stack);
    }
    console.groupEnd();

    // If Sentry is available, report the error
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        extra: {
          componentStack: info.componentStack,
          url: window.location.href,
          userAgent: navigator.userAgent
        }
      });
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We're sorry, but an error occurred while rendering this page.
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-auto max-h-[200px] mb-4">
              <code className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {this.state.error?.message || "Unknown error"}
                {this.state.error?.stack && (
                  <>
                    {"\n\n"}
                    <span className="text-xs">
                      {this.state.error.stack}
                    </span>
                  </>
                )}
              </code>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 