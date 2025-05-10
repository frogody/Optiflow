'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LightBulbIcon, 
  SparklesIcon,
  ChevronRightIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  integrations: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  popularity: number; // 1-100 scale for sorting
  imageUrl: string;
}

interface FeatureDiscovery {
  id: string;
  title: string;
  description: string;
  linkUrl: string;
  linkText: string;
  imageUrl: string;
}

// Mock data for development - would be replaced with API data in production
const mockTemplates: WorkflowTemplate[] = [
  {
    id: 'tmpl-001',
    name: 'Lead Generation & Qualification',
    description: 'Automatically collect and qualify leads from multiple sources.',
    category: 'Marketing',
    integrations: ['Salesforce', 'HubSpot', 'LinkedIn'],
    difficulty: 'intermediate',
    popularity: 89,
    imageUrl: '/images/templates/lead-generation.png'
  },
  {
    id: 'tmpl-002',
    name: 'Customer Support Ticket Triage',
    description: 'Route support requests to the right team based on content analysis.',
    category: 'Customer Support',
    integrations: ['Zendesk', 'Intercom', 'Slack'],
    difficulty: 'beginner',
    popularity: 95,
    imageUrl: '/images/templates/support-triage.png'
  },
  {
    id: 'tmpl-003',
    name: 'Social Media Content Calendar',
    description: 'Schedule and publish content across multiple platforms.',
    category: 'Marketing',
    integrations: ['Buffer', 'Twitter', 'Instagram'],
    difficulty: 'beginner',
    popularity: 92,
    imageUrl: '/images/templates/social-calendar.png'
  }
];

const mockFeatures: FeatureDiscovery[] = [
  {
    id: 'feat-001',
    title: 'Voice Command Integration',
    description: 'Control your workflows using natural language with Jarvis.',
    linkUrl: '/voice-agent',
    linkText: 'Try voice commands',
    imageUrl: '/images/features/voice-commands.png'
  },
  {
    id: 'feat-002',
    title: 'Advanced Data Analytics',
    description: 'Gain insights from your workflow performance metrics.',
    linkUrl: '/analytics',
    linkText: 'Explore analytics',
    imageUrl: '/images/features/analytics.png'
  }
];

export default function RecommendationsWidget() {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [features, setFeatures] = useState<FeatureDiscovery[]>([]);
  const [activeTab, setActiveTab] = useState<'templates' | 'features'>('templates');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        // In a real implementation, this would be an API call with user data for personalization
        // const response = await fetch('/api/recommendations?userId=...');
        // const data = await response.json();
        
        // For now, use mock data with a simulated delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setTemplates(mockTemplates);
        setFeatures(mockFeatures);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchRecommendations();
  }, []);
  
  if (isLoading) {
    return <RecommendationsWidgetSkeleton />;
  }
  
  if (error) {
    return <RecommendationsWidgetError error={error} />;
  }
  
  return (
    <div className="recommendations-widget">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <SparklesIcon className="h-5 w-5 text-[#22D3EE] mr-2" />
          <h2 className="text-xl font-bold text-[#22D3EE]">Recommendations</h2>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-[#111111] border border-[#374151] rounded-md overflow-hidden">
          <button
            className={`py-1.5 px-3 text-sm ${
              activeTab === 'templates' 
                ? 'bg-[#1E293B] text-[#E5E7EB]' 
                : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#18181B]'
            } transition-colors`}
            onClick={() => setActiveTab('templates')}
          >
            Templates
          </button>
          <button
            className={`py-1.5 px-3 text-sm ${
              activeTab === 'features' 
                ? 'bg-[#1E293B] text-[#E5E7EB]' 
                : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#18181B]'
            } transition-colors`}
            onClick={() => setActiveTab('features')}
          >
            Discover Features
          </button>
        </div>
      </div>

      {activeTab === 'templates' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div 
                key={template.id} 
                className="bg-[#18181B] border border-[#374151] rounded-lg overflow-hidden hover:border-[#22D3EE] transition-colors"
              >
                <div className="h-32 bg-gradient-to-r from-[#0F172A] to-[#1E293B] relative flex items-center justify-center">
                  {/* In a real implementation, this would show actual images */}
                  <div className="absolute inset-0 flex items-center justify-center bg-[#111111]/50">
                    <LightBulbIcon className="h-12 w-12 text-[#22D3EE] opacity-70" />
                  </div>
                  <div className="absolute top-2 right-2 bg-[#111111]/80 text-[#9CA3AF] text-xs px-2 py-1 rounded">
                    {template.category}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-[#E5E7EB] font-medium mb-1">{template.name}</h3>
                  <p className="text-[#9CA3AF] text-sm mb-3">{template.description}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        template.difficulty === 'beginner' 
                          ? 'bg-[#10B981]/10 text-[#10B981]' 
                          : template.difficulty === 'intermediate'
                            ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                            : 'bg-[#EF4444]/10 text-[#EF4444]'
                      }`}>
                        {template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
                      </span>
                    </div>
                    
                    <Link 
                      href={`/workflow-editor/template/${template.id}`}
                      className="text-sm text-[#22D3EE] hover:text-[#06B6D4] inline-flex items-center transition-colors"
                    >
                      Use template
                      <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <Link 
              href="/workflow-editor/templates"
              className="text-sm text-[#22D3EE] hover:text-[#06B6D4] inline-flex items-center transition-colors"
            >
              Explore all templates
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="bg-[#18181B] border border-[#374151] rounded-lg overflow-hidden p-4 flex items-center hover:border-[#22D3EE] transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-[#1E293B] rounded-lg flex items-center justify-center mr-4">
                <SparklesIcon className="h-6 w-6 text-[#22D3EE]" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-[#E5E7EB] font-medium">{feature.title}</h3>
                <p className="text-[#9CA3AF] text-sm mb-2">{feature.description}</p>
                <Link 
                  href={feature.linkUrl}
                  className="text-sm text-[#22D3EE] hover:text-[#06B6D4] inline-flex items-center transition-colors"
                >
                  {feature.linkText}
                  <ChevronRightIcon className="h-3.5 w-3.5 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RecommendationsWidgetSkeleton() {
  return (
    <div className="recommendations-widget">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 w-40 bg-[#374151] rounded animate-pulse"></div>
        <div className="h-8 w-48 bg-[#374151] rounded animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-[#18181B] border border-[#374151] rounded-lg overflow-hidden animate-pulse">
            <div className="h-32 bg-[#1E293B]"></div>
            <div className="p-4">
              <div className="h-5 w-2/3 bg-[#374151] rounded mb-2"></div>
              <div className="h-4 w-full bg-[#374151] rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-[#374151] rounded mb-4"></div>
              <div className="flex justify-between">
                <div className="h-4 w-16 bg-[#374151] rounded"></div>
                <div className="h-4 w-24 bg-[#374151] rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecommendationsWidgetError({ error }: { error: string }) {
  return (
    <div className="bg-[#18181B] border border-[#F87171] rounded-lg p-5 shadow-lg text-center">
      <h3 className="text-[#F87171] font-medium mb-2">Error Loading Recommendations</h3>
      <p className="text-[#9CA3AF]">{error}</p>
      <button 
        className="mt-3 px-4 py-2 bg-[#18181B] border border-[#374151] rounded-md text-[#E5E7EB] hover:bg-[#1E293B] transition-colors"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  );
} 