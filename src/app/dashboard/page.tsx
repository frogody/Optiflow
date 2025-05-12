'use client';

import { useEffect, useState } from 'react';
import { CreditCardIcon, PuzzlePieceIcon, MicrophoneIcon, SparklesIcon } from '@heroicons/react/24/outline';

import ActivityFeedWidget from '@/components/dashboard/ActivityFeedWidget';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import KpiWidget from '@/components/dashboard/KpiWidget';
import OnboardingSection from '@/components/dashboard/OnboardingSection';
import QuickActionsWidget from '@/components/dashboard/QuickActionsWidget';
import RecommendationsWidget from '@/components/dashboard/RecommendationsWidget';
import WorkflowsWidget from '@/components/dashboard/WorkflowsWidget';

// All imported components are used in the UI (dashboard widgets, onboarding, and header).

export default function DashboardPage() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [user, setUser] = useState({
    name: 'John',
    email: 'john.doe@example.com',
    isNewUser: true,
    // This would normally come from an API
  });

  // Mock data for additional widgets
  const creditUsage = {
    currentBalance: 6750,
    estimatedDaysRemaining: 28
  };

  const integrationStatus = {
    connectedApps: 8,
    healthyApps: 7
  };

  const jarvisActivity = {
    commandsProcessed: 143,
    commonActions: [
      "Run workflow",
      "Update workflow",
      "Connect integration"
    ]
  };

  // Coming soon features
  const comingSoonFeatures = [
    {
      title: "AI-Powered Workflow Suggestions",
      description: "Smart recommendations based on your usage patterns",
      eta: "June 2025"
    },
    {
      title: "Advanced Analytics Dashboard",
      description: "Deeper insights into your workflow performance",
      eta: "July 2025"
    },
    {
      title: "Team Collaboration Tools",
      description: "Work together on workflows with your team",
      eta: "August 2025"
    }
  ];

  // In a real implementation, the onboarding state would be persisted in a database
  // For now, we'll just store it in local storage
  useEffect(() => {
    const onboardingDismissed = localStorage.getItem('onboardingDismissed');
    if (onboardingDismissed === 'true') {
      setShowOnboarding(false);
    }
  }, []);

  const handleDismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('onboardingDismissed', 'true');
  };

  return (
    <div className="bg-[#111111] min-h-screen">
      {/* Dashboard Header */}
      <DashboardHeader 
        userName={user.name}
        userEmail={user.email}
        notificationCount={3}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E5E7EB]">Dashboard</h1>
          <p className="text-[#9CA3AF] mt-1">Welcome back, {user.name}. Here's an overview of your workflow activity.</p>
        </div>

        {/* Onboarding section for new users */}
        {showOnboarding && user.isNewUser && (
          <OnboardingSection 
            userName={user.name} 
            onClose={handleDismissOnboarding} 
            className="mb-6"
          />
        )}

        {/* Main content sections */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - 8 units wide */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#22D3EE] mb-4">Key Metrics</h2>
              <KpiWidget />
            </div>

            {/* Credit Usage */}
            <div className="bg-[#18181B] border border-[#2A2A35] rounded-lg p-5">
              <div className="flex items-start mb-4">
                <CreditCardIcon className="h-5 w-5 text-[#22D3EE] mr-2" />
                <h3 className="text-[#E5E7EB] font-medium">Credit Usage</h3>
              </div>
              <div className="mb-3">
                <div className="text-3xl font-bold text-white">{creditUsage.currentBalance.toLocaleString()}</div>
                <div className="text-sm text-[#9CA3AF]">Credits Remaining</div>
              </div>
              <div className="mb-3">
                <span className="text-white">~{creditUsage.estimatedDaysRemaining} days remaining</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-2 bg-[#374151] rounded-full mb-3">
                <div 
                  className="h-full bg-[#22D3EE] rounded-full" 
                  style={{ width: `${Math.min(creditUsage.estimatedDaysRemaining / 30 * 100, 100)}%` }} 
                ></div>
              </div>
              
              <a href="/billing" className="text-sm text-[#22D3EE] hover:text-[#06B6D4] transition-colors">
                View billing details →
              </a>
            </div>

            {/* Integration Status */}
            <div className="bg-[#18181B] border border-[#2A2A35] rounded-lg p-5">
              <div className="flex items-start mb-4">
                <PuzzlePieceIcon className="h-5 w-5 text-[#22D3EE] mr-2" />
                <h3 className="text-[#E5E7EB] font-medium">Integration Status</h3>
              </div>
              <div className="mb-3">
                <div className="text-3xl font-bold text-white">{integrationStatus.connectedApps}</div>
                <div className="text-sm text-[#9CA3AF]">Apps Connected</div>
              </div>
              <div className="flex items-center mb-3">
                <div className={`w-2 h-2 rounded-full ${
                  integrationStatus.healthyApps === integrationStatus.connectedApps 
                    ? 'bg-[#10B981]' 
                    : 'bg-[#F59E0B]'
                } mr-2`}></div>
                <span className="text-[#E5E7EB]">
                  {integrationStatus.healthyApps} of {integrationStatus.connectedApps} healthy
                </span>
              </div>
              
              <a href="/connections" className="text-sm text-[#22D3EE] hover:text-[#06B6D4] transition-colors">
                Manage connections →
              </a>
            </div>

            {/* Jarvis Agent Activity */}
            <div className="bg-[#18181B] border border-[#2A2A35] rounded-lg p-5">
              <div className="flex items-start mb-4">
                <MicrophoneIcon className="h-5 w-5 text-[#22D3EE] mr-2" />
                <h3 className="text-[#E5E7EB] font-medium">Jarvis Agent Activity</h3>
              </div>
              <div className="mb-3">
                <div className="text-3xl font-bold text-white">{jarvisActivity.commandsProcessed}</div>
                <div className="text-sm text-[#9CA3AF]">Commands Processed</div>
              </div>
              
              <div>
                <span className="text-[#E5E7EB] text-sm block mb-2">Most Common Actions:</span>
                <ul className="text-[#9CA3AF] text-sm space-y-1">
                  {jarvisActivity.commonActions.map((action, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] mr-2"></div>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - 4 units wide */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Invisible placeholder div to align with KpiWidget */}
            <div className="h-[67px]"></div>
            
            {/* Quick Actions */}
            <QuickActionsWidget />
            
            {/* Coming Soon */}
            <div className="bg-[#18181B] border border-[#2A2A35] rounded-lg p-5">
              <div className="flex items-start mb-4">
                <SparklesIcon className="h-5 w-5 text-[#22D3EE] mr-2" />
                <h3 className="text-[#E5E7EB] font-medium">Coming Soon</h3>
              </div>
              <ul className="space-y-4">
                {comingSoonFeatures.map((feature, index) => (
                  <li key={index} className="border-b border-[#2A2A35] pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-white">{feature.title}</h4>
                        <p className="text-xs text-[#9CA3AF] mt-1">{feature.description}</p>
                      </div>
                      <div className="bg-[#22D3EE20] text-[#22D3EE] text-xs px-2 py-1 rounded-full">
                        {feature.eta}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recent Activity Section - Full width */}
          <div className="col-span-12 mt-2">
            <h2 className="text-xl font-bold text-[#22D3EE] mb-4">Recent Activity</h2>
            <ActivityFeedWidget />
          </div>

          {/* Your Workflows - Full width */}
          <div className="col-span-12 mt-2">
            <h2 className="text-xl font-bold text-[#22D3EE] mb-4">Your Workflows</h2>
            <WorkflowsWidget showFavorites={true} />
          </div>

          {/* Recommendations - Full width */}
          <div className="col-span-12 mt-6">
            <h2 className="text-xl font-bold text-[#22D3EE] mb-4">Recommendations</h2>
            <RecommendationsWidget />
          </div>
        </div>
      </div>
    </div>
  );
} 