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
}

export default function OnboardingSection({ userName, onClose }: OnboardingSectionProps) {
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
    <div className="bg-gradient-to-r from-[#0F172A] to-[#111827] border border-[#374151] rounded-lg p-6 mb-8 relative">
      <button 
        className="absolute top-4 right-4 text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors"
        onClick={onClose}
        aria-label="Close onboarding guide"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>

      <div className="flex items-start mb-6">
        <DocumentCheckIcon className="h-10 w-10 text-[#22D3EE] mr-4" />
        <div>
          <h2 className="text-2xl font-bold text-[#E5E7EB]">
            Welcome, {userName}!
          </h2>
          <p className="text-[#9CA3AF] mt-1">
            Let's get you started with Optiflow. Complete these steps to set up your automation workflow.
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-[#9CA3AF] mb-2">
          <span>Your progress</span>
          <span>{completedSteps} of {steps.length} completed</span>
        </div>
        <div className="w-full h-2 bg-[#1E293B] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#22D3EE] to-[#06B6D4] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Steps */}
      <div className="grid gap-4">
        {steps.map((step) => (
          <div 
            key={step.id}
            className={`border ${
              step.completed ? 'border-[#10B981] bg-[#10B981]/5' : 'border-[#374151] bg-[#18181B]'
            } rounded-lg p-4 transition-colors`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                {step.completed ? (
                  <CheckCircleIcon className="h-6 w-6 text-[#10B981]" />
                ) : (
                  <div className="h-6 w-6 rounded-full border-2 border-[#9CA3AF] flex items-center justify-center text-[#9CA3AF] text-xs">
                    {steps.findIndex(s => s.id === step.id) + 1}
                  </div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`font-medium ${step.completed ? 'text-[#10B981]' : 'text-[#E5E7EB]'}`}>
                    {step.title}
                  </h3>
                  {step.completed && (
                    <span className="text-xs text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">
                      Completed
                    </span>
                  )}
                </div>
                <p className="text-[#9CA3AF] text-sm mt-1">{step.description}</p>
                {!step.completed && (
                  <Link 
                    href={step.link}
                    className="inline-flex items-center text-[#22D3EE] hover:text-[#06B6D4] text-sm mt-3 transition-colors"
                    onClick={() => completeStep(step.id)}
                  >
                    {step.linkText}
                    <ArrowRightIcon className="h-3.5 w-3.5 ml-1" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Help resources */}
      <div className="mt-6 bg-[#18181B] border border-[#374151] rounded-lg p-4">
        <h3 className="text-[#E5E7EB] font-medium mb-2">Need help getting started?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <Link href="/help/getting-started" className="text-[#22D3EE] hover:text-[#06B6D4] transition-colors">
            → Getting started guide
          </Link>
          <Link href="/help/community" className="text-[#22D3EE] hover:text-[#06B6D4] transition-colors">
            → Community forum
          </Link>
          <Link href="/help/status" className="text-[#22D3EE] hover:text-[#06B6D4] transition-colors">
            → Video tutorials
          </Link>
          <Link href="/help/contact-support" className="text-[#22D3EE] hover:text-[#06B6D4] transition-colors">
            → Contact support
          </Link>
        </div>
      </div>
    </div>
  );
} 