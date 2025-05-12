'use client';

import { useState, useEffect } from 'react';

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';
// Disable cache to avoid static rendering issues
export const revalidate = 0;

import { useCallback, useState } from 'react';
import Link from 'next/link';

// Simple placeholder component instead of ReactFlow
export default function WorkflowEditor() {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  const [selectedTab, setSelectedTab] = useState('nodes');
  const [workflowName, setWorkflowName] = useState('New Workflow');
  const [workflowDescription, setWorkflowDescription] = useState('Workflow description');
  
  // Simple function to simulate workflow save
  const handleSaveWorkflow = useCallback(() => {
    console.log('Saving workflow...');
    alert('Workflow saved successfully!');
  }, []);
  
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
    <div className="min-h-screen bg-[#111827] text-white flex flex-col">
      {/* Header */}
      <header className="bg-[#1F2937] border-b border-[#374151] p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-[#F9FAFB]">{workflowName}</h1>
            <div className="h-5 w-5 rounded-full bg-green-500"></div>
            <span className="text-[#D1D5DB] text-sm">Last saved: Just now</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleSaveWorkflow}
              className="px-4 py-2 bg-[#3B82F6] text-white rounded-md hover:bg-[#2563EB] transition-colors"
            >
              Save
            </button>
            <Link
              href="/workflows"
              className="px-4 py-2 bg-[#1F2937] border border-[#4B5563] text-white rounded-md hover:bg-[#374151] transition-colors"
            >
              Back to Workflows
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#1F2937] border-r border-[#374151] p-4">
          <div className="mb-6">
            <h2 className="text-[#F9FAFB] font-semibold mb-2">Elements</h2>
            
            <div className="space-y-1">
              <button
                onClick={() => setSelectedTab('nodes')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  selectedTab === 'nodes' ? 'bg-[#3B82F6] text-white' : 'text-[#D1D5DB] hover:bg-[#374151]'
                }`}
              >
                Nodes
              </button>
              <button
                onClick={() => setSelectedTab('connections')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  selectedTab === 'connections' ? 'bg-[#3B82F6] text-white' : 'text-[#D1D5DB] hover:bg-[#374151]'
                }`}
              >
                Connections
              </button>
              <button
                onClick={() => setSelectedTab('templates')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  selectedTab === 'templates' ? 'bg-[#3B82F6] text-white' : 'text-[#D1D5DB] hover:bg-[#374151]'
                }`}
              >
                Templates
              </button>
            </div>
          </div>
          
          <div>
            <h2 className="text-[#F9FAFB] font-semibold mb-2">
              {selectedTab === 'nodes' ? 'Available Nodes' : 
               selectedTab === 'connections' ? 'Connections' : 'Templates'}
            </h2>
            
            {selectedTab === 'nodes' && (
              <div className="space-y-2">
                <div className="p-2 bg-[#374151] rounded-md hover:bg-[#4B5563] cursor-pointer transition-colors">
                  <h3 className="font-medium text-[#F9FAFB]">AI Agent</h3>
                  <p className="text-xs text-[#9CA3AF]">Add an AI agent to your workflow</p>
                </div>
                <div className="p-2 bg-[#374151] rounded-md hover:bg-[#4B5563] cursor-pointer transition-colors">
                  <h3 className="font-medium text-[#F9FAFB]">Conditional</h3>
                  <p className="text-xs text-[#9CA3AF]">Add a conditional branch</p>
                </div>
                <div className="p-2 bg-[#374151] rounded-md hover:bg-[#4B5563] cursor-pointer transition-colors">
                  <h3 className="font-medium text-[#F9FAFB]">Data Processor</h3>
                  <p className="text-xs text-[#9CA3AF]">Transform data formats</p>
                </div>
                <div className="p-2 bg-[#374151] rounded-md hover:bg-[#4B5563] cursor-pointer transition-colors">
                  <h3 className="font-medium text-[#F9FAFB]">Webhook</h3>
                  <p className="text-xs text-[#9CA3AF]">Trigger workflow from external source</p>
                </div>
              </div>
            )}
            
            {selectedTab === 'connections' && (
              <div className="space-y-2">
                <div className="p-2 bg-[#374151] rounded-md hover:bg-[#4B5563] cursor-pointer transition-colors">
                  <h3 className="font-medium text-[#F9FAFB]">Standard Connection</h3>
                  <p className="text-xs text-[#9CA3AF]">Connect nodes with a standard flow</p>
                </div>
                <div className="p-2 bg-[#374151] rounded-md hover:bg-[#4B5563] cursor-pointer transition-colors">
                  <h3 className="font-medium text-[#F9FAFB]">Conditional Connection</h3>
                  <p className="text-xs text-[#9CA3AF]">Connect nodes with conditions</p>
                </div>
              </div>
            )}
            
            {selectedTab === 'templates' && (
              <div className="space-y-2">
                <div className="p-2 bg-[#374151] rounded-md hover:bg-[#4B5563] cursor-pointer transition-colors">
                  <h3 className="font-medium text-[#F9FAFB]">Customer Support</h3>
                  <p className="text-xs text-[#9CA3AF]">Template for customer support automation</p>
                </div>
                <div className="p-2 bg-[#374151] rounded-md hover:bg-[#4B5563] cursor-pointer transition-colors">
                  <h3 className="font-medium text-[#F9FAFB]">Lead Generation</h3>
                  <p className="text-xs text-[#9CA3AF]">Template for lead generation flows</p>
                </div>
                <div className="p-2 bg-[#374151] rounded-md hover:bg-[#4B5563] cursor-pointer transition-colors">
                  <h3 className="font-medium text-[#F9FAFB]">Content Creation</h3>
                  <p className="text-xs text-[#9CA3AF]">Template for content creation automation</p>
                </div>
              </div>
            )}
          </div>
        </aside>
        
        {/* Canvas/Editor */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 relative bg-grid-pattern">
            {/* This would be the ReactFlow canvas in the full version */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8 rounded-lg bg-[#1F2937]/70 backdrop-blur-sm max-w-md">
                <h2 className="text-2xl font-bold mb-4">Workflow Editor</h2>
                <p className="mb-6 text-[#D1D5DB]">
                  Due to optimization for deployments, the interactive ReactFlow editor is temporarily replaced with this static version. Drag nodes from the sidebar to create your workflow.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-[#374151] rounded-md text-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm">Drag to add nodes</span>
                  </div>
                  <div className="p-3 bg-[#374151] rounded-md text-center">
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center mx-auto mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm">Connect nodes</span>
                  </div>
                </div>
                <button 
                  onClick={handleSaveWorkflow}
                  className="px-4 py-2 bg-[#3B82F6] text-white rounded-md hover:bg-[#2563EB] transition-colors"
                >
                  Save Workflow
                </button>
              </div>
            </div>
          </div>
          
          {/* Properties panel */}
          <div className="h-64 bg-[#1F2937] border-t border-[#374151] p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Workflow Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1">Workflow Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-[#374151] border border-[#4B5563] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1">Description</label>
                <textarea 
                  className="w-full px-3 py-2 bg-[#374151] border border-[#4B5563] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  value={workflowDescription}
                  onChange={(e) => setWorkflowDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}