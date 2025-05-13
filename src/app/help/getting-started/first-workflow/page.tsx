'use client';

import { useState } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookmarkIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

export default function FirstWorkflowTutorial() {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Define the tutorial steps
  const totalSteps = 5;
  
  // Progress calculation
  const progress = Math.round((currentStep / totalSteps) * 100);
  
  // Related articles
  const relatedArticles = [
    {
      title: 'Understanding Workflow Nodes',
      href: '/help/workflows/nodes',
    },
    {
      title: 'Workflow Triggers Explained',
      href: '/help/workflows/triggers',
    },
    {
      title: 'Testing and Debugging Workflows',
      href: '/help/workflows/debugging',
    },
  ];
  
  // Helper function to navigate steps
  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
      // Scroll to top when changing steps
      window.scrollTo(0, 0);
    }
  };
  
  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold text-[#E5E7EB] mb-4">Step 1: Access the Workflow Editor</h2>
            
            <div className="mb-6">
              <p className="text-[#9CA3AF] mb-4">
                To create your first workflow, you'll need to access the Workflow Editor from your Optiflow dashboard.
              </p>
              
              <ol className="list-decimal pl-5 space-y-4 text-[#E5E7EB]">
                <li>
                  <p>Sign in to your Optiflow account at <Link href="https://app.optiflow.com/login" target="_blank" className="text-[#22D3EE] hover:underline">app.optiflow.com</Link></p>
                </li>
                <li>
                  <p>From the main dashboard, click on the "Workflows" item in the left sidebar</p>
                </li>
                <li>
                  <p>Click the "+ New Workflow" button in the top-right corner of the workflows page</p>
                </li>
              </ol>
            </div>
            
            <div className="relative mb-6 rounded-lg overflow-hidden border border-[#374151]">
              <div className="aspect-[16/9] relative">
                <Image
                  src="/images/help/workflow-editor-access.png"
                  alt="Accessing the Workflow Editor"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60 backdrop-blur-sm">
                <p className="text-sm text-white">The Optiflow dashboard with the Workflows section highlighted</p>
              </div>
            </div>
            
            <div className="bg-[#1E293B] border border-[#374151] rounded-lg p-4 flex items-start mb-6">
              <InformationCircleIcon className="h-6 w-6 text-[#22D3EE] flex-shrink-0 mt-0.5 mr-3" />
              <div>
                <h4 className="text-lg font-medium text-[#E5E7EB] mb-1">Pro Tip</h4>
                <p className="text-sm text-[#9CA3AF]">
                  You can also create a new workflow directly from your dashboard by clicking the "Quick Actions" button and selecting "Create Workflow."
                </p>
              </div>
            </div>
            
            <p className="text-[#9CA3AF]">
              After completing these steps, you'll be taken to the workflow editor where you can start building your first automation workflow.
            </p>
          </div>
        );
      
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold text-[#E5E7EB] mb-4">Step 2: Name Your Workflow</h2>
            
            <div className="mb-6">
              <p className="text-[#9CA3AF] mb-4">
                Every workflow needs a clear, descriptive name that helps you identify its purpose.
              </p>
              
              <ol className="list-decimal pl-5 space-y-4 text-[#E5E7EB]">
                <li>
                  <p>Click on the default name "Untitled Workflow" at the top of the editor</p>
                </li>
                <li>
                  <p>Enter a descriptive name for your workflow (e.g., "Daily Email Summary," "Slack Notification Workflow," etc.)</p>
                </li>
                <li>
                  <p>Press Enter or click outside the input field to save the name</p>
                </li>
              </ol>
            </div>
            
            <div className="relative mb-6 rounded-lg overflow-hidden border border-[#374151]">
              <div className="aspect-[16/9] relative">
                <Image
                  src="/images/help/workflow-naming.png"
                  alt="Naming your workflow"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60 backdrop-blur-sm">
                <p className="text-sm text-white">Editing the workflow name in the editor</p>
              </div>
            </div>
            
            <div className="bg-[#1E293B] border border-[#374151] rounded-lg p-4 flex items-start mb-6">
              <ExclamationTriangleIcon className="h-6 w-6 text-[#F59E0B] flex-shrink-0 mt-0.5 mr-3" />
              <div>
                <h4 className="text-lg font-medium text-[#E5E7EB] mb-1">Important</h4>
                <p className="text-sm text-[#9CA3AF]">
                  Choose a name that clearly describes what the workflow does. This will help you and your team members identify its purpose later, especially as you build more workflows.
                </p>
              </div>
            </div>
            
            <p className="text-[#9CA3AF]">
              You can always rename your workflow later by clicking on its name in the editor or from the workflows list.
            </p>
          </div>
        );
      
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold text-[#E5E7EB] mb-4">Step 3: Add a Trigger</h2>
            
            <div className="mb-6">
              <p className="text-[#9CA3AF] mb-4">
                Every workflow starts with a trigger - the event that initiates your workflow. Let's add one now.
              </p>
              
              <ol className="list-decimal pl-5 space-y-4 text-[#E5E7EB]">
                <li>
                  <p>From the left sidebar of the workflow editor, locate the "Triggers" section</p>
                </li>
                <li>
                  <p>Browse through available triggers or use the search bar to find a specific one</p>
                </li>
                <li>
                  <p>For this tutorial, find and drag the "Schedule" trigger onto the canvas</p>
                </li>
                <li>
                  <p>Click on the trigger node to configure its settings</p>
                </li>
              </ol>
            </div>
            
            <div className="relative mb-6 rounded-lg overflow-hidden border border-[#374151]">
              <div className="aspect-[16/9] relative">
                <Image
                  src="/images/help/workflow-trigger.png"
                  alt="Adding a trigger to your workflow"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60 backdrop-blur-sm">
                <p className="text-sm text-white">Adding a Schedule trigger to the workflow canvas</p>
              </div>
            </div>
            
            <div className="bg-[#1E293B] border border-[#374151] rounded-lg p-4 mb-6">
              <h4 className="text-lg font-medium text-[#E5E7EB] mb-2">Common Trigger Types</h4>
              <ul className="space-y-2 text-sm text-[#9CA3AF]">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0" />
                  <span><strong className="text-[#E5E7EB]">Schedule:</strong> Run a workflow at specific intervals or times</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0" />
                  <span><strong className="text-[#E5E7EB]">Webhook:</strong> Trigger when data is received via a webhook URL</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0" />
                  <span><strong className="text-[#E5E7EB]">Integration Event:</strong> Respond to events from connected services (e.g., new Slack message)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0" />
                  <span><strong className="text-[#E5E7EB]">Manual:</strong> Manually start the workflow with a button click</span>
                </li>
              </ul>
            </div>
            
            <p className="text-[#9CA3AF]">
              Configure your Schedule trigger to run at your preferred frequency. For testing purposes, you might want to set it to run every minute so you can quickly see the results.
            </p>
          </div>
        );
      
      case 4:
        return (
          <div>
            <h2 className="text-2xl font-bold text-[#E5E7EB] mb-4">Step 4: Add Action Nodes</h2>
            
            <div className="mb-6">
              <p className="text-[#9CA3AF] mb-4">
                Now that you have a trigger, let's add some action nodes to perform tasks when the trigger fires.
              </p>
              
              <ol className="list-decimal pl-5 space-y-4 text-[#E5E7EB]">
                <li>
                  <p>From the left sidebar, switch to the "Actions" tab</p>
                </li>
                <li>
                  <p>For this example, find and drag an "HTTP Request" action onto the canvas</p>
                </li>
                <li>
                  <p>Connect the Schedule trigger to the HTTP Request action by dragging from the output dot of the trigger to the input dot of the action</p>
                </li>
                <li>
                  <p>Click on the HTTP Request node to configure it</p>
                </li>
                <li>
                  <p>Set the request to GET and use a sample API like "https://jsonplaceholder.typicode.com/todos/1"</p>
                </li>
              </ol>
            </div>
            
            <div className="relative mb-6 rounded-lg overflow-hidden border border-[#374151]">
              <div className="aspect-[16/9] relative">
                <Image
                  src="/images/help/workflow-action.png"
                  alt="Adding and connecting an action node"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60 backdrop-blur-sm">
                <p className="text-sm text-white">Connecting the trigger node to an HTTP Request action node</p>
              </div>
            </div>
            
            <div className="bg-[#1E293B] border border-[#374151] rounded-lg p-4 flex items-start mb-6">
              <InformationCircleIcon className="h-6 w-6 text-[#22D3EE] flex-shrink-0 mt-0.5 mr-3" />
              <div>
                <h4 className="text-lg font-medium text-[#E5E7EB] mb-1">Connecting Multiple Actions</h4>
                <p className="text-sm text-[#9CA3AF]">
                  You can add multiple actions to a workflow and connect them in sequence. The output data from one action is available to use in subsequent actions, creating a powerful data flow.
                </p>
              </div>
            </div>
            
            <p className="text-[#9CA3AF] mb-4">
              Let's add one more action to send the data we retrieve to your email:
            </p>
            
            <ol className="list-decimal pl-5 space-y-4 text-[#E5E7EB]">
              <li>
                <p>Find and drag an "Email" action onto the canvas</p>
              </li>
              <li>
                <p>Connect the HTTP Request node to the Email node</p>
              </li>
              <li>
                <p>Configure the Email action with your email address, a subject, and use the response from the HTTP request in the email body</p>
              </li>
            </ol>
          </div>
        );
      
      case 5:
        return (
          <div>
            <h2 className="text-2xl font-bold text-[#E5E7EB] mb-4">Step 5: Save and Test Your Workflow</h2>
            
            <div className="mb-6">
              <p className="text-[#9CA3AF] mb-4">
                Now that your workflow is complete, it's time to save and test it!
              </p>
              
              <ol className="list-decimal pl-5 space-y-4 text-[#E5E7EB]">
                <li>
                  <p>Click the "Save" button in the top-right corner of the workflow editor</p>
                </li>
                <li>
                  <p>Once saved, click the "Test" button to run your workflow immediately</p>
                </li>
                <li>
                  <p>Monitor the execution in the "Run Log" that appears at the bottom of the screen</p>
                </li>
              </ol>
            </div>
            
            <div className="relative mb-6 rounded-lg overflow-hidden border border-[#374151]">
              <div className="aspect-[16/9] relative">
                <Image
                  src="/images/help/workflow-test.png"
                  alt="Testing your workflow"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60 backdrop-blur-sm">
                <p className="text-sm text-white">Workflow run log showing successful execution</p>
              </div>
            </div>
            
            <div className="bg-[#1E293B] border border-[#374151] rounded-lg p-4 flex items-start mb-6">
              <ExclamationTriangleIcon className="h-6 w-6 text-[#F59E0B] flex-shrink-0 mt-0.5 mr-3" />
              <div>
                <h4 className="text-lg font-medium text-[#E5E7EB] mb-1">Troubleshooting</h4>
                <p className="text-sm text-[#9CA3AF]">
                  If your workflow doesn't run as expected, check the run log for error messages. Common issues include incorrect API URLs, missing connection credentials, or permission problems.
                </p>
              </div>
            </div>
            
            <div className="bg-[#022c22] border border-[#0f766e] rounded-lg p-4 mb-6">
              <h4 className="text-lg font-medium text-[#E5E7EB] mb-2">Congratulations!</h4>
              <p className="text-[#9CA3AF]">
                You've successfully created your first workflow! This simple example demonstrates the core concepts of workflow automation with Optiflow:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-[#9CA3AF]">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0" />
                  <span>A trigger that starts the workflow (Schedule)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0" />
                  <span>Actions that perform tasks (HTTP Request and Email)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0" />
                  <span>Data flow between connected nodes</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0" />
                  <span>Testing and monitoring execution</span>
                </li>
              </ul>
            </div>
            
            <h3 className="text-xl font-semibold text-[#E5E7EB] mb-3">Next Steps</h3>
            <p className="text-[#9CA3AF] mb-4">
              Now that you've created your first workflow, here are some ways to expand your knowledge:
            </p>
            
            <ul className="space-y-3 text-[#9CA3AF]">
              <li className="flex items-start">
                <ArrowRightIcon className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0" />
                <span>Explore different triggers and actions in the workflow editor</span>
              </li>
              <li className="flex items-start">
                <ArrowRightIcon className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0" />
                <span>Connect third-party apps using our <Link href="/help/integrations" className="text-[#22D3EE] hover:underline">integrations</Link></span>
              </li>
              <li className="flex items-start">
                <ArrowRightIcon className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0" />
                <span>Learn about <Link href="/help/workflows/conditional-logic" className="text-[#22D3EE] hover:underline">conditional logic</Link> to create dynamic workflows</span>
              </li>
              <li className="flex items-start">
                <ArrowRightIcon className="h-5 w-5 text-[#22D3EE] mr-2 flex-shrink-0" />
                <span>Check out our <Link href="/help/workflows/templates" className="text-[#22D3EE] hover:underline">workflow templates</Link> for ready-made solutions</span>
              </li>
            </ul>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Article header */}
      <div className="mb-8">
        <div className="flex items-center text-[#9CA3AF] mb-4">
          <Link href="/help" className="hover:text-[#22D3EE]">Help Center</Link>
          <span className="mx-2">›</span>
          <Link href="/help/getting-started" className="hover:text-[#22D3EE]">Getting Started</Link>
          <span className="mx-2">›</span>
          <span>First Workflow</span>
        </div>
        
        <h1 className="text-3xl font-bold text-[#22D3EE] mb-3">Creating Your First Workflow</h1>
        
        <div className="flex items-center text-[#9CA3AF] text-sm mb-6">
          <ClockIcon className="h-4 w-4 mr-1" />
          <span>5 min read</span>
          <span className="mx-2">•</span>
          <span>Last updated: June 15, 2025</span>
        </div>
        
        <div className="prose prose-invert max-w-none text-[#9CA3AF]">
          <p>
            This step-by-step guide will walk you through creating your first workflow in Optiflow. 
            By the end, you'll have a functioning workflow that automatically fetches data and sends it to your email.
          </p>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center text-sm text-[#9CA3AF] mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-[#1E293B] rounded-full h-2">
          <div 
            className="bg-[#22D3EE] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Step content */}
      <div className="mb-8">
        {renderStepContent()}
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between mb-12">
        <button
          onClick={() => goToStep(currentStep - 1)}
          disabled={currentStep === 1}
          className={`flex items-center px-4 py-2 rounded-md ${
            currentStep === 1
              ? 'text-[#6B7280] cursor-not-allowed'
              : 'text-[#E5E7EB] hover:bg-[#1E293B]'
          }`}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Previous Step
        </button>
        
        <button
          onClick={() => goToStep(currentStep + 1)}
          disabled={currentStep === totalSteps}
          className={`flex items-center px-4 py-2 rounded-md ${
            currentStep === totalSteps
              ? 'text-[#6B7280] cursor-not-allowed'
              : 'bg-[#22D3EE] text-[#111111] hover:bg-[#06B6D4]'
          }`}
        >
          Next Step
          <ArrowRightIcon className="h-4 w-4 ml-2" />
        </button>
      </div>
      
      {/* Step dots for navigation */}
      <div className="flex justify-center space-x-2 mb-12">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToStep(index + 1)}
            className={`w-2.5 h-2.5 rounded-full ${
              currentStep === index + 1 ? 'bg-[#22D3EE]' : 'bg-[#374151] hover:bg-[#4B5563]'
            }`}
            aria-label={`Go to step ${index + 1}`}
          ></button>
        ))}
      </div>
      
      {/* Related articles */}
      <div className="border-t border-[#374151] pt-8 mb-12">
        <h3 className="text-xl font-semibold text-[#E5E7EB] mb-4">Related Articles</h3>
        <ul className="space-y-3">
          {relatedArticles.map((article, index) => (
            <li key={index}>
              <Link 
                href={article.href}
                className="flex items-center text-[#9CA3AF] hover:text-[#22D3EE]"
              >
                <BookmarkIcon className="h-4 w-4 mr-2 text-[#22D3EE]" />
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Feedback section */}
      <div className="bg-[#1E293B] border border-[#374151] rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-[#E5E7EB] mb-3">Was this article helpful?</h3>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-[#22D3EE] text-[#111111] rounded-md hover:bg-[#06B6D4]">
            Yes, it helped
          </button>
          <button className="px-4 py-2 bg-[#111111] border border-[#374151] text-[#E5E7EB] rounded-md hover:bg-[#1F2937]">
            No, I need more help
          </button>
        </div>
      </div>
    </div>
  );
} 