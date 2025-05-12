'use client';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';
// Disable cache to avoid static rendering issues
export const revalidate = 0;

// Heroicons removed to prevent React version conflicts
import Link from 'next/link';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import components that could cause hydration issues
const Image = dynamic(() => import('next/image'), { ssr: false });

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

// Simple icon component to replace Heroicons
const Icon = ({ name, className }) => {
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
    <div className={`icon-placeholder ${name} ${className || ''}`}>
      <span className="sr-only">{name}</span>
    </div>
  );
};

export default function HomePage() {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  const hero = heroVariants['A'];
  const [mounted, setMounted] = useState(false);
  
  // Only run on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Basic content that will be the same on server and client initially
  const renderContent = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#111111] text-white p-4">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mt-12 mb-16">
        {/* Trusted badge */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center bg-[#18181B] text-[#22D3EE] px-4 py-1 rounded-full text-sm font-medium border border-[#374151]">
            <Icon name="check-circle-" className="h-5 w-5 mr-1" /> Trusted by 10,000+ teams
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text">
          {hero.title}
        </h1>
        <p className="text-xl text-gray-300 mb-4">{hero.subtitle}</p>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Link
            href="/signup"
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors inline-flex items-center"
          >
            {hero.cta}
            <Icon name="arrow-right-" className="ml-2 h-5 w-5" />
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-indigo-500 text-indigo-400 font-medium rounded-md hover:bg-indigo-900/20 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/demo"
            className="px-6 py-3 border border-[#22D3EE] text-[#22D3EE] font-medium rounded-md hover:bg-[#22D3EE]/10 transition-colors inline-flex items-center"
          >
            <Icon name="play-circle-" className="h-5 w-5 mr-2" /> Watch Demo
          </Link>
        </div>
        
        {/* Only render images after client-side hydration */}
        {mounted && (
          <>
            {/* Integration Logos */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              {integrationLogos.map((logo) => (
                <div key={logo.name} className="flex items-center">
                  <Image src={logo.logo} alt={logo.name} width={40} height={40} className="h-10 w-10 object-contain" />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Persona Value Props */}
      <section className="w-full max-w-5xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Who is Optiflow for?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {personaValueProps.map((persona) => (
            <Link
              key={persona.persona}
              href={persona.link}
              className="bg-[#18181B] rounded-lg p-6 flex flex-col items-center border border-[#374151] hover:border-indigo-500 transition-colors group"
            >
              {mounted ? (
                <Image src={persona.icon} alt={persona.title} width={48} height={48} className="mb-4 h-12 w-12 object-contain" />
              ) : (
                <div className="mb-4 h-12 w-12" />
              )}
              <h3 className="text-lg font-semibold mb-2 text-indigo-400 group-hover:text-indigo-300">{persona.title}</h3>
              <p className="text-gray-400 text-center mb-4">{persona.description}</p>
              <span className="inline-flex items-center text-indigo-400 group-hover:text-indigo-200 font-medium">
                Learn more <Icon name="arrow-right-" className="ml-1 h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      {mounted && (
        <section className="w-full max-w-5xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-[#18181B] rounded-lg p-6 flex flex-col items-center border border-[#374151]">
                <Image src={testimonial.avatar} alt={testimonial.author} width={56} height={56} className="rounded-full mb-4 h-14 w-14 object-cover" />
                <p className="text-gray-300 italic mb-4">"{testimonial.quote}"</p>
                <div className="text-indigo-400 font-semibold">{testimonial.author}</div>
                <div className="text-gray-400 text-sm">{testimonial.title}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  return renderContent();
} 