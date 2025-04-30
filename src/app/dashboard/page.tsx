'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/userStore';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DashboardCard from '@/components/DashboardCard';
import { usePipedream } from '@/hooks/usePipedream';
import AgentDashboard from '@/components/AgentDashboard';
import { OrchestratorInput } from '@/components/OrchestratorInput';
import { useVoiceStore } from '@/stores/voiceStore';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

const DashboardContent = dynamic(() => import('@/components/Dashboard'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="loading-pulse gradient-text text-xl">Loading dashboard...</div>
    </div>
  )
});

export default function DashboardPage() {
  const { currentUser } = useUserStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [commandText, setCommandText] = useState('');
  const [isProcessingCommand, setIsProcessingCommand] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'agents'>('overview');
  const { connectionStatus, makeRequest } = usePipedream({ appName: "pipedream" });
  const { isProcessing, setProcessing } = useVoiceStore();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && !currentUser) {
      // Initialize user store from session
      useUserStore.setState({ currentUser: session.user });
    }

    setIsLoading(false);
  }, [status, session, currentUser, router]);

  // Handle command input
  const handleCommand = async (command: string) => {
    try {
      setProcessing(true);
      
      // Your existing command handling logic
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });

      if (!response.ok) {
        throw new Error('Failed to process command');
      }

      const data = await response.json();
      
      // Handle the response
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error processing command:', error);
      toast.error('Failed to process command. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Dashboard card data
  const dashboardCards = [
    {
      title: 'Connections',
      description: 'Manage your API connections and integrations',
      icon: '🔌',
      link: '/connections',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Workflows',
      description: 'Create and manage automated workflows',
      icon: '⚙️',
      link: '/workflows',
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Analytics',
      description: 'Track your workflow performance and API usage',
      icon: '📊',
      link: '/analytics',
      color: 'from-green-500 to-teal-600'
    },
    {
      title: 'Settings',
      description: 'Configure your account and notification preferences',
      icon: '⚙️',
      link: '/settings',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const fetchConnectionStatus = async () => {
    if (connectionStatus === 'connected') {
      try {
        const response = await makeRequest<any>(
          '/connections',
          'GET'
        );
        
        if (response) {
          toast.success('Successfully retrieved connection status');
          return true;
        }
      } catch (error) {
        console.error('Error fetching connection status:', error);
        toast.error('Failed to retrieve connection status');
      }
    } else {
      toast.success('Please connect to Pipedream first');
    }
    return false;
  };

  if (status === 'loading') {
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

  return <DashboardContent />;
} 