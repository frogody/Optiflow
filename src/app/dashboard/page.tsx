'use client';

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';
// Disable cache to avoid static rendering issues
export const revalidate = 0;

import { useEffect, useState } from 'react';

import ActivityFeedWidget from '@/components/dashboard/ActivityFeedWidget';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import KpiWidget from '@/components/dashboard/KpiWidget';
import OnboardingSection from '@/components/dashboard/OnboardingSection';
import QuickActionsWidget from '@/components/dashboard/QuickActionsWidget';
import RecommendationsWidget from '@/components/dashboard/RecommendationsWidget';
import WorkflowsWidget from '@/components/dashboard/WorkflowsWidget';

// All imported components are used in the UI (dashboard widgets, onboarding, and header).

export default function DashboardPage() {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    isNewUser: true,
    // This would normally come from an API
  });

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
    <div className="bg-[#111111] min-h-screen">
      {/* Dashboard Header */}
      <DashboardHeader 
        userName={user.name}
        userEmail={user.email}
        notificationCount={3}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E5E7EB]">Dashboard</h1>
          <p className="text-[#9CA3AF] mt-1">Welcome back, {user.name.split(' ')[0]}. Here's an overview of your workflow activity.</p>
        </div>

        {/* Onboarding section for new users */}
        {showOnboarding && user.isNewUser && (
          <OnboardingSection 
            userName={user.name.split(' ')[0]} 
            onClose={handleDismissOnboarding} 
          />
        )}

        {/* Main grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* KPI Metrics section - spans 2 columns */}
          <div className="lg:col-span-2">
            <KpiWidget />
          </div>

          {/* Quick Actions - spans 1 column */}
          <div className="lg:col-span-1">
            <QuickActionsWidget />
          </div>

          {/* Activity Feed - spans 2 columns */}
          <div className="lg:col-span-2">
            <ActivityFeedWidget />
          </div>

          {/* Workflows Widget - spans 3 columns (full width) */}
          <div className="lg:col-span-3 mt-4">
            <WorkflowsWidget showFavorites={true} />
          </div>

          {/* Recommendations - spans 3 columns (full width) */}
          <div className="lg:col-span-3 mt-4">
            <RecommendationsWidget />
          </div>
        </div>
      </div>
    </div>
  );
} 