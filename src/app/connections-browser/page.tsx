'use client';

import { motion } from 'framer-motion';

import MCPConnectionsBrowser from '@/components/MCPConnectionsBrowser';

export default function ConnectionsBrowserPage(): JSX.Element {
  const handleBackToDashboard = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-200">
      {/* Neural Network Background */}
      {/* <div className="neural-bg"></div> */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="flex flex-col sm:flex-row items-start justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
              Connections Browser
            </h1>
            <p className="text-gray-400 text-lg">
              Manage and explore your Pipedream connections.
            </p>
          </div>
          <button
            onClick={handleBackToDashboard}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg shadow-md transition duration-150 ease-in-out flex-shrink-0"
          >
            Back to Dashboard
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20     }}
          animate={{ opacity: 1, y: 0     }}
          transition={{ duration: 0.5     }}
          className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-xl"
        >
          <MCPConnectionsBrowser />
        </motion.div>
      </main>
    </div>
  );
} 