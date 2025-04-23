'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { usePipedream } from '@/hooks/usePipedream';
import { useUserStore } from '@/lib/userStore';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import components that use client-side only features
const PipedreamPageContent = dynamic(
  () => import('@/components/PipedreamPageContent'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-pulse gradient-text text-xl">Loading Pipedream connection...</div>
      </div>
    )
  }
);

export default function PipedreamConnectionPage() {
  return <PipedreamPageContent />;
} 