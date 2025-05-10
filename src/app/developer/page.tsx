'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CodeBracketIcon,
  DocumentTextIcon,
  RocketLaunchIcon,
  KeyIcon,
  CubeIcon,
  ServerIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';

export default function DeveloperPortal() {
  const [selectedLanguage, setSelectedLanguage] = useState('curl');
  
  const codeExamples = {
    curl: `curl -X POST https://api.optiflow.com/v1/workflows \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "name": "My API Workflow",
    "description": "Created via API",
    "nodes": [
      {
        "id": "trigger",
        "type": "webhook",
        "position": { "x": 0, "y": 0 }
      },
      {
        "id": "action",
        "type": "email",
        "position": { "x": 250, "y": 0 },
        "data": {
          "to": "{{data.email}}",
          "subject": "Hello from Optiflow API",
          "body": "This email was sent by a workflow created via API."
        }
      }
    ],
    "edges": [
      {
        "source": "trigger",
        "target": "action"
      }
    ]
  }'`,
    javascript: `import { OptiflowClient } from '@optiflow/sdk';

const client = new OptiflowClient({
  apiKey: 'YOUR_API_KEY'
});

const workflow = await client.workflows.create({
  name: 'My API Workflow',
  description: 'Created via API',
  nodes: [
    {
      id: 'trigger',
      type: 'webhook',
      position: { x: 0, y: 0 }
    },
    {
      id: 'action',
      type: 'email',
      position: { x: 250, y: 0 },
      data: {
        to: '{{data.email}}',
        subject: 'Hello from Optiflow API',
        body: 'This email was sent by a workflow created via API.'
      }
    }
  ],
  edges: [
    {
      source: 'trigger',
      target: 'action'
    }
  ]
});

console.log('Created workflow with ID:', workflow.id);`,
    python: `from optiflow import OptiflowClient

client = OptiflowClient(api_key="YOUR_API_KEY")

workflow = client.workflows.create(
    name="My API Workflow",
    description="Created via API",
    nodes=[
        {
            "id": "trigger",
            "type": "webhook",
            "position": {"x": 0, "y": 0}
        },
        {
            "id": "action",
            "type": "email",
            "position": {"x": 250, "y": 0},
            "data": {
                "to": "{{data.email}}",
                "subject": "Hello from Optiflow API",
                "body": "This email was sent by a workflow created via API."
            }
        }
    ],
    edges=[
        {
            "source": "trigger",
            "target": "action"
        }
    ]
)

print(f"Created workflow with ID: {workflow.id}")`,
  };

  const featureCards = [
    {
      title: 'RESTful API',
      description: 'Interact with Optiflow programmatically using our comprehensive REST API.',
      icon: ServerIcon,
      color: '[#22D3EE]',
      link: '/developer/api',
    },
    {
      title: 'SDK Libraries',
      description: 'Official client libraries for JavaScript, Python, and more to simplify API integration.',
      icon: CubeIcon,
      color: '[#A855F7]',
      link: '/developer/sdks',
    },
    {
      title: 'Webhooks',
      description: 'Configure webhooks to receive real-time notifications when events occur in Optiflow.',
      icon: RocketLaunchIcon,
      color: '[#22D3EE]',
      link: '/developer/webhooks',
    },
    {
      title: 'Authentication',
      description: 'Secure your API requests with API keys or OAuth 2.0 authentication.',
      icon: KeyIcon,
      color: '[#A855F7]',
      link: '/developer/authentication',
    },
    {
      title: 'Interactive Docs',
      description: 'Explore and test API endpoints directly from your browser with our interactive documentation.',
      icon: DocumentTextIcon,
      color: '[#22D3EE]',
      link: '/developer/docs',
    },
    {
      title: 'Developer Forum',
      description: 'Connect with other developers and get help from the Optiflow team.',
      icon: ChatBubbleLeftRightIcon,
      color: '[#A855F7]',
      link: '/developer/community',
    },
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-[#E5E7EB]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#22D3EE] mb-6">
              Optiflow Developer Portal
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-[#9CA3AF]">
              Build integrations and extensions with the Optiflow API. Programmatically create and manage workflows, connect services, and more.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
              <Link
                href="/developer/docs"
                className="px-6 py-3 bg-[#22D3EE] text-[#111111] font-bold rounded-md hover:bg-[#06B6D4] transition-colors"
              >
                API Documentation
              </Link>
              <Link
                href="/developer/signup"
                className="px-6 py-3 bg-[#1E293B] text-[#E5E7EB] font-medium rounded-md hover:bg-[#2D3748] transition-colors border border-[#374151]"
              >
                Get API Key
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background pattern */}
        <div className="absolute top-0 right-0 -mt-20 opacity-10">
          <svg width="404" height="384" fill="none" viewBox="0 0 404 384">
            <defs>
              <pattern id="de316486-4a29-4312-bdfc-fbce2132a2c1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" className="text-[#22D3EE]" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="384" fill="url(#de316486-4a29-4312-bdfc-fbce2132a2c1)" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 opacity-10">
          <svg width="404" height="384" fill="none" viewBox="0 0 404 384">
            <defs>
              <pattern id="de316486-4a29-4312-bdfc-fbce2132a2c2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" className="text-[#A855F7]" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="384" fill="url(#de316486-4a29-4312-bdfc-fbce2132a2c2)" />
          </svg>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-[#22D3EE]">
          Build with Optiflow
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureCards.map((feature) => (
            <Link
              key={feature.title}
              href={feature.link}
              className="flex flex-col bg-[#18181B] border border-[#374151] rounded-lg overflow-hidden transition-all hover:shadow-lg hover:shadow-[#22D3EE]/20 hover:border-[#22D3EE]/30"
            >
              <div className="p-6">
                <div className={`w-12 h-12 rounded-md bg-${feature.color}/10 flex items-center justify-center text-${feature.color} mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-[#E5E7EB] mb-2">{feature.title}</h3>
                <p className="text-[#9CA3AF]">{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Code Example */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-[#18181B] border-y border-[#374151]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-[#22D3EE]">
            Get Started in Minutes
          </h2>
          
          <div className="bg-[#111111] rounded-lg overflow-hidden border border-[#374151]">
            <div className="flex border-b border-[#374151]">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  selectedLanguage === 'curl' 
                  ? 'bg-[#1E293B] text-[#22D3EE]' 
                  : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1E293B]'
                } transition-colors focus:outline-none`}
                onClick={() => setSelectedLanguage('curl')}
              >
                cURL
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  selectedLanguage === 'javascript' 
                  ? 'bg-[#1E293B] text-[#22D3EE]' 
                  : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1E293B]'
                } transition-colors focus:outline-none`}
                onClick={() => setSelectedLanguage('javascript')}
              >
                JavaScript
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  selectedLanguage === 'python' 
                  ? 'bg-[#1E293B] text-[#22D3EE]' 
                  : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1E293B]'
                } transition-colors focus:outline-none`}
                onClick={() => setSelectedLanguage('python')}
              >
                Python
              </button>
            </div>
            <div className="p-4 relative">
              <pre className="text-[#E5E7EB] text-sm overflow-x-auto font-mono">
                <code>{codeExamples[selectedLanguage]}</code>
              </pre>
              <button
                className="absolute top-4 right-4 p-2 text-[#9CA3AF] hover:text-[#E5E7EB] focus:outline-none bg-[#1E293B] rounded"
                title="Copy to clipboard"
                onClick={() => {
                  navigator.clipboard.writeText(codeExamples[selectedLanguage]);
                  // Add a toast notification here if desired
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                  <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link
              href="/developer/docs/quickstart"
              className="text-[#22D3EE] hover:text-[#06B6D4] font-medium transition-colors flex items-center justify-center"
            >
              <span>View Complete Quickstart Guide</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-[#22D3EE]">
          What You Can Build
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'Custom Integrations',
              description: 'Connect Optiflow to your in-house applications or services not available through our pre-built integrations.',
              icon: CommandLineIcon,
            },
            {
              title: 'Embedded Workflows',
              description: 'Integrate Optiflow workflows directly into your own applications using our API or SDKs.',
              icon: CubeIcon,
            },
            {
              title: 'Advanced Analytics',
              description: 'Build custom dashboards and reports using workflow execution data from the Optiflow API.',
              icon: BookOpenIcon,
            },
          ].map((useCase, index) => (
            <div key={index} className="bg-[#18181B] border border-[#374151] rounded-lg p-6">
              <div className="w-12 h-12 rounded-md bg-[#1E293B] flex items-center justify-center text-[#A855F7] mb-4">
                <useCase.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-[#E5E7EB] mb-2">{useCase.title}</h3>
              <p className="text-[#9CA3AF]">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-[#134e4a] to-[#1e1b4b] rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-12 md:py-16 md:px-12 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-4">Ready to get started?</h2>
            <p className="text-lg text-[#D1D5DB] max-w-2xl mx-auto mb-8">
              Create a developer account now to get your API keys and start building with Optiflow.
            </p>
            <Link
              href="/developer/signup"
              className="inline-block px-6 py-3 bg-[#22D3EE] text-[#111111] font-bold rounded-md hover:bg-[#06B6D4] transition-colors"
            >
              Sign Up for Developer Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 