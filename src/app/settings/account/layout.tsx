import { Metadata } from 'next';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: 'Account Settings - Optiflow',
  description: 'Manage your account preferences and security settings',
};

export default function AccountSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Premium background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="absolute w-full h-full">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-[100px] rounded-full transform -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-l from-indigo-500/10 to-blue-500/10 blur-[100px] rounded-full transform translate-y-1/2" />
        </div>
      </div>
      
      {/* Content container with premium styling */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative">
            {/* Animated border gradient */}
            <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-sm group-hover:opacity-30 transition duration-500" />
            
            {/* Main content area */}
            <div className="relative bg-gray-900/60 backdrop-blur-xl rounded-lg shadow-2xl border border-gray-800/50">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 