// Initialize global error handler for client-side errors
export function initializeErrorHandler() {
  if (typeof window !== 'undefined') {
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      console.group('Uncaught Error:');
      console.error('Error Message:', event.message);
      console.error('Error Source:', event.filename);
      console.error('Error Line:', event.lineno);
      console.error('Error Column:', event.colno);
      console.error('Error Object:', event.error);
      console.groupEnd();
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.group('Unhandled Promise Rejection:');
      console.error('Rejection Reason:', event.reason);
      console.groupEnd();
    });
    
    console.info('Global error handlers initialized');
  }
}

// Function to safely handle async operations
export async function safeAsync<T>(
  promise: Promise<T>,
  errorMessage = 'Operation failed'
): Promise<[T | null, Error | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    console.error(errorMessage, error);
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
} 