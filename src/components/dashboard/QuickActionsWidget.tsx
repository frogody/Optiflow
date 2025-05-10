'use client';

import { 
  Cog6ToothIcon, 
  DocumentTextIcon, 
  MicrophoneIcon, 
  PlusCircleIcon,
  PuzzlePieceIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  link: string;
  color: string;
}

export default function QuickActionsWidget() {
  // Quick actions
  const quickActions: QuickAction[] = [
    {
      id: 'create-workflow',
      title: 'Create Workflow',
      description: 'Build a new automation workflow',
      icon: PlusCircleIcon,
      link: '/workflow-editor',
      color: '#22D3EE'
    },
    {
      id: 'connect-app',
      title: 'Connect App',
      description: 'Add a new integration',
      icon: PuzzlePieceIcon,
      link: '/connections',
      color: '#10B981'
    },
    {
      id: 'voice-agent',
      title: 'Activate Jarvis',
      description: 'Control with voice commands',
      icon: MicrophoneIcon,
      link: '/voice-agent',
      color: '#F59E0B'
    },
    {
      id: 'explore-templates',
      title: 'Explore Templates',
      description: 'Browse pre-built workflows',
      icon: DocumentTextIcon,
      link: '/workflow-editor/templates',
      color: '#8B5CF6'
    },
    {
      id: 'deploy-workflow',
      title: 'Deploy Workflow',
      description: 'Publish to production',
      icon: RocketLaunchIcon,
      link: '/workflows/deploy',
      color: '#EC4899'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Manage account preferences',
      icon: Cog6ToothIcon,
      link: '/settings',
      color: '#9CA3AF'
    }
  ];

  return (
    <div className="quick-actions-widget">
      <h2 className="text-xl font-bold text-[#22D3EE] mb-4">Quick Actions</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.id}
            href={action.link}
            className="bg-[#18181B] border border-[#374151] rounded-lg p-4 hover:border-[#22D3EE] transition-colors group"
          >
            <div className="flex items-start">
              <div 
                className="flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center mr-3"
                style={{ backgroundColor: `${action.color}15` }}
              >
                <action.icon 
                  className="h-6 w-6 transition-transform group-hover:scale-110 duration-200"
                  style={{ color: action.color }}
                />
              </div>
              <div>
                <h3 className="text-[#E5E7EB] font-medium">{action.title}</h3>
                <p className="text-[#9CA3AF] text-xs">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 