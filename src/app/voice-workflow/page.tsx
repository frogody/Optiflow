'use client';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

import { useRouter } from 'next/navigation';
import React from 'react';

import ConversationalWorkflowGenerator from '@/components/ConversationalWorkflowGenerator';

export default function VoiceWorkflowPage(): JSX.Element {
  const router = useRouter();

  const handleWorkflowGenerated = (workflow: any) => {
    // Store the workflow in sessionStorage
    sessionStorage.setItem('generatedWorkflow', JSON.stringify(workflow));
    // Navigate to the workflow editor
    router.push('/workflow-editor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4]">
          Voice Workflow Builder
        </h1>
        
        <div className="bg-white/5 rounded-2xl p-8 backdrop-blur-xl border border-white/10">
          <ConversationalWorkflowGenerator
            onWorkflowGenerated={handleWorkflowGenerated}
            agentId={process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || 'i3gU7j7TnkhSqx3MNkhu'}
            initialPrompt="Tell me what workflow you want to build"
            modelParams={{ model: 'gemini-1.5-flash'     }}
          />
        </div>
      </div>
    </div>
  );
} 