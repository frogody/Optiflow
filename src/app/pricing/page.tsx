'use client';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';
// Disable cache to avoid static rendering issues
export const revalidate = 0;

// Heroicons removed to prevent React version conflicts
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { useState, useEffect } from 'react';
import { HiOutlineSparkles, HiOutlineLightningBolt, HiOutlineCube } from 'react-icons/hi';

// Enhanced aurora effect component
const AuroraEffect = () => {
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
    <motion.div
      initial={{ opacity: 0     }}
      animate={{ opacity: 1     }}
      className="absolute inset-0 overflow-hidden"
    >
      <motion.div
        animate={{ rotate: 360,
          scale: [1, 1.1, 1]
            }}
        transition={{
          rotate: { duration: 50, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2"
        style={{ 
          background: 'conic-gradient(from 0deg at 50% 50%, transparent, rgba(60,223,255,0.1), rgba(74,255,212,0.1), transparent)',
          filter: 'blur(100px)'
        }}
      />
    </motion.div>
  );
};

// Enhanced gradient orb component
const GradientOrb = ({ delay = 0, size = 600, color = 'blue' }) => {
  const gradients = { blue: 'from-[#3CDFFF]/20 to-[#4AFFD4]/20',
    purple: 'from-[#4AFFD4]/20 to-[#3CDFFF]/20',
    mixed: 'from-[#3CDFFF]/20 via-[#4AFFD4]/20 to-[#3CDFFF]/20'
      };

  return (
    <motion.div
      className={`absolute w-[${size}px] h-[${size}px] rounded-full blur-[120px] bg-gradient-to-r ${gradients[color]}`}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{ opacity: [0.1, 0.2, 0.1],
        scale: [1, 1.2, 1],
        x: [0, Math.random() * 100 - 50, 0],
        y: [0, Math.random() * 100 - 50, 0],
        rotate: [0, Math.random() * 90 - 45, 0],
          }}
      transition={{ duration: Math.random() * 5 + 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay
          }}
    />
  );
};

// Plan feature comparison data
const planFeatures = {
  core: [
    { name: "Workflow Automation", included: true },
    { name: "Third-party Integrations", included: true, limit: "15 integrations" },
    { name: "Voice Agent Access", included: false },
    { name: "API Access", included: false },
    { name: "Custom Workflows", included: true, limit: "Up to 10 workflows" },
    { name: "Execution History", included: true, retention: "7 days" },
    { name: "Email Support", included: true },
    { name: "Priority Support", included: false },
    { name: "Team Collaboration", included: false },
    { name: "Advanced Analytics", included: false },
    { name: "Custom Branding", included: false },
    { name: "Audit Logs", included: false },
  ],
  pro: [
    { name: "Workflow Automation", included: true },
    { name: "Third-party Integrations", included: true, limit: "Unlimited" },
    { name: "Voice Agent Access", included: true, limit: "Basic commands" },
    { name: "API Access", included: true },
    { name: "Custom Workflows", included: true, limit: "Up to 50 workflows" },
    { name: "Execution History", included: true, retention: "30 days" },
    { name: "Email Support", included: true },
    { name: "Priority Support", included: true },
    { name: "Team Collaboration", included: true, limit: "Up to 5 members" },
    { name: "Advanced Analytics", included: true },
    { name: "Custom Branding", included: false },
    { name: "Audit Logs", included: true, retention: "30 days" },
  ],
  enterprise: [
    { name: "Workflow Automation", included: true },
    { name: "Third-party Integrations", included: true, limit: "Unlimited" },
    { name: "Voice Agent Access", included: true, limit: "Advanced commands" },
    { name: "API Access", included: true },
    { name: "Custom Workflows", included: true, limit: "Unlimited" },
    { name: "Execution History", included: true, retention: "1 year" },
    { name: "Email Support", included: true },
    { name: "Priority Support", included: true, extra: "Dedicated account manager" },
    { name: "Team Collaboration", included: true, limit: "Unlimited" },
    { name: "Advanced Analytics", included: true },
    { name: "Custom Branding", included: true },
    { name: "Audit Logs", included: true, retention: "1 year" },
  ]
};

// Credit consumption details
const creditConsumption = [
  { action: "Standard workflow execution", credits: 1, description: "Each time a workflow runs" },
  { action: "API call", credits: 2, description: "External API calls within workflows" },
  { action: "Voice command processing", credits: 5, description: "Each voice interaction with Jarvis" },
  { action: "Data processing (per GB)", credits: 10, description: "Processing large datasets" },
  { action: "AI-powered analysis", credits: 15, description: "Using AI to analyze or generate content" },
];

// FAQ data
const faqs = [
  {
    question: "What are credits and how do they work?",
    answer: "Credits are Optiflow's currency for resource usage. They allow for flexible consumption of different resources like workflow executions, API calls, and voice processing. Credits are consumed based on the specific actions you perform in the platform."
  },
  {
    question: "What happens if I run out of credits?",
    answer: "If you exhaust your monthly credits, you can purchase additional credit packs that never expire. Your workflows will continue to run without interruption. You can also set up auto-refill to automatically purchase credits when your balance drops below a threshold."
  },
  {
    question: "Can I change plans at any time?",
    answer: "Yes, you can upgrade your plan at any time and the changes will take effect immediately. When downgrading, the changes will apply at the end of your current billing cycle. Unused credits will roll over when upgrading."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes, we offer a 14-day free trial of our Pro plan with 500 credits included. No credit card is required to start the trial. At the end of your trial, you can choose to subscribe to any of our plans."
  },
  {
    question: "How does the annual discount work?",
    answer: "When you choose annual billing, you save 20% compared to monthly billing. You'll be billed for 12 months upfront, and receive the annual allocation of credits at the beginning of the billing cycle."
  }
];

// Simple icon component to replace Heroicons
const Icon = ({ name, className }) => {
  return (
    <div className={`icon-placeholder ${name} ${className || ''}`}>
      <span className="sr-only">{name}</span>
    </div>
  );
};

export default function PricingPage() {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  const [annualBilling, setAnnualBilling] = useState(true);
  const [showCreditInfo, setShowCreditInfo] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef,
    offset: ["start start", "end end"]
      });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  const getPrice = (basePrice: number) => {
    return annualBilling ? Math.round(basePrice * 0.8) : basePrice;
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Enhanced Dynamic Background */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{ y }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#000B1E] to-black" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        {/* Aurora Effect */}
        <AuroraEffect />
        
        {/* Gradient Orbs */}
        {[...Array(12)].map((_, i) => (
          <GradientOrb
            key={i}
            delay={i * 0.5}
            size={Math.random() * 300 + 400}
            color={ i % 3 === 0 ? 'blue' : i % 3 === 1 ? 'purple' : 'mixed'    }
          />
        ))}

        {/* Tech Grid Lines */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px w-full"
              style={{
                top: `${(i + 1) * 20}%`,
                background: 'linear-gradient(90deg, transparent, rgba(60,223,255,0.1), transparent)',
                opacity: 0.3,
              }}
              animate={{ x: [-1000, 1000],
                opacity: [0.1, 0.3, 0.1],
                  }}
              transition={{ duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: i * 1,
                  }}
            />
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20     }}
          animate={{ opacity: 1, y: 0     }}
          transition={{ duration: 0.8     }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8     }}
            animate={{ opacity: 1, scale: 1     }}
            transition={{ duration: 0.7, delay: 0.3     }}
            className="inline-block mb-8"
          >
            <span className="px-6 py-2 rounded-full bg-gradient-to-r from-[#3CDFFF]/10 to-[#4AFFD4]/10 border border-[#3CDFFF]/20 text-[#3CDFFF] text-sm font-medium backdrop-blur-sm">
              Transform Your Business with AI
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4]">
              Enterprise-Grade AI
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Made Simple
            </span>
          </h1>

          <p className="text-xl text-[#3CDFFF]/90 mb-12 max-w-3xl mx-auto">
            Choose the perfect plan to bring your AI vision to life. All plans include access to our core AI Factory, Academy, and Integration capabilities.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <span className={`text-lg ${ !annualBilling ? 'text-[#3CDFFF]' : 'text-white/60'    }`}>
              Monthly
            </span>
            <motion.button
              whileHover={{ scale: 1.05     }}
              whileTap={{ scale: 0.95     }}
              onClick={() => setAnnualBilling(!annualBilling)}
              className="relative w-20 h-10 bg-gradient-to-r from-[#3CDFFF]/20 to-[#4AFFD4]/20 rounded-full p-1 transition-colors duration-200 ease-in-out backdrop-blur-xl border border-[#3CDFFF]/20"
            >
              <motion.div
                layout
                className="absolute w-8 h-8 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-full"
                animate={{ x: annualBilling ? 40 : 0,
                    }}
                transition={{ type: "spring",
                  stiffness: 700,
                  damping: 30
                    }}
              />
            </motion.button>
            <span className={`text-lg ${ annualBilling ? 'text-[#3CDFFF]' : 'text-white/60'    }`}>
              Annual
              <span className="ml-2 text-[#4AFFD4] text-sm">Save 20%</span>
            </span>
          </div>

          {/* Pricing Tiers */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
            {/* Core Plan */}
            <motion.div
              key="core"
              initial={{ opacity: 0, y: 20     }}
              animate={{ opacity: 1, y: 0     }}
              transition={{ duration: 0.5, delay: 0.1     }}
              className={`relative p-8 rounded-2xl backdrop-blur-xl border group hover:scale-105 transition-transform duration-300 ${ !annualBilling
                  ? 'border-[#3CDFFF] bg-gradient-to-b from-[#3CDFFF]/10 to-transparent'
                  : 'border-white/10 bg-white/5 hover:border-[#3CDFFF]/50'
                  }`}
            >
              <div className="flex items-center justify-center mb-6">
                <div className={ `w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-[#3CDFFF]/20 to-[#4AFFD4]/20 group-hover:from-[#3CDFFF]/30 group-hover:to-[#4AFFD4]/30 transition-colors duration-300`    }>
                  <HiOutlineSparkles className="w-8 h-8 text-[#3CDFFF]" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 text-center">Core</h3>
              <div className="text-4xl font-bold mb-4 text-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4]">
                  ${getPrice(29)}
                </span>
                {annualBilling && (
                  <span className="text-sm text-white/60 ml-2">per month, billed annually</span>
                )}
              </div>
              <p className="text-white/80 mb-8 text-center h-12">Perfect for individuals and small projects</p>

              {/* Products Included */}
              <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-sm text-white/60 mb-3">Included Products:</h4>
                <ul className="space-y-2">
                  {planFeatures.core.map((feature) => (
                    <li key={feature.name} className="text-[#3CDFFF]">
                      {feature.name}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {planFeatures.core.map((feature, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start ${ feature.included ? 'text-[#4AFFD4]' : 'text-white/80'
                        }`}
                  >
                    <svg
                      className={`w-5 h-5 mr-3 mt-1 ${ feature.included ? 'text-[#4AFFD4]' : 'text-[#3CDFFF]'
                          }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature.name}
                    {feature.limit && <span className="block text-xs text-white/60 ml-2">{feature.limit}</span>}
                    {feature.retention && <span className="block text-xs text-white/60 ml-2">Retention: {feature.retention}</span>}
                  </li>
                ))}
              </ul>

              <motion.div
                whileHover={{ scale: 1.05     }}
                whileTap={{ scale: 0.95     }}
              >
                <Link
                  href="/signup?plan=core"
                  className={`block w-full py-4 px-6 rounded-xl text-center font-medium transition-all duration-300 ${ !annualBilling
                      ? 'bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-black hover:shadow-lg hover:shadow-[#3CDFFF]/20'
                      : 'bg-gradient-to-r from-[#3CDFFF]/20 to-[#4AFFD4]/20 text-white hover:from-[#3CDFFF]/30 hover:to-[#4AFFD4]/30'
                      }`}
                >
                  Get Started
                </Link>
              </motion.div>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              key="pro"
              initial={{ opacity: 0, y: 20     }}
              animate={{ opacity: 1, y: 0     }}
              transition={{ duration: 0.5, delay: 0.2     }}
              className={`relative p-8 rounded-2xl backdrop-blur-xl border group hover:scale-105 transition-transform duration-300 ${ annualBilling
                  ? 'border-[#3CDFFF] bg-gradient-to-b from-[#3CDFFF]/10 to-transparent'
                  : 'border-white/10 bg-white/5 hover:border-[#3CDFFF]/50'
                  }`}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-black text-sm px-4 py-1 rounded-full font-medium">
                  Most Popular
                </span>
              </div>

              <div className="flex items-center justify-center mb-6">
                <div className={ `w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-[#3CDFFF]/20 to-[#4AFFD4]/20 group-hover:from-[#3CDFFF]/30 group-hover:to-[#4AFFD4]/30 transition-colors duration-300`    }>
                  <HiOutlineLightningBolt className="w-8 h-8 text-[#3CDFFF]" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 text-center">Pro</h3>
              <div className="text-4xl font-bold mb-4 text-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4]">
                  ${getPrice(99)}
                </span>
                {annualBilling && (
                  <span className="text-sm text-white/60 ml-2">per month, billed annually</span>
                )}
              </div>
              <p className="text-white/80 mb-8 text-center h-12">For professionals and growing teams</p>

              {/* Products Included */}
              <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-sm text-white/60 mb-3">Included Products:</h4>
                <ul className="space-y-2">
                  {planFeatures.pro.map((feature) => (
                    <li key={feature.name} className="text-[#3CDFFF]">
                      {feature.name}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {planFeatures.pro.map((feature, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start ${ feature.included ? 'text-[#4AFFD4]' : 'text-white/80'
                        }`}
                  >
                    <svg
                      className={`w-5 h-5 mr-3 mt-1 ${ feature.included ? 'text-[#4AFFD4]' : 'text-[#3CDFFF]'
                          }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature.name}
                    {feature.limit && <span className="block text-xs text-white/60 ml-2">{feature.limit}</span>}
                    {feature.retention && <span className="block text-xs text-white/60 ml-2">Retention: {feature.retention}</span>}
                    {feature.extra && <span className="block text-xs text-white/60 ml-2">{feature.extra}</span>}
                  </li>
                ))}
              </ul>

              <motion.div
                whileHover={{ scale: 1.05     }}
                whileTap={{ scale: 0.95     }}
              >
                <Link
                  href="/signup?plan=pro"
                  className={`block w-full py-4 px-6 rounded-xl text-center font-medium transition-all duration-300 ${ annualBilling
                      ? 'bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-black hover:shadow-lg hover:shadow-[#3CDFFF]/20'
                      : 'bg-gradient-to-r from-[#3CDFFF]/20 to-[#4AFFD4]/20 text-white hover:from-[#3CDFFF]/30 hover:to-[#4AFFD4]/30'
                      }`}
                >
                  Get Started
                </Link>
              </motion.div>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              key="enterprise"
              initial={{ opacity: 0, y: 20     }}
              animate={{ opacity: 1, y: 0     }}
              transition={{ duration: 0.5, delay: 0.3     }}
              className={`relative p-8 rounded-2xl backdrop-blur-xl border group hover:scale-105 transition-transform duration-300 ${ !annualBilling
                  ? 'border-[#3CDFFF] bg-gradient-to-b from-[#3CDFFF]/10 to-transparent'
                  : 'border-white/10 bg-white/5 hover:border-[#3CDFFF]/50'
                  }`}
            >
              <div className="flex items-center justify-center mb-6">
                <div className={ `w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-[#3CDFFF]/20 to-[#4AFFD4]/20 group-hover:from-[#3CDFFF]/30 group-hover:to-[#4AFFD4]/30 transition-colors duration-300`    }>
                  <HiOutlineCube className="w-8 h-8 text-[#3CDFFF]" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 text-center">Enterprise</h3>
              <div className="text-4xl font-bold mb-4 text-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4]">
                  ${getPrice(299)}
                </span>
                {annualBilling && (
                  <span className="text-sm text-white/60 ml-2">per month, billed annually</span>
                )}
              </div>
              <p className="text-white/80 mb-8 text-center h-12">For organizations with advanced needs</p>

              {/* Products Included */}
              <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-sm text-white/60 mb-3">Included Products:</h4>
                <ul className="space-y-2">
                  {planFeatures.enterprise.map((feature) => (
                    <li key={feature.name} className="text-[#3CDFFF]">
                      {feature.name}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {planFeatures.enterprise.map((feature, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start ${ feature.included ? 'text-[#4AFFD4]' : 'text-white/80'
                        }`}
                  >
                    <svg
                      className={`w-5 h-5 mr-3 mt-1 ${ feature.included ? 'text-[#4AFFD4]' : 'text-[#3CDFFF]'
                          }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature.name}
                    {feature.limit && <span className="block text-xs text-white/60 ml-2">{feature.limit}</span>}
                    {feature.retention && <span className="block text-xs text-white/60 ml-2">Retention: {feature.retention}</span>}
                    {feature.extra && <span className="block text-xs text-white/60 ml-2">{feature.extra}</span>}
                  </li>
                ))}
              </ul>

              <motion.div
                whileHover={{ scale: 1.05     }}
                whileTap={{ scale: 0.95     }}
              >
                <Link
                  href="/contact?topic=enterprise"
                  className={`block w-full py-4 px-6 rounded-xl text-center font-medium transition-all duration-300 ${ !annualBilling
                      ? 'bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-black hover:shadow-lg hover:shadow-[#3CDFFF]/20'
                      : 'bg-gradient-to-r from-[#3CDFFF]/20 to-[#4AFFD4]/20 text-white hover:from-[#3CDFFF]/30 hover:to-[#4AFFD4]/30'
                      }`}
                >
                  Contact Sales
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Credits Breakdown */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#E5E7EB]">Understanding Credits</h2>
              <button 
                onClick={() => setShowCreditInfo(!showCreditInfo)} 
                className="text-[#22D3EE] hover:text-[#06B6D4] transition-colors text-sm font-medium"
              >
                {showCreditInfo ? 'Hide details' : 'Show details'}
              </button>
            </div>
            
            {showCreditInfo && (
              <div className="bg-[#18181B] border border-[#374151] rounded-lg overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#374151]">
                    <thead>
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                          Action
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                          Credits
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#374151]">
                      {creditConsumption.map((item, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-[#1F2937]' : 'bg-[#18181B]'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E5E7EB]">
                            {item.action}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E5E7EB]">
                            {item.credits}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">
                            {item.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#18181B] border border-[#374151] rounded-lg p-6">
                <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">Need Additional Credits?</h3>
                <p className="text-sm text-[#9CA3AF] mb-4">
                  All plans include a monthly credit allocation. Need more? Purchase additional credits that never expire.
                </p>
                <div className="bg-[#1F2937] p-4 rounded-md">
                  <div className="flex justify-between mb-2">
                    <span className="text-[#9CA3AF]">500 credits</span>
                    <span className="text-[#E5E7EB] font-medium">$19.99</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[#9CA3AF]">1,000 credits</span>
                    <span className="text-[#E5E7EB] font-medium">$34.99</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[#9CA3AF]">5,000 credits</span>
                    <span className="text-[#E5E7EB] font-medium">$149.99</span>
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-2">
                    * Additional credit packs can be purchased at any time
                  </div>
                </div>
              </div>
              
              <div className="bg-[#18181B] border border-[#374151] rounded-lg p-6">
                <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">Example Usage</h3>
                <p className="text-sm text-[#9CA3AF] mb-4">
                  Here's what you can do with the Pro plan's 2,000 monthly credits:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Icon name="check-circle-" className="h-4 w-4 text-[#22D3EE] mr-2" />
                    <span className="text-[#E5E7EB]">Run 1,000+ standard workflows</span>
                  </li>
                  <li className="flex items-center">
                    <Icon name="check-circle-" className="h-4 w-4 text-[#22D3EE] mr-2" />
                    <span className="text-[#E5E7EB]">Process 250+ voice commands</span>
                  </li>
                  <li className="flex items-center">
                    <Icon name="check-circle-" className="h-4 w-4 text-[#22D3EE] mr-2" />
                    <span className="text-[#E5E7EB]">Make 500+ API calls to external services</span>
                  </li>
                  <li className="flex items-center">
                    <Icon name="check-circle-" className="h-4 w-4 text-[#22D3EE] mr-2" />
                    <span className="text-[#E5E7EB]">Analyze 5+ GB of data</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-[#18181B] border border-[#374151] rounded-lg p-6">
                <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">Enterprise Customization</h3>
                <p className="text-sm text-[#9CA3AF] mb-4">
                  Need a custom plan tailored to your organization's specific requirements?
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <Icon name="check-circle-" className="h-4 w-4 text-[#22D3EE] mt-0.5 mr-2" />
                    <span className="text-[#E5E7EB]">Custom credit allocation</span>
                  </div>
                  <div className="flex items-start">
                    <Icon name="check-circle-" className="h-4 w-4 text-[#22D3EE] mt-0.5 mr-2" />
                    <span className="text-[#E5E7EB]">Volume discounts</span>
                  </div>
                  <div className="flex items-start">
                    <Icon name="check-circle-" className="h-4 w-4 text-[#22D3EE] mt-0.5 mr-2" />
                    <span className="text-[#E5E7EB]">Custom SLAs and support</span>
                  </div>
                  <div className="flex items-start">
                    <Icon name="check-circle-" className="h-4 w-4 text-[#22D3EE] mt-0.5 mr-2" />
                    <span className="text-[#E5E7EB]">On-premise deployment options</span>
                  </div>
                </div>
                <Link 
                  href="/enterprise"
                  className="mt-4 text-[#22D3EE] hover:text-[#06B6D4] transition-colors inline-flex items-center text-sm font-medium"
                >
                  Learn more about Enterprise
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold text-[#E5E7EB] mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-[#18181B] border border-[#374151] rounded-lg p-6">
                  <h3 className="text-lg font-medium text-[#E5E7EB] mb-2 flex items-start">
                    <Icon name="question-mark-circle-" className="h-5 w-5 text-[#22D3EE] mt-0.5 mr-2 flex-shrink-0" />
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-sm text-[#9CA3AF] ml-7">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <p className="text-[#9CA3AF] mb-4">
                Have more questions about our pricing or plans?
              </p>
              <Link 
                href="/contact?topic=pricing" 
                className="text-[#22D3EE] hover:text-[#06B6D4] transition-colors font-medium"
              >
                Contact our sales team
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 