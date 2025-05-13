'use client';

import { CheckCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { HiOutlineSparkles, HiOutlineLightningBolt, HiOutlineCube } from 'react-icons/hi';

// Custom CSS for range sliders
const sliderStyles = `
  .pricing-slider {
    -webkit-appearance: none;
    width: 100%;
    height: 8px;
    border-radius: 10px;
    background: rgba(60, 223, 255, 0.2);
    outline: none;
    transition: all 0.2s;
  }
  
  .pricing-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(to right, #3CDFFF, #4AFFD4);
    cursor: pointer;
    box-shadow: 0 0 10px rgba(60, 223, 255, 0.5);
  }
  
  .pricing-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(to right, #3CDFFF, #4AFFD4);
    cursor: pointer;
    box-shadow: 0 0 10px rgba(60, 223, 255, 0.5);
    border: none;
  }
  
  .pricing-slider:hover {
    background: rgba(60, 223, 255, 0.3);
  }
  
  .pricing-slider:active::-webkit-slider-thumb {
    box-shadow: 0 0 15px rgba(60, 223, 255, 0.7);
  }
`;

// Enhanced aurora effect component
const AuroraEffect = () => {
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
  const gradients: { [key: string]: string } = { blue: 'from-[#3CDFFF]/20 to-[#4AFFD4]/20',
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

// Credit calculation constants 
const CREDIT_COST = 0.07; // Cost per credit in euros
const BASE_PRICES = {
  core: 59,
  pro: 129,
  enterprise: 299
};

// Credit slider ranges
const CREDIT_RANGES = {
  core: { min: 500, max: 5000, default: 1000 },
  pro: { min: 1000, max: 10000, default: 2000 },
  enterprise: { min: 5000, max: 50000, default: 10000 }
};

// Updated plan features with clearer structure and proper typing
interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string;
  retention?: string;
  highlight?: boolean;
  extra?: boolean;
}

interface PlanFeatures {
  [key: string]: PlanFeature[];
}

const planFeatures: PlanFeatures = {
  core: [
    { name: "Workflow Automation", included: true, limit: "Basic workflows" },
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
    { name: "Everything in Core plan, plus:", included: true, highlight: true },
    { name: "Unlimited Third-party Integrations", included: true, extra: true },
    { name: "Voice Agent Access", included: true, limit: "Basic commands", extra: true },
    { name: "API Access", included: true, extra: true },
    { name: "Custom Workflows", included: true, limit: "Up to 50 workflows", extra: true },
    { name: "Execution History", included: true, retention: "30 days", extra: true },
    { name: "Priority Support", included: true, extra: true },
    { name: "Team Collaboration", included: true, limit: "Up to 5 members", extra: true },
    { name: "Advanced Analytics", included: true, extra: true },
    { name: "Audit Logs", included: true, retention: "30 days", extra: true },
  ],
  enterprise: [
    { name: "Everything in Pro plan, plus:", included: true, highlight: true },
    { name: "Unlimited Custom Workflows", included: true, extra: true },
    { name: "Advanced Voice Commands", included: true, extra: true },
    { name: "Execution History", included: true, retention: "1 year", extra: true },
    { name: "Dedicated Account Manager", included: true, extra: true },
    { name: "Unlimited Team Collaboration", included: true, extra: true },
    { name: "Custom Branding", included: true, extra: true },
    { name: "Audit Logs", included: true, retention: "1 year", extra: true },
    { name: "SLA Guarantees", included: true, extra: true },
    { name: "On-Premise Deployment Options", included: true, extra: true },
  ]
};

// Credit consumption details
const creditConsumption = [
  { action: "Standard workflow execution", credits: 1, description: "Each time a workflow runs" },
  { action: "API call", credits: 2, description: "External API calls within workflows" },
  { action: "Voice command processing", credits: 5, description: "Each voice interaction with Sync" },
  { action: "Data processing (per GB)", credits: 10, description: "Processing large datasets" },
  { action: "AI-powered analysis", credits: 15, description: "Using AI to analyze or generate content" },
];

// Updated FAQ data with credit pricing info
const faqs = [
  {
    question: "How does the credit system work?",
    answer: "Credits are Sync's resource currency. Each credit costs €0.07 and is consumed when you use platform resources like workflow executions, API calls, or voice processing. You can adjust the number of credits in your plan at any time using the slider to match your exact usage needs."
  },
  {
    question: "What happens if I use all my credits?",
    answer: "If you exhaust your monthly credits, you can purchase additional credit packs or upgrade your plan. Your workflows will continue to run without interruption. We'll notify you when your credits are running low, and you can set up auto-refill to add credits automatically."
  },
  {
    question: "Can I change my plan or credit amount?",
    answer: "Yes, you can adjust your credit allocation or upgrade your plan at any time. Changes take effect immediately. When downgrading, changes apply at the end of your current billing cycle. Unused credits will roll over for 90 days when changing plans."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes, we offer a 14-day free trial of our Pro plan with 500 credits included. No credit card is required to start. You can experience all Pro features before deciding which plan fits your needs best."
  },
  {
    question: "How do I know which plan is right for me?",
    answer: "The Core plan (€59/mo) is ideal for individuals and small projects. The Pro plan (€129/mo) offers more capabilities for professionals and growing teams. For large organizations with advanced needs, our Enterprise plan (€299/mo) provides the highest level of service and support."
  }
];

export default function PricingPage(): JSX.Element {
  const [annualBilling, setAnnualBilling] = useState(true);
  const [showCreditInfo, setShowCreditInfo] = useState(false);
  const [coreCredits, setCoreCredits] = useState(CREDIT_RANGES.core.default);
  const [proCredits, setProCredits] = useState(CREDIT_RANGES.pro.default);
  const [enterpriseCredits, setEnterpriseCredits] = useState(CREDIT_RANGES.enterprise.default);
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ 
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  const getPrice = (basePrice: number, credits: number) => {
    const totalPrice = basePrice + (credits * CREDIT_COST);
    return annualBilling ? Math.round(totalPrice * 0.8) : Math.round(totalPrice);
  };

  // Credit slider handlers
  const handleCoreCreditsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoreCredits(parseInt(e.target.value, 10));
  };

  const handleProCreditsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProCredits(parseInt(e.target.value, 10));
  };

  const handleEnterpriseCreditsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnterpriseCredits(parseInt(e.target.value, 10));
  };

  // Format price in Euro
  const formatPrice = (price: number) => {
    return `€${price}`;
  };

  return (
    <div className="min-h-screen text-white bg-[#111111] relative overflow-x-hidden">
      {/* Animated Gradient Backgrounds */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-[700px] h-[700px] left-1/4 top-0 bg-gradient-to-br from-[#3CDFFF]/20 to-[#4AFFD4]/10 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute w-[600px] h-[600px] right-1/4 bottom-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/10 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative p-8 rounded-2xl backdrop-blur-xl border group hover:border-[#3CDFFF]/50 bg-white/5 border-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-[#3CDFFF]/20 to-[#4AFFD4]/20 group-hover:from-[#3CDFFF]/30 group-hover:to-[#4AFFD4]/30 transition-colors duration-300">
                  <HiOutlineSparkles className="w-8 h-8 text-[#3CDFFF]" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 text-center">Core</h3>
              <div className="text-4xl font-bold mb-4 text-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4]">
                  {formatPrice(getPrice(BASE_PRICES.core, coreCredits))}
                </span>
                {annualBilling && (
                  <span className="text-sm text-white/60 ml-2">per month, billed annually</span>
                )}
              </div>
              <p className="text-white/80 mb-8 text-center h-12">Perfect for individuals and small projects</p>

              {/* Credit Slider */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-white/60 mb-2">
                  <span>Credits: {coreCredits}</span>
                  <span>€{(coreCredits * CREDIT_COST).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={CREDIT_RANGES.core.min}
                  max={CREDIT_RANGES.core.max}
                  step="100"
                  value={coreCredits}
                  onChange={handleCoreCreditsChange}
                  className="pricing-slider w-full h-2 bg-[#3CDFFF]/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>{CREDIT_RANGES.core.min}</span>
                  <span>{CREDIT_RANGES.core.max}</span>
                </div>
              </div>

              {/* Feature List */}
              <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10">
                <ul className="space-y-3">
                  {planFeatures['core']?.map((feature, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start ${
                        feature.highlight 
                          ? 'text-white font-medium text-lg my-3' 
                          : feature.included 
                            ? 'text-[#4AFFD4]' 
                            : 'text-white/40'
                      }`}
                    >
                      {!feature.highlight && (
                        <svg
                          className={`w-5 h-5 mr-3 mt-0.5 ${
                            feature.included ? 'text-[#4AFFD4]' : 'text-[#3CDFFF]/40'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={feature.included ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}
                          />
                        </svg>
                      )}
                      <span>
                        {feature.name}
                        {feature.limit && (
                          <span className="block text-xs text-white/60 mt-0.5">{feature.limit}</span>
                        )}
                        {feature.retention && (
                          <span className="block text-xs text-white/60 mt-0.5">Retention: {feature.retention}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/signup?plan=core"
                  className="block w-full py-4 px-6 rounded-xl text-center font-medium transition-all duration-300 bg-gradient-to-r from-[#3CDFFF]/20 to-[#4AFFD4]/20 text-white hover:from-[#3CDFFF]/30 hover:to-[#4AFFD4]/30"
                >
                  Get Started
                </Link>
              </motion.div>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              key="pro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative p-8 rounded-2xl backdrop-blur-xl border-[#3CDFFF] bg-gradient-to-b from-[#3CDFFF]/10 to-transparent border group hover:scale-105 transition-transform duration-300"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-black text-sm px-4 py-1 rounded-full font-medium">
                  Most Popular
                </span>
              </div>

              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-[#3CDFFF]/20 to-[#4AFFD4]/20 group-hover:from-[#3CDFFF]/30 group-hover:to-[#4AFFD4]/30 transition-colors duration-300">
                  <HiOutlineLightningBolt className="w-8 h-8 text-[#3CDFFF]" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 text-center">Pro</h3>
              <div className="text-4xl font-bold mb-4 text-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4]">
                  {formatPrice(getPrice(BASE_PRICES.pro, proCredits))}
                </span>
                {annualBilling && (
                  <span className="text-sm text-white/60 ml-2">per month, billed annually</span>
                )}
              </div>
              <p className="text-white/80 mb-8 text-center h-12">For professionals and growing teams</p>

              {/* Credit Slider */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-white/60 mb-2">
                  <span>Credits: {proCredits}</span>
                  <span>€{(proCredits * CREDIT_COST).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={CREDIT_RANGES.pro.min}
                  max={CREDIT_RANGES.pro.max}
                  step="100"
                  value={proCredits}
                  onChange={handleProCreditsChange}
                  className="pricing-slider w-full h-2 bg-[#3CDFFF]/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>{CREDIT_RANGES.pro.min}</span>
                  <span>{CREDIT_RANGES.pro.max}</span>
                </div>
              </div>

              {/* Feature List */}
              <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10">
                <ul className="space-y-3">
                  {planFeatures['pro']?.map((feature, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start ${
                        feature.highlight 
                          ? 'text-white font-medium text-lg my-3' 
                          : feature.included 
                            ? feature.extra 
                              ? 'text-[#4AFFD4]' 
                              : 'text-white/80'
                            : 'text-white/40'
                      }`}
                    >
                      {!feature.highlight && (
                        <svg
                          className={`w-5 h-5 mr-3 mt-0.5 ${
                            feature.included ? 'text-[#4AFFD4]' : 'text-[#3CDFFF]/40'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={feature.included ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}
                          />
                        </svg>
                      )}
                      <span>
                        {feature.name}
                        {feature.limit && (
                          <span className="block text-xs text-white/60 mt-0.5">{feature.limit}</span>
                        )}
                        {feature.retention && (
                          <span className="block text-xs text-white/60 mt-0.5">Retention: {feature.retention}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/signup?plan=pro"
                  className="block w-full py-4 px-6 rounded-xl text-center font-medium transition-all duration-300 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-black hover:shadow-lg hover:shadow-[#3CDFFF]/20"
                >
                  Get Started
                </Link>
              </motion.div>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              key="enterprise"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative p-8 rounded-2xl backdrop-blur-xl border group hover:border-[#3CDFFF]/50 bg-white/5 border-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-[#3CDFFF]/20 to-[#4AFFD4]/20 group-hover:from-[#3CDFFF]/30 group-hover:to-[#4AFFD4]/30 transition-colors duration-300">
                  <HiOutlineCube className="w-8 h-8 text-[#3CDFFF]" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 text-center">Enterprise</h3>
              <div className="text-4xl font-bold mb-4 text-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4]">
                  {formatPrice(getPrice(BASE_PRICES.enterprise, enterpriseCredits))}
                </span>
                {annualBilling && (
                  <span className="text-sm text-white/60 ml-2">per month, billed annually</span>
                )}
              </div>
              <p className="text-white/80 mb-8 text-center h-12">For organizations with advanced needs</p>

              {/* Credit Slider */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-white/60 mb-2">
                  <span>Credits: {enterpriseCredits}</span>
                  <span>€{(enterpriseCredits * CREDIT_COST).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={CREDIT_RANGES.enterprise.min}
                  max={CREDIT_RANGES.enterprise.max}
                  step="500"
                  value={enterpriseCredits}
                  onChange={handleEnterpriseCreditsChange}
                  className="pricing-slider w-full h-2 bg-[#3CDFFF]/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>{CREDIT_RANGES.enterprise.min}</span>
                  <span>{CREDIT_RANGES.enterprise.max}</span>
                </div>
              </div>

              {/* Feature List */}
              <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10">
                <ul className="space-y-3">
                  {planFeatures['enterprise']?.map((feature, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start ${
                        feature.highlight 
                          ? 'text-white font-medium text-lg my-3' 
                          : feature.included 
                            ? feature.extra 
                              ? 'text-[#4AFFD4]' 
                              : 'text-white/80'
                            : 'text-white/40'
                      }`}
                    >
                      {!feature.highlight && (
                        <svg
                          className={`w-5 h-5 mr-3 mt-0.5 ${
                            feature.included ? 'text-[#4AFFD4]' : 'text-[#3CDFFF]/40'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={feature.included ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}
                          />
                        </svg>
                      )}
                      <span>
                        {feature.name}
                        {feature.limit && (
                          <span className="block text-xs text-white/60 mt-0.5">{feature.limit}</span>
                        )}
                        {feature.retention && (
                          <span className="block text-xs text-white/60 mt-0.5">Retention: {feature.retention}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/contact?topic=enterprise"
                  className="block w-full py-4 px-6 rounded-xl text-center font-medium transition-all duration-300 bg-gradient-to-r from-[#3CDFFF]/20 to-[#4AFFD4]/20 text-white hover:from-[#3CDFFF]/30 hover:to-[#4AFFD4]/30"
                >
                  Contact Sales
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Credits Breakdown */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#E5E7EB]">How Credits Work</h2>
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
                          Cost (€)
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E5E7EB]">
                            €{(item.credits * CREDIT_COST).toFixed(2)}
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
                <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">Flexible Credit System</h3>
                <p className="text-sm text-[#9CA3AF] mb-4">
                  Each credit costs €0.07. You can adjust the number of credits in your plan with the slider to fit your exact needs.
                </p>
                <div className="bg-[#1F2937] p-4 rounded-md">
                  <div className="flex justify-between mb-2">
                    <span className="text-[#9CA3AF]">Base price + Credits</span>
                    <span className="text-[#E5E7EB] font-medium">=</span>
                    <span className="text-[#E5E7EB] font-medium">Total Monthly Price</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[#9CA3AF]">€59 + (1,000 × €0.07)</span>
                    <span className="text-[#E5E7EB] font-medium">=</span>
                    <span className="text-[#E5E7EB] font-medium">€129 /month</span>
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-2">
                    * You can adjust your credit allocation at any time
                  </div>
                </div>
              </div>
              
              <div className="bg-[#18181B] border border-[#374151] rounded-lg p-6">
                <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">What You Can Do With Credits</h3>
                <p className="text-sm text-[#9CA3AF] mb-4">
                  Here's what you can accomplish with 1,000 credits:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-[#22D3EE] mr-2" />
                    <span className="text-[#E5E7EB]">Run 1,000 standard workflows (1 credit each)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-[#22D3EE] mr-2" />
                    <span className="text-[#E5E7EB]">Process 200 voice commands (5 credits each)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-[#22D3EE] mr-2" />
                    <span className="text-[#E5E7EB]">Make 500 API calls (2 credits each)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-[#22D3EE] mr-2" />
                    <span className="text-[#E5E7EB]">Process 100 GB of data (10 credits per GB)</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-[#18181B] border border-[#374151] rounded-lg p-6">
                <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">Annual Discount</h3>
                <p className="text-sm text-[#9CA3AF] mb-4">
                  Save 20% on your entire plan when you choose annual billing.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-[#22D3EE] mt-0.5 mr-2" />
                    <span className="text-[#E5E7EB]">Applied to both base price and credits</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-[#22D3EE] mt-0.5 mr-2" />
                    <span className="text-[#E5E7EB]">Predictable yearly billing</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-[#22D3EE] mt-0.5 mr-2" />
                    <span className="text-[#E5E7EB]">Credits are allocated monthly</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-[#22D3EE] mt-0.5 mr-2" />
                    <span className="text-[#E5E7EB]">Unused credits roll over for 90 days</span>
                  </div>
                </div>
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
                    <QuestionMarkCircleIcon className="h-5 w-5 text-[#22D3EE] mt-0.5 mr-2 flex-shrink-0" />
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