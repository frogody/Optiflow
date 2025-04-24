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
    if (!navigator.mediaDevices) {
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

interface MicrophonePermissionProps {
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
}

export default function MicrophonePermission({ onPermissionGranted, onPermissionDenied }: MicrophonePermissionProps) {
  const [mounted, setMounted] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [browserDetails, setBrowserDetails] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMounted(true);
      
      const userAgent = window.navigator.userAgent;
      const browserInfo = [];
      
      if (userAgent.indexOf('Chrome') > -1) browserInfo.push('Chrome');
      if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) browserInfo.push('Safari');
      if (userAgent.indexOf('Firefox') > -1) browserInfo.push('Firefox');
      if (userAgent.indexOf('Edge') > -1) browserInfo.push('Edge');
      
      if (browserInfo.length > 0) {
        setBrowserDetails(browserInfo.join('/'));
      }

      // Initial permission check
      checkPermission();
    }
    
    return () => {
      setMounted(false);
      // Clean up any active stream when component unmounts
      if (window.streamReference) {
        window.streamReference.getTracks().forEach(track => track.stop());
        delete window.streamReference;
      }
    };
  }, []);

  const checkPermission = async () => {
    try {
      // First check if browser supports the permissions API
      if (!navigator.permissions) {
        setError('Your browser does not fully support permissions API. We will try to request microphone access directly.');
        
        // Fallback for browsers without permissions API (like Safari)
        const granted = await requestMicrophoneAccess();
        setPermissionStatus(granted ? 'granted' : 'denied');
        if (granted) {
          onPermissionGranted?.();
        } else {
          onPermissionDenied?.();
        }
        return;
      }

      // Check current permission status
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setPermissionStatus(result.state);
      
      // If permission is already granted, call the callback
      if (result.state === 'granted') {
        onPermissionGranted?.();
        return;
      }

      // If permission is denied, call the callback
      if (result.state === 'denied') {
        onPermissionDenied?.();
        return;
      }

      // If it's 'prompt', request access
      if (result.state === 'prompt') {
        const granted = await requestMicrophoneAccess();
        setPermissionStatus(granted ? 'granted' : 'denied');
        if (granted) {
          onPermissionGranted?.();
        } else {
          onPermissionDenied?.();
        }
      }

      // Listen for permission changes
      const handleChange = () => {
        setPermissionStatus(result.state);
        if (result.state === 'granted') {
          onPermissionGranted?.();
        } else {
          onPermissionDenied?.();
        }
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
        if (granted) {
          onPermissionGranted?.();
        } else {
          onPermissionDenied?.();
        }
      } catch (directError) {
        console.error('Direct permission request also failed:', directError);
        onPermissionDenied?.();
      }
    }
  };

  const handleRequestPermission = async () => {
    try {
      setError(null); // Clear any previous errors
      
      // First check if permission is manually blocked in browser settings
      if (permissionStatus === 'denied' && navigator.permissions) {
        const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (result.state === 'denied') {
          setError('Microphone access is blocked in your browser settings. Please enable it and reload the page.');
          onPermissionDenied?.();
          return;
        }
      }
      
      const granted = await requestMicrophoneAccess();
      if (granted) {
        setPermissionStatus('granted');
        onPermissionGranted?.();
      } else {
        // If we couldn't get permission, show instructions
        setError('Could not get microphone permission. Please check your browser settings.');
        onPermissionDenied?.();
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      setError('Failed to request microphone permission');
      onPermissionDenied?.();
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
        </div>
      ) : (
        <div>
          <p className="font-medium">Microphone Access Required</p>
          <p className="text-sm mt-1">To use voice features, we need access to your microphone.</p>
          <button
            onClick={handleRequestPermission}
            className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Allow Microphone
          </button>
        </div>
      )}
    </div>
  );
}

// Export the helper function for direct use
export { requestMicrophoneAccess }; 