'use client';

import { motion } from 'framer-motion';
import MCPConnectionsBrowser from '@/components/MCPConnectionsBrowser';
import Link from 'next/link';

export default function ConnectionsBrowserPage() {
  return (
    <div className="min-h-screen">
      {/* Neural Network Background */}
      <div className="neural-bg"></div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold gradient-text">
            Connections (Browser Version)
          </h1>
          <Link href="/dashboard" className="action-button px-4 py-2 rounded-lg">
            Back to Dashboard
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MCPConnectionsBrowser />
        </motion.div>
      </main>
    </div>
  );
} 