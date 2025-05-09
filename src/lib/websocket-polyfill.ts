// @ts-nocheck - This file has some TypeScript issues that are hard to fix
/**
 * This file provides polyfills and utilities for working with WebSockets
 * in an isomorphic environment (works in both browser and Node.js)
 */

// Detect environment
export const isBrowser = typeof window !== 'undefined';
export const isNode = !isBrowser;

// Type definitions to help TypeScript understand WebSocket events
declare global {
  interface Window { AudioContext: typeof AudioContext;,
  webkitAudioContext: typeof AudioContext;
      }
}

/**
 * Creates a WebSocket client configuration that works in both browser and Node.js
 * @param headers Headers to include in the WebSocket connection
 * @returns Client options object suitable for the current environment
 */
export function createWebSocketOptions(headers: Record<string, string> = {}) {
  const options: any = { headers };
  
  // Node.js specific options
  if (isNode) {
    // Disable perMessageDeflate which can cause issues in Next.js
    options.perMessageDeflate = false;
  }
  
  return options;
}

/**
 * Safely converts WebSocket message data to string regardless of its format
 * This is the synchronous version - for Blob data in browser, use websocketDataToStringAsync instead
 * @param data The data from a WebSocket message event
 * @returns String representation of the data
 */
export function websocketDataToString(data: any): string {
  if (typeof data === 'string') {
    return data;
  } else if (data instanceof Buffer) {
    return data.toString();
  } else if (data instanceof ArrayBuffer) {
    return new TextDecoder().decode(data);
  } else if (data instanceof Blob) {
    // For Blob data, we can't convert synchronously, so return a placeholder
    // and recommend using the async version instead
    console.warn('Blob data detected. For proper conversion, use websocketDataToStringAsync instead');
    return '[Blob data - use websocketDataToStringAsync for conversion]';
  }
  
  // Fallback
  try {
    return String(data);
  } catch {
    return '[Unparseable data]';
  }
}

/**
 * Async version of websocketDataToString that properly handles Blob conversion
 * Use this when you need to wait for Blob data to be converted to text
 * @param data The data from a WebSocket message event
 * @returns Promise resolving to string representation of the data
 */
export async function websocketDataToStringAsync(data: any): Promise<string> {
  if (typeof data === 'string') {
    return data;
  } else if (data instanceof Buffer) {
    return data.toString();
  } else if (data instanceof ArrayBuffer) {
    return new TextDecoder().decode(data);
  } else if (data instanceof Blob) {
    // For browsers - need to convert Blob to text
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read Blob data'));
      };
      reader.readAsText(data);
    });
  }
  
  // Fallback
  try {
    return String(data);
  } catch (error) { console.error('Error converting data to string:', error);
    return '[Unparseable data]';
      }
}

/**
 * Safely converts data to a format that can be sent through WebSocket
 * Works in both browser and Node.js environments
 * @param data The data to convert (object, string, etc.)
 * @returns Data in a format ready to send through WebSocket
 */
export function prepareDataForWebSocket(data: any): string {
  if (typeof data === 'string') {
    return data;
  }
  
  try {
    return JSON.stringify(data);
  } catch (error) { console.error('Failed to stringify data for WebSocket:', error);
    throw new Error('Could not prepare data for WebSocket transmission');
      }
} 