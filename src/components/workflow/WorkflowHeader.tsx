'use client';

import { useRouter } from 'next/navigation';
import { HiOutlineMicrophone, HiOutlineSave, HiOutlineCog } from 'react-icons/hi';

interface WorkflowHeaderProps {
  onOpenSettings: () => void;
  onSaveWorkflow?: () => void;
  workflowName?: string;
}

export default function WorkflowHeader({ 
  onOpenSettings, 
  onSaveWorkflow,
  workflowName = "Untitled Workflow"
}: WorkflowHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-r from-dark-800 to-dark-900 border-b border-dark-700 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-white">{workflowName}</h1>
        <div className="h-6 w-px bg-dark-600" />
        <button
          onClick={() => router.push('/voice-workflow')}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white bg-dark-700 hover:bg-dark-600 rounded-md transition-all duration-200"
        >
          <HiOutlineMicrophone className="h-4 w-4" />
          Voice Builder
        </button>
      </div>
      <div className="flex items-center space-x-3">
        <button
          className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-dark-700 transition-colors"
          onClick={onOpenSettings}
          title="Workflow Settings"
        >
          <HiOutlineCog className="h-5 w-5" />
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md transition-colors"
          onClick={onSaveWorkflow}
        >
          <HiOutlineSave className="h-4 w-4" />
          Save
        </button>
      </div>
    </div>
  );
} 