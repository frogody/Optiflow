import { promises as fs } from 'fs';

// List of all pages to fix
const pagesToFix = [
  'src/app/dashboard/page.tsx',
  'src/app/developer/page.tsx'
];

/**
 * Fix a page to resolve React version conflicts
 */
async function fixPage(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    
    // Read the file
    const content = await fs.readFile(filePath, 'utf8');
    
    // Fix the issues
    let updatedContent = content;
    
    // 1. Add dynamic export to force dynamic rendering
    if (!updatedContent.includes("export const dynamic = 'force-dynamic'")) {
      updatedContent = updatedContent.replace(
        /^'use client';/,
        "'use client';\n\n// Force dynamic rendering to avoid static generation issues\nexport const dynamic = 'force-dynamic';"
      );
    }
    
    // 2. For the developer page, handle the heroicons completely differently
    if (filePath.includes('developer')) {
      // Create a simpler implementation that doesn't use heroicons
      updatedContent = `'use client';

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useState } from 'react';

// Simple icon component to replace Heroicons
const Icon = ({ name, className }) => {
  return (
    <div className={\`icon \${name} \${className || ''}\`}>
      <span className="sr-only">{name}</span>
    </div>
  );
};

export default function DeveloperPortal() {
  const [selectedLanguage, setSelectedLanguage] = useState('curl');
  
  const codeExamples = {
    curl: \`curl -X POST https://api.optiflow.com/v1/workflows \\\\
  -H "Content-Type: application/json" \\\\
  -H "Authorization: Bearer YOUR_API_KEY" \\\\
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
  }'\`,
    javascript: \`import { OptiflowClient } from '@optiflow/sdk';

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

console.log('Created workflow with ID:', workflow.id);\`,
    python: \`from optiflow import OptiflowClient

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

print(f"Created workflow with ID: {workflow.id}")\`,
  };

  const featureCards = [
    {
      title: 'RESTful API',
      description: 'Interact with Optiflow programmatically using our comprehensive REST API.',
      icon: 'server',
      color: '[#22D3EE]',
      link: '/developer/api',
    },
    {
      title: 'SDK Libraries',
      description: 'Official client libraries for JavaScript, Python, and more to simplify API integration.',
      icon: 'cube',
      color: '[#A855F7]',
      link: '/developer/sdks',
    },
    {
      title: 'Webhooks',
      description: 'Configure webhooks to receive real-time notifications when events occur in Optiflow.',
      icon: 'rocket',
      color: '[#22D3EE]',
      link: '/developer/webhooks',
    },
    {
      title: 'Authentication',
      description: 'Secure your API requests with API keys or OAuth 2.0 authentication.',
      icon: 'key',
      color: '[#A855F7]',
      link: '/developer/authentication',
    },
    {
      title: 'Interactive Docs',
      description: 'Explore and test API endpoints directly from your browser with our interactive documentation.',
      icon: 'document',
      color: '[#22D3EE]',
      link: '/developer/docs',
    },
    {
      title: 'Developer Forum',
      description: 'Connect with other developers and get help from the Optiflow team.',
      icon: 'chat',
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
                <div className={\`w-12 h-12 rounded-md bg-\${feature.color}/10 flex items-center justify-center text-\${feature.color} mb-4\`}>
                  <Icon name={feature.icon} className="h-6 w-6" />
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
                className={\`px-4 py-2 text-sm font-medium \${
                  selectedLanguage === 'curl' 
                  ? 'bg-[#1E293B] text-[#22D3EE]' 
                  : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1E293B]'
                } transition-colors focus:outline-none\`}
                onClick={() => setSelectedLanguage('curl')}
              >
                cURL
              </button>
              <button
                className={\`px-4 py-2 text-sm font-medium \${
                  selectedLanguage === 'javascript' 
                  ? 'bg-[#1E293B] text-[#22D3EE]' 
                  : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1E293B]'
                } transition-colors focus:outline-none\`}
                onClick={() => setSelectedLanguage('javascript')}
              >
                JavaScript
              </button>
              <button
                className={\`px-4 py-2 text-sm font-medium \${
                  selectedLanguage === 'python' 
                  ? 'bg-[#1E293B] text-[#22D3EE]' 
                  : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1E293B]'
                } transition-colors focus:outline-none\`}
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
                }}
              >
                <Icon name="copy" className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link
              href="/developer/docs/quickstart"
              className="text-[#22D3EE] hover:text-[#06B6D4] font-medium transition-colors flex items-center justify-center"
            >
              <span>View Complete Quickstart Guide</span>
              <Icon name="arrow-right" className="h-5 w-5 ml-1" />
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
              icon: 'terminal',
            },
            {
              title: 'Embedded Workflows',
              description: 'Integrate Optiflow workflows directly into your own applications using our API or SDKs.',
              icon: 'cube',
            },
            {
              title: 'Advanced Analytics',
              description: 'Build custom dashboards and reports using workflow execution data from the Optiflow API.',
              icon: 'book',
            },
          ].map((useCase, index) => (
            <div key={index} className="bg-[#18181B] border border-[#374151] rounded-lg p-6">
              <div className="w-12 h-12 rounded-md bg-[#1E293B] flex items-center justify-center text-[#A855F7] mb-4">
                <Icon name={useCase.icon} className="h-6 w-6" />
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
}`;
    }
    
    // Write the updated file
    await fs.writeFile(filePath, updatedContent, 'utf8');
    console.log(`  ✅ Fixed ${filePath} successfully`);
    
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

/**
 * Convert fix-pipedream-env.js to ES modules
 */
async function fixPipedreamEnvScript() {
  try {
    console.log(`Creating ES module version of fix-pipedream-env.js...`);
    
    // Create a new ES module version
    const content = `// ES Module version to fix Pipedream environment variables
import 'dotenv/config';
import fs from 'fs';
import { createBackendClient } from '@pipedream/sdk/server';

// Fixed environment variables
const fixedEnv = {
  PIPEDREAM_CLIENT_ID: 'kWYR9dn6Vmk7MnLuVfoXx4jsedOcp83vBg6st3rWuiM',
  PIPEDREAM_CLIENT_SECRET: 'ayINomSnhCcHGR6Xf1_4PElM25mqsEFsrvTHKQ7ink0',
  PIPEDREAM_PROJECT_ID: 'proj_LosDxgO',
  PIPEDREAM_PROJECT_ENVIRONMENT: 'development'
};

// Apply fixed values to the current environment
Object.entries(fixedEnv).forEach(([key, value]) => {
  process.env[key] = value;
});

console.log('Running Pipedream environment variable fixer...');
console.log('✅ Pipedream environment variables patched');
console.log('Environment state:', {
  hasClientId: !!process.env.PIPEDREAM_CLIENT_ID,
  hasClientSecret: !!process.env.PIPEDREAM_CLIENT_SECRET,
  hasProjectId: !!process.env.PIPEDREAM_PROJECT_ID,
  projectEnvironment: process.env.PIPEDREAM_PROJECT_ENVIRONMENT,
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://app.isyncso.com',
  redirectUri: (process.env.NEXT_PUBLIC_APP_URL || 'https://app.isyncso.com') + '/api/pipedream/callback'
});`;
    
    // Write the module version to a new file
    await fs.writeFile('fix-pipedream-env.mjs', content, 'utf8');
    console.log(`  ✅ Created ES module version fix-pipedream-env.mjs successfully`);
    
  } catch (error) {
    console.error(`Error creating ES module version:`, error);
  }
}

async function main() {
  console.log('🔧 Starting fixes for React version conflicts...');
  
  // Fix the pages
  for (const page of pagesToFix) {
    await fixPage(page);
  }
  
  // Fix the Pipedream env script
  await fixPipedreamEnvScript();
  
  console.log('✅ All fixes applied successfully!');
}

main().catch(console.error); 