'use client';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';
// Disable cache to avoid static rendering issues
export const revalidate = 0;

import React from 'react';
import { useState, useEffect } from 'react';

import ConversationalWorkflowGenerator from '@/components/ConversationalWorkflowGenerator';

export default function ConversationalTestPage() {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
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
    <div className="min-h-screen">
      <ConversationalWorkflowGenerator />
    </div>
  );
}
