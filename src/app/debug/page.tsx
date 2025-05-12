'use client';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';
// Disable cache to avoid static rendering issues
export const revalidate = 0;

import { useState, useEffect } from 'react';
import { injectDebugScript } from '@/lib/debug-script';
import { initializeErrorHandler } from '@/lib/error-handler';

export default function DebugPage() {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  const [mounted, setMounted] = useState(false);
  const [info, setInfo] = useState<Record<string, any>>({});

  useEffect(() => {
    // Setup error handling
    initializeErrorHandler();
    
    // Inject the debug script
    injectDebugScript();
    
    // Collect environment information
    const environmentInfo = {
      userAgent: window.navigator.userAgent,
      language: window.navigator.language,
      windowDimensions: `${window.innerWidth}x${window.innerHeight}`,
      devicePixelRatio: window.devicePixelRatio,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      connectionType: (navigator as any).connection?.effectiveType || 'unknown',
      memoryInfo: (performance as any).memory ? {
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
      } : 'unavailable',
      loadTime: performance.now().toFixed(2) + 'ms',
    };
    
    setInfo(environmentInfo);
    setMounted(true);
  }, []);

  // Function to trigger various errors for testing
  const triggerError = (type: string) => {
    switch (type) {
      case 'reference':
        // @ts-ignore - Intentionally cause a reference error
        console.log(undefinedVariable);
        break;
      case 'type':
        // @ts-ignore - Intentionally cause a type error
        const n = null;
        n.toString();
        break;
      case 'syntax':
        // Syntax errors can't be triggered at runtime, but we can eval malformed code
        try {
          // @ts-ignore
          eval('if (true) {');
        } catch (e) {
          throw e;
        }
        break;
      case 'promise':
        Promise.reject(new Error('Test promise rejection'));
        break;
      default:
        throw new Error('Test error triggered manually');
    }
  };

  if (!mounted) {
    return <div>Loading debug tools...</div>;
  }

  // Only render the full content on the client side to avoid React version conflicts
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-64 bg-gray-300 rounded mb-4"></div>
          <div className="h-6 w-96 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug Tools</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Environment Information</h2>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">
          {JSON.stringify(info, null, 2)}
        </pre>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Trigger Test Errors</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => triggerError('reference')}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reference Error
          </button>
          <button
            onClick={() => triggerError('type')}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Type Error
          </button>
          <button
            onClick={() => triggerError('syntax')}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Syntax Error
          </button>
          <button
            onClick={() => triggerError('promise')}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Promise Rejection
          </button>
          <button
            onClick={() => triggerError('custom')}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Custom Error
          </button>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Console Instructions</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <p className="mb-2">
            Open your browser console (F12 or Right-click → Inspect → Console) to see detailed error information.
          </p>
          <p>
            The debug tools have enhanced error reporting for better diagnosis of client-side errors.
          </p>
        </div>
      </div>
    </div>
  );
} 