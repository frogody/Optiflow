'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useUserStore } from '@/lib/userStore';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { HiOutlineChartBar, HiOutlineCog, HiOutlineLightningBolt } from 'react-icons/hi';
import DemoModal from '@/components/DemoModal';

interface WorkflowNode {
  id: string;
  type: string;
  title?: string;
  description?: string;
  display_name?: string;
  edges: {
    target_node_id: string;
    edge_type: string;
  }[];
  parameters?: Record<string, any>;
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
}

interface ReportCard {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function LandingPage() {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Report cards
  const reportCards: ReportCard[] = [
    {
      title: "Automated Workflow Builder",
      description: "Create powerful automated workflows connecting your favorite apps and services.",
      icon: <HiOutlineCog className="w-5 h-5" />
    },
    {
      title: "API Integration Hub",
      description: "Connect and manage all your business tools in one centralized platform.",
      icon: <HiOutlineLightningBolt className="w-5 h-5" />
    },
    {
      title: "Workflow Analytics",
      description: "Track performance and optimize your automation workflows with detailed insights.",
      icon: <HiOutlineChartBar className="w-5 h-5" />
    },
    {
      title: "Latest Integrations",
      description: "New connections to HubSpot, Gmail, n8n and more added this month.",
      icon: <FaArrowUpRightFromSquare className="w-4 h-4" />
    },
    {
      title: "Command-Driven Automation",
      description: "Tell the orchestrator what you need in plain language and watch it configure your workflows.",
      icon: <HiOutlineLightningBolt className="w-5 h-5" />
    }
  ];

  // Handle CTA click
  const handleCTAClick = () => {
    if (currentUser) {
      router.push('/dashboard');
    } else {
      router.push('/signup');
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-white" style={{ background: 'linear-gradient(to bottom, #000000, #0A0A0A)' }}>
      {/* Hero Section */}
      <section className="flex-1 relative flex flex-col items-center justify-center pt-16 md:pt-20 pb-24 md:pb-32 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute w-[200px] md:w-[300px] h-[200px] md:h-[300px] rounded-full left-1/4 top-1/4 bg-[#3CDFFF] opacity-10 blur-[100px]"></div>
        <div className="absolute w-[200px] md:w-[300px] h-[200px] md:h-[300px] rounded-full right-1/4 bottom-1/3 bg-[#4AFFD4] opacity-10 blur-[100px]"></div>
        
        {/* Main Hero Content */}
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-sm md:text-base text-[#3CDFFF] mt-2 mb-1 font-light"
            >
              Coming Soon
            </motion.p>
            
            <motion.h2 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.7, type: "spring", stiffness: 100 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-wide text-gradient bg-clip-text text-transparent bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4]"
            >
              Optiflow
            </motion.h2>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6">
              The <span className="text-gradient">Automation Platform</span> For Your Workflow
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 md:mb-10 max-w-3xl mx-auto">
              Connect your favorite tools, automate your workflows, and boost productivity with our powerful orchestration platform.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-4">
              <button
                onClick={handleCTAClick}
                className="w-full sm:w-auto px-6 py-3 md:py-4 text-base font-medium bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-lg text-black hover:opacity-90 transition-opacity"
              >
                Join Waitlist
              </button>
              
              <button
                onClick={() => setShowDemoModal(true)}
                className="mt-3 sm:mt-0 w-full sm:w-auto px-6 py-3 md:py-4 text-center border border-[#3CDFFF] text-[#3CDFFF] rounded-lg hover:bg-[#3CDFFF]/10 transition-all"
              >
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Report Cards Section - Mobile optimized */}
      <section className="container mx-auto px-4 pb-20 md:pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {reportCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className={`feature-card p-5 md:p-6 relative ${index === 2 ? 'sm:col-span-2 md:row-span-2' : ''}`}
              style={index === 2 ? { background: 'rgba(10, 25, 47, 0.7)' } : {}}
            >
              <div className="absolute right-3 top-3 w-8 h-8 rounded-full bg-[#3CDFFF]/20 flex items-center justify-center text-[#3CDFFF]">
                {card.icon}
              </div>
              
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 pr-8">{card.title}</h3>
              <p className="text-sm md:text-base text-gray-300">{card.description}</p>
              
              {index === 2 && (
                <Link 
                  href="#analytics" 
                  className="inline-flex items-center mt-4 text-[#3CDFFF] text-sm md:text-base touch-manipulation"
                >
                  <span className="py-1">View analytics</span> <FaArrowUpRightFromSquare className="ml-1 w-3 h-3" />
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Features Section - Mobile optimized */}
      <section className="bg-black/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">
                  Connect <span className="text-[#3CDFFF]">Everything</span> in One Place
                </h2>
                
                <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6">
                  Our platform lets you connect and automate your favorite tools and services with just a few clicks. No coding required.
                </p>
                
                <ul className="space-y-3 md:space-y-4">
                  {[
                    'Command-driven workflow orchestration',
                    'Connect to HubSpot, Gmail, n8n, and more',
                    'Real-time monitoring and analytics',
                    'Easy-to-use visual workflow builder'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2 mt-1 text-[#4AFFD4] text-lg">✓</span>
                      <span className="text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 md:mt-8">
                  <Link 
                    href="#integrations" 
                    className="inline-block w-full sm:w-auto px-6 py-3 text-center text-base font-medium bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-lg text-black hover:opacity-90 transition-opacity touch-manipulation"
                  >
                    Browse Integrations
                  </Link>
                </div>
              </div>
              
              <div className="relative mt-8 md:mt-0">
                <div className="absolute -inset-4 bg-[#3CDFFF]/10 rounded-lg blur-lg"></div>
                <div className="feature-card p-4 md:p-6 h-full relative">
                  <h3 className="text-lg md:text-xl font-semibold mb-4 text-[#3CDFFF]">Popular Connections</h3>
                  
                  <div className="space-y-4 md:space-y-6">
                    {[
                      { name: 'HubSpot', desc: 'CRM and marketing automation' },
                      { name: 'Gmail', desc: 'Email communication management' },
                      { name: 'n8n', desc: 'Workflow automation and integration' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-8 h-8 mr-4 rounded-full bg-[#3CDFFF]/20 flex items-center justify-center text-[#3CDFFF]">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm md:text-base">{item.name}</div>
                          <div className="text-gray-300 text-xs md:text-sm">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Demo Modal */}
      <DemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
    </div>
  );
} 