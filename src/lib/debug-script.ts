// Debug script that can be manually included in production to diagnose client-side errors
// Add this script manually to your HTML head when debugging is needed

export const debugScript = `
// Enhanced error logging and debugging for production
(function() {
  // Track original methods to restore them later if needed
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  // Enhanced console.error
  console.error = function(...args) {
    // Call original method
    originalConsoleError.apply(console, args);
    
    // Add stack trace for all errors
    if (args[0] instanceof Error) {
      console.groupCollapsed('Error Details');
      console.info('Error Stack:', args[0].stack);
      console.info('Error Name:', args[0].name);
      console.info('Component Stack:', args[0].componentStack);
      console.groupEnd();
    }
  };

  // Track uncaught errors
  window.addEventListener('error', function(event) {
    console.groupCollapsed('Uncaught Error');
    console.info('Message:', event.message);
    console.info('Source:', event.filename);
    console.info('Line:', event.lineno);
    console.info('Column:', event.colno);
    console.info('Error:', event.error);
    console.groupEnd();
    
    // Optionally prevent the error from being reported to the browser
    // event.preventDefault();
  });

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    console.groupCollapsed('Unhandled Promise Rejection');
    console.info('Reason:', event.reason);
    if (event.reason instanceof Error) {
      console.info('Stack:', event.reason.stack);
    }
    console.groupEnd();
    
    // Optionally prevent the rejection from being reported to the browser
    // event.preventDefault();
  });

  console.info('Debug script loaded and running');
})();
`;

export function injectDebugScript() {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    try {
      const scriptElement = document.createElement('script');
      scriptElement.textContent = debugScript;
      document.head.appendChild(scriptElement);
      console.info('Debug script injected');
    } catch (error) {
      console.error('Failed to inject debug script:', error);
    }
  }
} 