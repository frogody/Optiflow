'use client';

import { 
  Cog6ToothIcon, 
  DocumentTextIcon, 
  MicrophoneIcon, 
  PlusCircleIcon,
  PuzzlePieceIcon,
  RocketLaunchIcon,
  Squares2X2Icon
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

const QuickActionCard = ({ action }: { action: QuickAction }) => {
  return (
    <Link
      href={action.link}
      className="flex flex-col items-center justify-center bg-[#18181B] border border-[#2A2A35] rounded-lg p-4 hover:border-[#22D3EE] transition-all duration-200 hover:shadow-md group h-full"
    >
      <div 
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mb-2"
        style={{ backgroundColor: `${action.color}15` }}
      >
        <action.icon 
          className="h-4 w-4"
          style={{ color: action.color }}
        />
      </div>
      <div className="text-center">
        <h3 className="text-[#E5E7EB] font-medium text-sm mb-1">{action.title}</h3>
        <p className="text-[#9CA3AF] text-xs leading-tight max-w-[100px] mx-auto line-clamp-2">{action.description}</p>
      </div>
    </Link>
  );
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
      link: '/templates',
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
    <div className="bg-[#18181B] border border-[#2A2A35] rounded-lg p-5">
      <div className="flex items-start mb-4">
        <Squares2X2Icon className="h-5 w-5 text-[#22D3EE] mr-2" />
        <h3 className="text-[#E5E7EB] font-medium">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <QuickActionCard key={action.id} action={action} />
        ))}
      </div>
    </div>
  );
} 