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

  // Handle navigation with error handling
  const handleNavigation = (href: string) => {
    try {
      console.log(`Navigating to: ${href}`);
      router.push(href);
    } catch (error) {
      console.error(`Navigation error to ${href}:`, error);
      // Fallback to window.location if router.push fails
      window.location.href = href;
    }
  };

  return (
    <header className="bg-dark-100/50 border-b border-primary/20 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <button
              onClick={() => handleNavigation('/')}
              className="flex items-center"
            >
              <Image
                src="/new logo isyncso.png"
                alt="ISYNCSO"
                width={120}
                height={32}
                className="h-8 w-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </button>
            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => handleNavigation('/dashboard')}
                className="text-white/80 hover:text-white transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavigation('/workflows')}
                className="text-white/80 hover:text-white transition-colors"
              >
                Workflows
              </button>
              <button
                onClick={() => handleNavigation('/tools')}
                className="text-white/80 hover:text-white transition-colors"
              >
                Tools
              </button>
            </nav>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {currentUser && (
              <div className="flex items-center space-x-2">
                <span className="text-white/80">{currentUser.email}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm text-white/80 hover:text-white bg-white/5 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 