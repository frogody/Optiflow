/**
 * Utility functions for WebSocket data handling
 */

/**
 * Converts WebSocket data to string asynchronously
 * @param data The WebSocket data to convert
 * @returns Promise resolving to the string representation of the data
 */
export async function websocketDataToStringAsync(data: Buffer | ArrayBuffer | Blob): Promise<string> {
  if (data instanceof Buffer) {
    return data.toString('utf8');
  }
  
  if (data instanceof ArrayBuffer) {
    return new TextDecoder().decode(data);
  }
  
  if (data instanceof Blob) {
    return await data.text();
  }
  
  throw new Error('Unsupported WebSocket data type');
} 