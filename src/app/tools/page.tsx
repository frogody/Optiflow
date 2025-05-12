'use client';

import { useState, useEffect } from 'react';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';
// Disable cache to avoid static rendering issues
export const revalidate = 0;

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const ToolsContent = dynamic(() => import('@/components/ToolsContent'), { ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="loading-pulse gradient-text text-xl">Loading tools...</div>
    </div>
  )
    });

export default function ToolsPage() {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  const { data: session, status     } = useSession();

  if (status === 'loading') {
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-pulse gradient-text text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="mb-6">You must be signed in to view this page.</p>
        <Link 
          href="/login"
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return <ToolsContent />;
} 