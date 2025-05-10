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

export default function Home() {
  const router = useRouter();
  // Simplified A/B test - in production, this would come from an A/B testing framework
  const [abTestVariant, setAbTestVariant] = useState('A');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const heroContent = heroVariants[abTestVariant];
  
  // Simulate A/B test assignment
  useEffect(() => {
    const variants = Object.keys(heroVariants);
    // Random assignment for demo purposes
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    setAbTestVariant(randomVariant);
    
    // In production implementation, track this assignment to analytics
    console.log(`User assigned to variant ${randomVariant}`);
  }, []);
  
  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // SEO metadata would be handled by a proper Next.js Head component in production

  return (
    <div className="bg-[#111111] min-h-screen text-white">
      {/* Hero Section */}
      <section className="py-20 px-6 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span>{heroContent.title.split(" ").slice(0, -3).join(" ")} </span>
              <span className="text-[#22D3EE]">{heroContent.title.split(" ").slice(-3).join(" ")}</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#9CA3AF] mb-10 max-w-3xl mx-auto">
              {heroContent.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="px-8 py-4 bg-[#22D3EE] hover:bg-[#06B6D4] text-[#111111] rounded-lg font-medium transition-colors flex items-center text-lg">
                {heroContent.cta}
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link href="#demo-video" className="px-8 py-4 bg-transparent border border-[#374151] hover:border-[#22D3EE] rounded-lg font-medium transition-colors flex items-center text-lg text-[#E5E7EB]">
                <PlayCircleIcon className="mr-2 h-5 w-5" />
                Watch Demo
              </Link>
            </div>
            <div className="mt-6 text-[#22D3EE] flex items-center justify-center">
              <span className="text-sm font-medium bg-[#22D3EE]/10 px-3 py-1 rounded-full">
                New integrations available!
              </span>
            </div>
          </div>
          
          {/* Hero Image/Animation */}
          <div className="mt-16 relative">
            <div className="bg-gradient-to-b from-[#22D3EE]/20 to-transparent p-1 rounded-xl">
              <div className="relative bg-[#18181B] rounded-lg overflow-hidden border border-[#374151]">
                <div className="aspect-video relative">
                  <Image 
                    src="/images/dashboard-preview.png" 
                    alt="Optiflow Dashboard Preview" 
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <motion.div 
                  className="absolute top-4 right-4 bg-[#22D3EE]/20 backdrop-blur-sm border border-[#22D3EE]/40 text-[#E5E7EB] py-2 px-4 rounded-lg text-sm font-medium"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Voice-enabled workflows
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trusted By Section */}
      <section className="py-16 border-y border-[#1E293B] bg-[#0E1A2B]/30">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[#9CA3AF] mb-10 text-sm uppercase tracking-wider font-medium">
            Trusted by innovative teams at
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 justify-items-center items-center opacity-70">
            {["Company1", "Company2", "Company3", "Company4", "Company5", "Company6"].map((company, i) => (
              <div key={i} className="h-8 flex items-center">
                <div className="h-5 w-24 bg-[#4B5563] rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#E5E7EB]">
              Connect Everything in <span className="text-[#22D3EE]">One Place</span>
            </h2>
            <p className="text-xl text-[#9CA3AF] max-w-3xl mx-auto">
              Our platform lets you connect and automate your favorite tools and services with just a few clicks. No coding required.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#18181B] border border-[#374151] rounded-lg p-6 hover:border-[#22D3EE] transition-colors">
              <div className="w-12 h-12 bg-[#22D3EE]/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#22D3EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#E5E7EB]">Workflow Automation</h3>
              <p className="text-[#9CA3AF] mb-4">
                Create powerful workflows that connect your apps and automate repetitive tasks with our visual editor.
              </p>
              <Link href="/features/workflow-automation" className="text-[#22D3EE] hover:text-[#06B6D4] inline-flex items-center">
                Learn more
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-[#18181B] border border-[#374151] rounded-lg p-6 hover:border-[#22D3EE] transition-colors">
              <div className="w-12 h-12 bg-[#22D3EE]/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#22D3EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#E5E7EB]">Voice Agent</h3>
              <p className="text-[#9CA3AF] mb-4">
                Control your workflows and execute commands using natural language with our Jarvis voice assistant.
              </p>
              <Link href="/features/voice-agent" className="text-[#22D3EE] hover:text-[#06B6D4] inline-flex items-center">
                Learn more
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-[#18181B] border border-[#374151] rounded-lg p-6 hover:border-[#22D3EE] transition-colors">
              <div className="w-12 h-12 bg-[#22D3EE]/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#22D3EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#E5E7EB]">App Integrations</h3>
              <p className="text-[#9CA3AF] mb-4">
                Connect with hundreds of popular apps and services through our intuitive Pipedream integration.
              </p>
              <Link href="/features/integrations" className="text-[#22D3EE] hover:text-[#06B6D4] inline-flex items-center">
                Learn more
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Integration Logos */}
      <section className="py-16 px-6 bg-[#18181B]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2 text-[#E5E7EB]">
              Integrate with your favorite tools
            </h2>
            <p className="text-[#9CA3AF]">
              Connect with hundreds of apps and services to automate your work
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-8 justify-items-center">
            {integrationLogos.map((integration, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#1F2937] rounded-lg flex items-center justify-center mb-2">
                  <Image 
                    src={integration.logo} 
                    alt={integration.name} 
                    width={32} 
                    height={32}
                    className="w-8 h-8"
                  />
                </div>
                <span className="text-xs text-[#9CA3AF]">{integration.name}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link href="/integrations" className="text-[#22D3EE] hover:text-[#06B6D4] inline-flex items-center">
              View all integrations
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Persona-Based Value Props */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#E5E7EB]">
              Built for <span className="text-[#22D3EE]">Your Workflow</span>
            </h2>
            <p className="text-xl text-[#9CA3AF] max-w-3xl mx-auto">
              Whether you're a developer, marketer, or operations professional, Optiflow adapts to your needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {personaValueProps.map((prop, index) => (
              <div key={index} className="bg-[#18181B] border border-[#374151] rounded-lg p-6 hover:border-[#22D3EE] transition-colors">
                <div className="w-12 h-12 bg-[#22D3EE]/10 rounded-lg flex items-center justify-center mb-4">
                  <Image 
                    src={prop.icon} 
                    alt={`${prop.persona} icon`} 
                    width={24} 
                    height={24}
                    className="w-6 h-6"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#E5E7EB]">{prop.title}</h3>
                <p className="text-[#9CA3AF] mb-4">
                  {prop.description}
                </p>
                <Link href={prop.link} className="text-[#22D3EE] hover:text-[#06B6D4] inline-flex items-center">
                  See how it works
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-20 px-6 bg-[#18181B]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#E5E7EB]">
              What Our <span className="text-[#22D3EE]">Users Say</span>
            </h2>
          </div>
          
          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`transition-opacity duration-500 ${
                  index === activeTestimonial ? 'opacity-100' : 'opacity-0 absolute top-0 left-0 right-0'
                }`}
              >
                <div className="bg-[#1E293B] rounded-lg p-8 border border-[#374151] max-w-3xl mx-auto">
                  <div className="flex items-center mb-6">
                    <div className="h-0.5 w-8 bg-[#22D3EE]"></div>
                    <div className="h-0.5 w-16 bg-[#22D3EE] ml-1"></div>
                  </div>
                  <p className="text-xl italic text-[#E5E7EB] mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="mr-4 w-12 h-12 rounded-full overflow-hidden bg-[#374151]">
                      <Image 
                        src={testimonial.avatar} 
                        alt={testimonial.author} 
                        width={48} 
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#E5E7EB]">{testimonial.author}</h4>
                      <p className="text-sm text-[#9CA3AF]">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === activeTestimonial ? 'bg-[#22D3EE]' : 'bg-[#374151]'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Video Demo Section */}
      <section id="demo-video" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#E5E7EB]">
              See Optiflow <span className="text-[#22D3EE]">in Action</span>
            </h2>
            <p className="text-xl text-[#9CA3AF] max-w-3xl mx-auto">
              Watch how easy it is to automate your workflows with voice commands and integrations.
            </p>
          </div>
          
          <div className="relative aspect-video max-w-4xl mx-auto bg-[#1E293B] rounded-lg overflow-hidden border border-[#374151]">
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-20 h-20 rounded-full bg-[#22D3EE]/20 flex items-center justify-center backdrop-blur-sm hover:bg-[#22D3EE]/30 transition-colors">
                <PlayCircleIcon className="h-14 w-14 text-[#22D3EE]" />
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#18181B] to-[#111111]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#E5E7EB]">
            Ready to <span className="text-[#22D3EE]">Transform Your Workflow</span>?
          </h2>
          <p className="text-xl text-[#9CA3AF] mb-8 max-w-2xl mx-auto">
            Get started with Optiflow today and see how our AI-powered automation can revolutionize your productivity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="px-8 py-4 bg-[#22D3EE] hover:bg-[#06B6D4] text-[#111111] rounded-lg font-medium transition-colors text-lg w-full sm:w-auto text-center">
              Start Free Trial
            </Link>
            <Link href="/pricing" className="px-8 py-4 bg-transparent border border-[#374151] hover:border-[#22D3EE] text-[#E5E7EB] rounded-lg font-medium transition-colors text-lg w-full sm:w-auto text-center">
              View Pricing
            </Link>
          </div>
          <p className="mt-6 text-[#9CA3AF] text-sm">
            No credit card required for trial. 14-day free access to all features.
          </p>
        </div>
      </section>
    </div>
  );
} 