'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/userStore';
import Image from 'next/image';
import Link from 'next/link';

interface Flow {
  id: string;
  name: string;
  icon: string;
  description: string;
  subDescription: string;
  requiredTools: string[];
  status: 'configured' | 'needs_setup' | 'error';
}

interface QuickAction {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
}

interface UserNavItem {
  label: string;
  href: string;
  icon: string;
}

interface DashboardProps {
  orchestratorId: string;
}

export default function Dashboard({ orchestratorId }: DashboardProps) {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userNavigation: UserNavItem[] = [
    { label: 'Profile Settings', href: '/settings/profile', icon: '👤' },
    { label: 'Billing & Plans', href: '/settings/billing', icon: '💳' },
    { label: 'API Keys', href: '/settings/api-keys', icon: '🔑' },
    { label: 'Team Management', href: '/settings/team', icon: '👥' },
    { label: 'Notifications', href: '/settings/notifications', icon: '🔔' },
    { label: 'Sign Out', href: '/logout', icon: '👋' },
  ];

  const flows: Flow[] = [
    {
      id: 'aora',
      name: 'AORA',
      icon: '/orchestrators/aora.png',
      description: 'Contact prospects and book demos automatically',
      subDescription: 'Requires Clay for prospecting and HubSpot for CRM',
      requiredTools: ['clay', 'hubspot'],
      status: 'needs_setup'
    },
    {
      id: 'nova',
      name: 'NOVA',
      icon: '🌟',
      description: 'Find opportunities and prevent customer loss',
      subDescription: 'Requires LindyAI for analysis and n8n for automation',
      requiredTools: ['lindyai', 'n8n'],
      status: 'configured'
    },
    {
      id: 'close',
      name: 'CLOSE',
      icon: '/orchestrators/close.PNG',
      description: 'Keep customers engaged and growing',
      subDescription: 'Requires HubSpot and LindyAI integration',
      requiredTools: ['hubspot', 'lindyai'],
      status: 'configured'
    },
    {
      id: 'peak',
      name: 'PEAK',
      icon: '⚠️',
      description: 'Keep your customers engaged and growing',
      subDescription: 'Requires n8n and HubSpot integration',
      requiredTools: ['n8n', 'hubspot'],
      status: 'error'
    }
  ];

  const quickActions: QuickAction[] = [
    {
      id: 'create-workflow',
      name: 'Create Workflow',
      description: 'Start building a new automated workflow',
      icon: '🔄',
      href: `/orchestrators/${orchestratorId}/workflows/new`
    },
    {
      id: 'mcp-setup',
      name: 'MCP Setup',
      description: 'Configure your Message Control Protocol',
      icon: '🔌',
      href: `/orchestrators/${orchestratorId}/setup/mcp`
    },
    {
      id: 'tool-connections',
      name: 'Tool Connections',
      description: 'Manage your integrated tools',
      icon: '🔧',
      href: `/orchestrators/${orchestratorId}/tools`
    },
    {
      id: 'templates',
      name: 'Templates',
      description: 'Browse and use workflow templates',
      icon: '📋',
      href: `/orchestrators/${orchestratorId}/templates`
    }
  ];

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [currentUser, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-pulse gradient-text text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Neural Network Background */}
      <div className="neural-bg"></div>

      {/* Floating Particles */}
      <div className="particle" style={{ top: '10%', left: '20%' }}></div>
      <div className="particle" style={{ top: '30%', right: '15%' }}></div>
      <div className="particle" style={{ bottom: '25%', left: '40%' }}></div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Welcome Section */}
        <div className="welcome-section mb-12">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Welcome back, {currentUser?.name || currentUser?.email?.split('@')[0]}
          </h1>
          <p className="text-white/60">
            Select a flow to configure its integrations and automations
          </p>
        </div>

        {/* Command Input */}
        <div className="mb-12">
          <div className="command-input p-4">
            <input
              type="text"
              placeholder="Tell the orchestrator what needs to change in workflows..."
              className="w-full bg-transparent border-none text-white placeholder-white/40 text-lg focus:outline-none"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  router.push(`/orchestrators/${orchestratorId}/workflows/command`);
                }
              }}
            />
          </div>
        </div>

        {/* Flows */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold gradient-text">
              Available Flows
            </h2>
            <Link 
              href={`/orchestrators/${orchestratorId}/flows/new`}
              className="action-button px-4 py-2 rounded-lg"
            >
              + Create new flow
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flows.map((flow) => (
              <div 
                key={flow.id} 
                className="flow-card p-6 rounded-lg cursor-pointer"
                onClick={() => router.push(`/orchestrators/${orchestratorId}/flows/${flow.id}`)}
              >
                <div className="flex items-center gap-3 mb-4">
                  {flow.icon.startsWith('/') ? (
                    <div className="w-8 h-8 relative floating-icon">
                      <Image
                        src={flow.icon}
                        alt={flow.name}
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  ) : (
                    <span className="text-2xl floating-icon">{flow.icon}</span>
                  )}
                  <div>
                    <span className="text-white font-medium text-xl block">{flow.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${
                        flow.status === 'configured' ? 'status-ready' :
                        flow.status === 'needs_setup' ? 'status-setup' :
                        'status-error'
                      }`}></div>
                      <span className="text-sm text-white/60">
                        {flow.status === 'configured' ? 'Ready' :
                         flow.status === 'needs_setup' ? 'Needs setup' :
                         'Configuration error'}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-white/90 text-sm mb-3">{flow.description}</p>
                <p className="text-white/60 text-sm">{flow.subDescription}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {flow.requiredTools.map((tool) => (
                    <span
                      key={tool}
                      className="px-2 py-1 rounded-md bg-white/5 text-white/80 text-xs border border-white/10"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold gradient-text mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => router.push(action.href)}
                className="quick-action p-4 rounded-lg text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl floating-icon">{action.icon}</span>
                  <span className="text-white/90 font-medium">{action.name}</span>
                </div>
                <p className="text-white/50 text-sm mt-2">{action.description}</p>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 