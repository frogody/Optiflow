'use client';

import Link from 'next/link';
import React from 'react';

export default function EmergencyLanding() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Welcome to Optiflow
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          The AI-powered workflow automation platform for optimizing your business processes.
          We're currently in emergency recovery mode. Full features coming back soon!
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link 
            href="/features" 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            View Features
          </Link>
          <Link 
            href="/signup" 
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <FeatureCard 
          title="Workflow Automation" 
          description="Create powerful automated workflows with our visual editor. Connect your apps and services with ease."
          icon="🔄"
        />
        <FeatureCard 
          title="AI Integration" 
          description="Integrate AI models from OpenAI and Anthropic to enhance your automation with intelligence."
          icon="🧠"
        />
        <FeatureCard 
          title="Voice Interface" 
          description="Control your workflows with natural language using our voice interface powered by advanced speech technologies."
          icon="🎤"
        />
      </div>

      <div className="bg-gray-800 rounded-xl p-8 mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Explore Our Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SolutionCard 
            title="Optiflow Core" 
            description="Our flagship workflow automation platform with visual editor and 100+ integrations."
          />
          <SolutionCard 
            title="AI Factory" 
            description="Build and deploy AI-powered solutions without coding using our no-code AI platform."
          />
          <SolutionCard 
            title="Voice Workflows" 
            description="Create voice-controlled automations for hands-free operation of your systems."
          />
          <SolutionCard 
            title="Enterprise Solutions" 
            description="Custom workflow automation solutions for large organizations with complex needs."
          />
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Business?</h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Join thousands of businesses that are using Optiflow to automate their workflows and optimize operations.
        </p>
        <Link 
          href="/signup" 
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium text-lg hover:opacity-90 transition-opacity"
        >
          Start Your Free Trial
        </Link>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

function SolutionCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="border border-gray-700 p-6 rounded-lg hover:border-blue-500 transition-colors">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
} 