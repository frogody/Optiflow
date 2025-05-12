"use client";
import { signIn, useSession } from "next-auth/react";
import { Suspense } from "react";

import VoiceAgentClient from "@/components/voice/VoiceAgentClient";

// Create error boundary component for voice agent
function VoiceAgentErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <div className="error-boundary-wrapper">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#111111] text-[#E5E7EB]">
          <div className="animate-pulse text-xl text-[#22D3EE]">Loading voice agent...</div>
        </div>
      }>
        {children}
      </Suspense>
    </div>
  );
}

// Separate the session checking into its own component
function VoiceAgentAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111111] text-[#E5E7EB]">
        <div className="animate-pulse text-xl text-[#22D3EE]">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#111111] text-[#E5E7EB]">
        <h1 className="text-3xl font-bold mb-8 text-[#22D3EE]">Jarvis Voice Assistant</h1>
        <div className="bg-[#18181B] shadow-lg rounded-lg p-8 max-w-md w-full border border-[#374151]">
          <p className="mb-6 text-center text-[#D1D5DB]">
            Please sign in to access the voice assistant.
          </p>
          <button
            onClick={() => signIn()}
            className="w-full py-3 bg-[#06B6D4] hover:bg-[#0EA5E9] text-[#111111] font-semibold rounded-md transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // User is signed in
  return (
    <div className="min-h-screen bg-[#111111] text-[#E5E7EB] pt-8 pb-16">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3 text-[#22D3EE]">Jarvis Voice Assistant</h1>
          <p className="text-[#9CA3AF] text-lg max-w-3xl">
            Your AI voice assistant for Optiflow. Use voice commands to control your workflows, 
            get information, or execute actions through Pipedream integrations.
          </p>
        </div>
        
        <Suspense fallback={
          <div className="w-full h-64 flex items-center justify-center bg-[#18181B] rounded-lg border border-[#374151] animate-pulse">
            <p className="text-[#22D3EE]">Loading voice interface...</p>
          </div>
        }>
          <VoiceAgentClient className="mb-12" />
        </Suspense>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="bg-[#18181B] shadow-lg rounded-lg p-6 border border-[#374151]">
            <h2 className="text-xl font-semibold mb-6 text-[#22D3EE]">Example Commands</h2>
            <ul className="space-y-4">
              {[
                "Send an email to my team about the project status",
                "Create a task in Asana for the website redesign",
                "What's on my calendar for tomorrow?",
                "Summarize my recent notifications",
                "Start a new workflow for customer onboarding"
              ].map((command, i) => (
                <li key={i} className="flex items-start">
                  <span className="inline-block w-6 h-6 rounded-full bg-[#22D3EE] text-[#111111] flex items-center justify-center mr-3 font-medium text-sm shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-[#D1D5DB]">"{command}"</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-[#18181B] shadow-lg rounded-lg p-6 border border-[#374151]">
            <h2 className="text-xl font-semibold mb-6 text-[#A855F7]">Tips</h2>
            <ul className="space-y-4">
              {[
                "Speak clearly and at a moderate pace",
                "Use natural language for your requests",
                "Connect your services in Settings to enable more capabilities",
                "You can type commands if you prefer not to speak",
                "Say 'help' to get assistance with commands"
              ].map((tip, i) => (
                <li key={i} className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-[#A855F7] flex items-center justify-center mr-3 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#111111]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-[#D1D5DB]">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main export with proper error boundaries and suspense
export default function VoiceAgentPage(): JSX.Element {
  return (
    <VoiceAgentErrorBoundary>
      <VoiceAgentAuth />
    </VoiceAgentErrorBoundary>
  );
}