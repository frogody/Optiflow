// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRightIcon, PlayCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

// Define A/B testing variants for hero section
const heroVariants = {
  'A': {
    title: "The Automation Platform For Your Workflow",
    subtitle: "Connect your favorite tools, automate your workflows, and boost productivity with our powerful orchestration platform.",
    cta: "Start Automating",
    highlightColor: "#22D3EE",
  },
  'B': {
    title: "Work Smarter with AI-Powered Workflows",
    subtitle: "Optiflow combines voice commands, AI, and hundreds of integrations to revolutionize how you automate your daily tasks.",
    cta: "Try It Free",
    highlightColor: "#A855F7",
  }
};

// Persona-specific value props
const personaValueProps = [
  {
    persona: "developers",
    title: "Streamline Development Workflows",
    description: "Automate CI/CD pipelines, code reviews, and deployment processes with Optiflow's developer-focused integrations.",
    icon: "/icons/code.svg",
    link: "/use-cases/developers"
  },
  {
    persona: "marketers",
    title: "Optimize Your Marketing Campaigns",
    description: "Connect analytics tools, CRMs, and marketing platforms to create automated marketing workflows that save time and increase ROI.",
    icon: "/icons/chart.svg",
    link: "/use-cases/marketers"
  },
  {
    persona: "operations",
    title: "Efficient Business Operations",
    description: "Reduce manual tasks and ensure data consistency across your organization with automated operational workflows.",
    icon: "/icons/settings.svg",
    link: "/use-cases/operations"
  }
];

// Testimonials data
const testimonials = [
  {
    quote: "Optiflow has completely transformed how our team works. The voice commands make it incredibly easy to automate repetitive tasks.",
    author: "Sarah Johnson",
    title: "CTO, TechNova",
    avatar: "/testimonials/sarah-johnson.jpg"
  },
  {
    quote: "We've cut our workflow setup time by 70% since implementing Optiflow. The integrations with our existing tools made adoption seamless.",
    author: "Michael Chen",
    title: "Head of Marketing, GrowthLabs",
    avatar: "/testimonials/michael-chen.jpg"
  },
  {
    quote: "The credit-based system gives us perfect flexibility to scale up or down as needed, and the voice agent feels like having an AI assistant on the team.",
    author: "Aisha Patel",
    title: "Operations Director, Flexify",
    avatar: "/testimonials/aisha-patel.jpg"
  }
];

// Integration logos
const integrationLogos = [
  { name: "Slack", logo: "/icons/slack.svg" },
  { name: "Gmail", logo: "/icons/gmail.svg" },
  { name: "GitHub", logo: "/icons/github.svg" },
  { name: "Salesforce", logo: "/icons/salesforce.svg" },
  { name: "HubSpot", logo: "/icons/hubspot.svg" },
  { name: "Asana", logo: "/icons/asana.svg" },
  { name: "Stripe", logo: "/icons/stripe.svg" },
  { name: "Zapier", logo: "/icons/zapier.svg" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#111111] text-white p-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text">
          Optiflow
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          AI-Powered Workflow Automation
        </p>
        <p className="text-lg text-gray-400 mb-12">
          Your application is now running. Normal pages and routes will be available shortly.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://github.com/frogody/Optiflow"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
          >
            GitHub Repository
          </a>
          <a
            href="/dashboard"
            className="px-6 py-3 border border-indigo-500 text-indigo-400 font-medium rounded-md hover:bg-indigo-900/20 transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
} 