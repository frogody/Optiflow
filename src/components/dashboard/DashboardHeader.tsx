'use client';

import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/userStore';
import Cookies from 'js-cookie';
import Image from 'next/image';

export default function DashboardHeader() {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  const handleLogout = () => {
    setCurrentUser(null);
    Cookies.remove('user-token');
    router.push('/login');
  };

  return (
    <header className="bg-dark-100/50 border-b border-primary/20 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Image
              src="/logo.png"
              alt="ISYNCSO"
              width={120}
              height={32}
              className="h-8 w-auto opacity-90 hover:opacity-100 transition-opacity"
            />
            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-white/80 hover:text-white transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push('/workflows')}
                className="text-white/80 hover:text-white transition-colors"
              >
                Workflows
              </button>
              <button
                onClick={() => router.push('/tools')}
                className="text-white/80 hover:text-white transition-colors"
              >
                Tools
              </button>
            </nav>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="text-white/80">
              {currentUser?.name || currentUser?.email}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white bg-dark-100/50 rounded-md border border-primary/20 hover:border-primary/40 transition-all duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 