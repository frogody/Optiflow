'use client';

import { 
  ArrowRightIcon, 
  CheckCircleIcon, 
  DocumentCheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  link: string;
  linkText: string;
}

interface OnboardingSectionProps {
  userName: string;
  onClose: () => void;
  className?: string;
}

export default function OnboardingSection({ userName, onClose, className = '' }: OnboardingSectionProps) {
  // In a real implementation, these would come from user data in an API
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'connect-app',
      title: 'Connect your first app',
      description: 'Integrate with one of your existing tools to start building workflows.',
      completed: false,
      link: '/connections',
      linkText: 'Browse integrations'
    },
    {
      id: 'create-workflow',
      title: 'Create your first workflow',
      description: 'Set up an automated process to streamline your operations.',
      completed: false,
      link: '/workflow-editor',
      linkText: 'Create workflow'
    },
    {
      id: 'try-voice',
      title: 'Try a voice command',
      description: 'Activate the Jarvis assistant and control Optiflow with your voice.',
      completed: false,
      link: '/voice-agent',
      linkText: 'Activate Jarvis'
    },
    {
      id: 'invite-team',
      title: 'Invite your team',
      description: 'Collaborate with team members to maximize productivity.',
      completed: false,
      link: '/settings/organization',
      linkText: 'Invite members'
    }
  ]);

  // Calculate completed steps
  const completedSteps = steps.filter(step => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  // Function to mark a step as completed
  const completeStep = (stepId: string) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
  };

  return (
    <div className={`bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-xl p-6 border border-[#334155] mb-6 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Welcome to Optiflow, {userName}!</h2>
          <p className="text-[#9CA3AF] mb-4">
            Let's set up your workspace and get you started with workflows. Here are a few steps to get started:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            <div className="bg-[#18181B] p-4 rounded-lg border border-[#374151]">
              <div className="bg-blue-500/20 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                <span className="text-blue-400 font-semibold">1</span>
              </div>
              <h3 className="text-[#E5E7EB] font-medium mb-1">Create your first workflow</h3>
              <p className="text-[#9CA3AF] text-sm">Start automating with a simple workflow</p>
            </div>
            
            <div className="bg-[#18181B] p-4 rounded-lg border border-[#374151]">
              <div className="bg-purple-500/20 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                <span className="text-purple-400 font-semibold">2</span>
              </div>
              <h3 className="text-[#E5E7EB] font-medium mb-1">Connect your tools</h3>
              <p className="text-[#9CA3AF] text-sm">Integrate with your favorite apps</p>
            </div>
            
            <div className="bg-[#18181B] p-4 rounded-lg border border-[#374151]">
              <div className="bg-green-500/20 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                <span className="text-green-400 font-semibold">3</span>
              </div>
              <h3 className="text-[#E5E7EB] font-medium mb-1">Try voice control</h3>
              <p className="text-[#9CA3AF] text-sm">Activate Jarvis voice assistant</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="text-[#9CA3AF] hover:text-[#E5E7EB] p-1"
          aria-label="Close onboarding section"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
} 