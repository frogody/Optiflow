'use client';

import React, { useEffect, useState } from 'react';

// Declare global type for window.streamReference
declare global {
  interface Window {
    streamReference?: MediaStream;
  }
}

// Helper function to request microphone access explicitly
const requestMicrophoneAccess = async (): Promise<boolean> => {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Browser does not support mediaDevices API');
      return false;
    }

    // Request access to the microphone with audio configuration for better quality
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      } 
    });
    
    // If we get here, permission was granted
    // Keep a reference to the stream for Chrome (helps maintain permissions)
    if (typeof window !== 'undefined') {
      window.streamReference = stream;
      
      // Store permission state in localStorage for persistence across refreshes
      localStorage.setItem('micPermissionGranted', 'true');
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting microphone access:', error);
    
    // Store rejected state in localStorage
    if (typeof window !== 'undefined' && error instanceof DOMException && error.name === 'NotAllowedError') {
      localStorage.setItem('micPermissionGranted', 'false');
    }
    
    return false;
  }
};

export default function MicrophonePermission() {
  const [mounted, setMounted] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [browserDetails, setBrowserDetails] = useState<string | null>(null);

  useEffect(() => {
    // Set mounted state only if we're in the browser
    if (typeof window !== 'undefined') {
      setMounted(true);
      
      // Check if we have a stored permission state
      const storedPermission = localStorage.getItem('micPermissionGranted');
      if (storedPermission === 'true') {
        setPermissionStatus('granted');
      } else if (storedPermission === 'false') {
        setPermissionStatus('denied');
      }
      
      // Detect browser for better error messages
      const userAgent = window.navigator.userAgent;
      const browserInfo = [];
      
      if (userAgent.indexOf('Chrome') > -1) browserInfo.push('Chrome');
      if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) browserInfo.push('Safari');
      if (userAgent.indexOf('Firefox') > -1) browserInfo.push('Firefox');
      if (userAgent.indexOf('Edge') > -1) browserInfo.push('Edge');
      
      if (browserInfo.length > 0) {
        setBrowserDetails(browserInfo.join('/'));
      }
    }
    
    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const checkPermission = async () => {
      try {
        // First check if browser supports the permissions API
        if (!navigator.permissions) {
          setError('Your browser does not fully support permissions API. We will try to request microphone access directly.');
          
          // Fallback for browsers without permissions API (like Safari)
          const granted = await requestMicrophoneAccess();
          setPermissionStatus(granted ? 'granted' : 'denied');
          return;
        }

        // Check current permission status
        const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setPermissionStatus(result.state);
        
        // Update localStorage based on permission state
        localStorage.setItem('micPermissionGranted', result.state === 'granted' ? 'true' : 'false');

        // If it's 'prompt' or permission not confirmed, try to request access proactively
        if (result.state === 'prompt' || !localStorage.getItem('micPermissionGranted')) {
          try {
            const granted = await requestMicrophoneAccess();
            // Update permission status if we successfully got access
            if (granted) {
              setPermissionStatus('granted');
              localStorage.setItem('micPermissionGranted', 'true');
            }
          } catch (err) {
            console.error('Error in proactive permission request:', err);
            // We'll let the normal flow continue
          }
        }

        // Listen for permission changes
        const handleChange = () => {
          setPermissionStatus(result.state);
          localStorage.setItem('micPermissionGranted', result.state === 'granted' ? 'true' : 'false');
        };

        result.addEventListener('change', handleChange);
        return () => {
          result.removeEventListener('change', handleChange);
        };
      } catch (error) {
        console.error('Error checking microphone permission:', error);
        setError('An error occurred while checking microphone permissions. Please ensure your browser allows microphone access.');
        
        // Try direct request as a fallback
        try {
          const granted = await requestMicrophoneAccess();
          setPermissionStatus(granted ? 'granted' : 'denied');
        } catch (directError) {
          console.error('Direct permission request also failed:', directError);
        }
      }
    };

    checkPermission();
  }, [mounted]);

  const handleRequestPermission = async () => {
    try {
      setError(null); // Clear any previous errors
      
      // First check if permission is manually blocked in browser settings
      if (permissionStatus === 'denied' && navigator.permissions) {
        const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (result.state === 'denied') {
          setError('Microphone access is blocked in your browser settings. Please enable it and reload the page.');
          return;
        }
      }
      
      const granted = await requestMicrophoneAccess();
      if (granted) {
        setPermissionStatus('granted');
        localStorage.setItem('micPermissionGranted', 'true');
      } else {
        // If we couldn't get permission, show instructions
        setError('Could not get microphone permission. Please check your browser settings.');
        localStorage.setItem('micPermissionGranted', 'false');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      setError('Failed to request microphone permission');
    }
  };

  // Don't render anything if not mounted or permission is granted
  if (!mounted || permissionStatus === 'granted') return null;

  // Render directly without a portal
  return (
    <div className="fixed top-4 right-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 max-w-sm">
      {error ? (
        <div className="text-red-500 dark:text-red-400">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
          {browserDetails && (
            <p className="text-xs mt-1">Browser detected: {browserDetails}</p>
          )}
          <button
            onClick={handleRequestPermission}
            className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 ml-2 px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Reload Page
          </button>
        </div>
      ) : permissionStatus === 'prompt' ? (
        <div className="text-blue-500 dark:text-blue-400">
          <p className="font-medium">Microphone Access Required</p>
          <p className="text-sm">Please allow microphone access when prompted</p>
          <button
            onClick={handleRequestPermission}
            className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Request Access
          </button>
        </div>
      ) : permissionStatus === 'denied' ? (
        <div className="text-yellow-500 dark:text-yellow-400">
          <p className="font-medium">Microphone Access Denied</p>
          <p className="text-sm">
            Microphone access is required for voice commands. Please enable it in your browser settings.
          </p>
          {browserDetails === 'Chrome' && (
            <p className="text-xs mt-1">
              In Chrome: Click the padlock icon in the address bar → Site settings → Allow microphone
            </p>
          )}
          {browserDetails === 'Safari' && (
            <p className="text-xs mt-1">
              In Safari: Preferences → Websites → Microphone → Allow for this website
            </p>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : null}
    </div>
  );
} 