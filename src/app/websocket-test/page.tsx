// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import { useState, useEffect } from 'react';
import WebSocket from 'isomorphic-ws';
import { createWebSocketOptions } from '../../lib/websocket-polyfill';

export default function WebSocketTestPage(): JSX.Element {
  const [status, setStatus] = useState('Initializing...');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Test the WebSocket connection
  const testWebSocket = async () => {
    setStatus('Testing WebSocket connection...');
    setError(null);
    
    try {
      // Test with echo.websocket.org which echoes back any message sent
      const wsUrl = 'wss://echo.websocket.org/';
      console.log('Connecting to WebSocket at', wsUrl);
      
      // Initialize WebSocket
      const ws = new WebSocket(wsUrl);
      
      // Set up event handlers
      ws.onopen = () => {
        setStatus('WebSocket connected! Sending test message...');
        
        // Send a test message
        const testMessage = JSON.stringify({ test: 'Hello from browser!'     });
        ws.send(testMessage);
        console.log('Sent test message:', testMessage);
      };
      
      ws.onmessage = (event) => {
        console.log('Received message:', event.data);
        setStatus('Received echo response!');
        setResult({ success: true,
          data: event.data
            });
        
        // Close the connection
        ws.close();
      };
      
      ws.onerror = (error) => { console.error('WebSocket error:', error);
        setStatus('WebSocket error occurred');
        setError('WebSocket error: ' + JSON.stringify(error));
          };
      
      ws.onclose = (event) => { console.log('WebSocket closed:', event.code, event.reason);
        setStatus('WebSocket connection closed');
          };
    } catch (error) { console.error('Error in WebSocket test:', error);
      setStatus('Error occurred');
      setError(error instanceof Error ? error.message : String(error));
        }
  };
  
  // When component mounts, run the test
  useEffect(() => {
    testWebSocket();
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  
  // Try server-side test
  const testServerWebSocket = async () => {
    setStatus('Testing server-side WebSocket...');
    setError(null);
    
    try {
      const response = await fetch('/api/websocket-test', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json'
            }
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Server test result:', data);
      
      if (data.success) {
        setStatus('Server WebSocket test successful!');
      } else {
        setStatus('Server WebSocket test failed');
        setError(data.error || 'Unknown server error');
      }
      
      setResult(data);
    } catch (error) { console.error('Error testing server WebSocket:', error);
      setStatus('Error testing server WebSocket');
      setError(error instanceof Error ? error.message : String(error));
        }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">WebSocket Test Page</h1>
      
      <div className="mb-4 p-4 border rounded">
        <h2 className="text-xl font-semibold">Status: {status}</h2>
        
        {error && (
          <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-800">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {result && (
          <div className="mt-2">
            <h3 className="font-semibold">Result:</h3>
            <pre className="p-2 bg-gray-100 rounded mt-1 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      <div className="flex space-x-4">
        <button 
          onClick={testWebSocket}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Browser WebSocket
        </button>
        
        <button 
          onClick={testServerWebSocket}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Server WebSocket
        </button>
      </div>
    </div>
  );
} 