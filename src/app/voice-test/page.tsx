'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const VoiceTestPage = () => {
  const [message, setMessage] = useState('');

  const handleMicTest = async () => {
    try {
      setMessage('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMessage('✅ Microphone access granted!');
      
      // Stop tracks immediately
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      setMessage(`❌ Microphone access failed: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Voice Agent Testing</h1>
      
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-bold mb-6 text-center">Troubleshooting Steps</h2>
        
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="p-4 border border-gray-700 rounded-lg">
            <h3 className="font-semibold mb-2">1. Test Basic Microphone Access</h3>
            <p className="text-gray-300 text-sm mb-4">This checks if your browser can access your microphone.</p>
            <button
              onClick={handleMicTest}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Test Microphone
            </button>
            {message && (
              <div className={`mt-3 p-2 rounded text-sm ${message.includes('✅') ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                {message}
              </div>
            )}
          </div>
          
          {/* Step 2 */}
          <div className="p-4 border border-gray-700 rounded-lg">
            <h3 className="font-semibold mb-2">2. Test Isolated LiveKit Connection</h3>
            <p className="text-gray-300 text-sm mb-4">This tests LiveKit connection without the full voice agent UI.</p>
            <Link 
              href="/voice-simple-test"
              className="block w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-center"
            >
              Go to Simple Test
            </Link>
          </div>
          
          {/* Step 3 */}
          <div className="p-4 border border-gray-700 rounded-lg">
            <h3 className="font-semibold mb-2">3. Check Environment Variables</h3>
            <div className="bg-gray-900 p-3 rounded text-xs font-mono mb-3">
              <div className="text-green-400">LIVEKIT_URL format: wss://yourserver.livekit.cloud</div>
              <div className="text-green-400">LIVEKIT_API_KEY: Should be non-empty</div>
              <div className="text-green-400">LIVEKIT_API_SECRET: Should be non-empty</div>
            </div>
            <p className="text-gray-400 text-xs">Make sure these are set correctly in your .env.local file</p>
          </div>

          {/* Add a new step for directly checking LiveKit credentials */}
          <div className="p-4 border border-gray-700 rounded-lg">
            <h3 className="font-semibold mb-2">3. Check LiveKit Credentials</h3>
            <p className="text-gray-300 text-sm mb-4">Directly check if your LiveKit API credentials are valid.</p>
            <Link 
              href="/api/livekit/check-credentials" 
              target="_blank"
              className="block w-full py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors text-center"
            >
              Verify Credentials
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-400 max-w-md text-sm">
        <p>If all tests pass but you're still having issues, check the browser console for errors and make sure your LiveKit server is running and accessible.</p>
      </div>
    </div>
  );
};

export default VoiceTestPage; 