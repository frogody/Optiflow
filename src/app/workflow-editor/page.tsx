'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { workflowTemplates } from '@/lib/workflowTemplates';

// Import FlowEditor component dynamically to avoid hydration errors
// since ReactFlow uses browser APIs
const FlowEditor = dynamic(
  () => import('@/components/workflow/FlowEditor'),
  { ssr: false }
);

export default function WorkflowEditorPage() {
  const router = useRouter();
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(!selectedTemplate);
  
  const handleSaveWorkflow = (flow: any) => {
    console.log('Saving workflow:', flow);
    toast.success('Workflow saved successfully!');
    // In a real app, you would save this to your backend
  };

  const handleSelectTemplate = (template: any) => {
    setSelectedTemplate(template.template);
    setWorkflowName(template.name);
    setShowTemplateModal(false);
  };
  
  const handleStartBlank = () => {
    setSelectedTemplate({ nodes: [], edges: [] });
    setShowTemplateModal(false);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-dark-50">
      {/* Header */}
      <header className="bg-dark-100 border-b border-dark-200 py-3 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/workflows"
              className="text-white/70 hover:text-white transition-colors"
            >
              ← Back to Workflows
            </Link>
            <div className="border-l border-dark-200 h-6"></div>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none border-b border-transparent focus:border-primary px-1"
            />
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowTemplateModal(true)}
              className="text-white/70 hover:text-white text-sm px-3 py-1.5 transition-colors"
            >
              Templates
            </button>
            <button
              onClick={() => router.push('/workflows')}
              className="text-white/70 hover:text-white text-sm border border-dark-200 rounded-md px-3 py-1.5 hover:bg-dark-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => toast.success('Workflow published successfully!')}
              className="text-sm bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-md transition-colors"
            >
              Publish
            </button>
          </div>
        </div>
      </header>

      {/* Flow Editor */}
      <div className="flex-1">
        {!showTemplateModal && selectedTemplate && (
          <FlowEditor initialFlow={selectedTemplate} onSave={handleSaveWorkflow} />
        )}
      </div>

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-100 rounded-lg shadow-xl max-w-3xl w-full p-6 border border-dark-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-xl font-medium">Choose a Template</h2>
              <button
                onClick={handleStartBlank}
                className="text-white/70 hover:text-white text-sm"
              >
                Start Blank
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {workflowTemplates.map((template) => (
                <div 
                  key={template.id}
                  className="bg-dark-200 hover:bg-dark-300 transition-colors rounded-md p-4 cursor-pointer border border-dark-300"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">{template.icon}</span>
                    <h3 className="text-white font-medium">{template.name}</h3>
                  </div>
                  <p className="text-white/70 text-sm">{template.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 