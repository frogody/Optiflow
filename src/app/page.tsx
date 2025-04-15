'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useUserStore } from '@/lib/userStore';
import { motion } from 'framer-motion';

interface Orchestrator {
  id: string;
  name: string;
  icon: string;
  description: string;
  features: string[];
  benefits: string[];
}

interface Metric {
  value: string;
  label: string;
  icon: string;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
}

interface Integration {
  name: string;
  icon: string;
  category: string;
}

export default function Home() {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const [activeTab, setActiveTab] = useState('prospect');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const metrics: Metric[] = [
    { 
      value: '85%', 
      label: 'Increase in qualified leads',
      icon: '/icons/chart-up.svg'
    },
    { 
      value: '60%', 
      label: 'Faster deal closure',
      icon: '/icons/speed.svg'
    },
    { 
      value: '40%', 
      label: 'Reduction in churn',
      icon: '/icons/shield.svg'
    },
    { 
      value: '3x', 
      label: 'ROI improvement',
      icon: '/icons/money.svg'
    },
  ];

  const testimonials: Testimonial[] = [
    {
      name: 'Sarah Johnson',
      role: 'VP of Sales',
      company: 'TechCorp',
      image: '/testimonials/sarah.jpg',
      quote: 'ISYNCSO has transformed our sales process. We\'ve seen a dramatic increase in qualified leads and our sales team is closing deals faster than ever.'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Growth',
      company: 'ScaleUp Inc',
      image: '/testimonials/michael.jpg',
      quote: 'The AI-powered insights have been game-changing for our expansion strategy. We\'re now able to identify and capitalize on opportunities we would have missed.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Customer Success Director',
      company: 'CloudServe',
      image: '/testimonials/emily.jpg',
      quote: 'PEAK and LAUNCH have revolutionized our onboarding process. Customer satisfaction is at an all-time high, and churn has decreased significantly.'
    }
  ];

  const integrations: Integration[] = [
    { name: 'Salesforce', icon: '/icons/salesforce.svg', category: 'CRM' },
    { name: 'HubSpot', icon: '/icons/hubspot.svg', category: 'Marketing' },
    { name: 'Slack', icon: '/icons/slack.svg', category: 'Communication' },
    { name: 'Zoom', icon: '/icons/zoom.svg', category: 'Meetings' },
    { name: 'LinkedIn', icon: '/icons/linkedin.svg', category: 'Social' },
    { name: 'Gmail', icon: '/icons/gmail.svg', category: 'Email' },
    { name: 'Outlook', icon: '/icons/outlook.svg', category: 'Email' },
    { name: 'Zendesk', icon: '/icons/zendesk.svg', category: 'Support' }
  ];

  const orchestrators: Orchestrator[] = [
    {
      id: 'aora',
      name: 'AORA',
      icon: '/orchestrators/aora.png',
      description: 'Finds prospects and books your demos automatically. AORA searches for potential customers, maps out decision-makers, and fills your CRM with accurate, verified insights.',
      features: [
        'AI-powered prospect identification',
        'Automated email outreach',
        'Decision-maker mapping',
        'CRM integration & enrichment'
      ],
      benefits: [
        'Reduce prospecting time by 75%',
        'Increase qualified lead generation',
        'Improve data accuracy',
        'Automate manual research'
      ]
    },
    {
      id: 'nova',
      name: 'NOVA',
      icon: '/icons/nova.svg',
      description: 'Finds opportunities and prevents customer loss. NOVA monitors how customers use your product, spots growth opportunities, and predicts when someone might leave.',
      features: [
        'Usage pattern analysis',
        'Churn prediction',
        'Growth opportunity detection',
        'Real-time alerts'
      ],
      benefits: []
    },
    {
      id: 'close',
      name: 'CLOSE',
      icon: '/orchestrators/close.PNG',
      description: 'Closes deals faster with smarter communication. CLOSE analyzes how prospects interact, spots buying signals, and gives your team real-time advice.',
      features: [
        'Interaction analysis',
        'Buying signal detection',
        'Smart response suggestions',
        'Deal progress tracking'
      ],
      benefits: []
    },
    {
      id: 'peak',
      name: 'PEAK',
      icon: '/icons/peak.svg',
      description: 'Keeps your customers happy and growing. PEAK analyzes usage patterns, predicts growth potential, and creates tailored success plans.',
      features: [
        'Success plan automation',
        'Growth forecasting',
        'Usage optimization',
        'Customer health scoring'
      ],
      benefits: []
    },
    {
      id: 'launch',
      name: 'LAUNCH',
      icon: '/icons/launch.svg',
      description: 'Gets new customers up and running quickly. LAUNCH builds customized onboarding plans, handles technical setup, and delivers training resources.',
      features: [
        'Personalized onboarding',
        'Technical setup automation',
        'Training resource delivery',
        'Progress tracking'
      ],
      benefits: []
    },
    {
      id: 'expand',
      name: 'EXPAND',
      icon: '/icons/expand.svg',
      description: 'Helps you expand with confidence. EXPAND analyzes market trends, studies competitors, and recognizes patterns of success.',
      features: [
        'Market trend analysis',
        'Competitor monitoring',
        'Success pattern recognition',
        'Expansion recommendations'
      ],
      benefits: []
    }
  ];

  const handleOrchestratorClick = (id: string) => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    router.push(`/orchestrators/${id}`);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-6 h-6 relative">
                  <Image
                    src="/ISYNCSO_LOGO.png"
                    alt="ISYNCSO"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="text-white text-lg">ISYNCSO</span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/flows" className="text-white/80 hover:text-white transition-colors">
                Flows
              </Link>
              <Link href="/connections" className="text-white/80 hover:text-white transition-colors">
                Connections
              </Link>
              <Link href="/pricing" className="text-white/80 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/faq" className="text-white/80 hover:text-white transition-colors">
                FAQ
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link 
                href="/login"
                className="text-white/80 hover:text-white transition-colors text-sm"
              >
                Login
              </Link>
              <Link 
                href="/signup"
                className="bg-[#3CDFFF] hover:bg-[#3CDFFF]/90 text-black text-sm px-3 py-1.5 rounded-md transition-colors"
              >
                Sign up
              </Link>
              <button className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white/5 text-white/80 hover:text-white transition-colors text-sm">
                <span>EN</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 mix-blend-multiply" />
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-white">Outperforming Human Prospecting with</span>
                <br />
                <span className="gradient-text">Unmatched Precision and Seamless Integration.</span>
              </h1>
              <p className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto mb-8">
                ISYNCSO helps you find, connect, and close deals with the right prospects automatically.
                Our AI-powered platform streamlines your entire sales process from prospecting to expansion.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-full hover:from-primary-dark hover:to-secondary-dark transition-all duration-200 shadow-glow"
                >
                  Get Started
                  <span className="ml-2">→</span>
                </Link>
                <Link
                  href="/waitlist"
                  className="inline-flex items-center px-6 py-3 text-base font-medium text-white rounded-full border border-white/10 hover:bg-white/5 transition-all duration-200"
                >
                  Join Waitlist
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Process Flow Section */}
        <div className="relative bg-white/5 border-y border-white/10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                How ISYNCSO Works
              </h2>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">
                Our intelligent orchestrators work together to automate your entire sales and customer success process.
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-full border border-white/10 p-1">
                {['prospect', 'engage', 'close', 'expand'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      activeTab === tab
                        ? 'bg-primary text-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative">
                <div className="aspect-video rounded-lg overflow-hidden border border-white/10 bg-white/5">
                  {/* Add animation/illustration based on activeTab */}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {activeTab === 'prospect' && 'Find Your Perfect Prospects'}
                  {activeTab === 'engage' && 'Engage with Intelligence'}
                  {activeTab === 'close' && 'Close Deals Faster'}
                  {activeTab === 'expand' && 'Grow Your Success'}
                </h3>
                <div className="space-y-4">
                  {/* Content based on activeTab */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="relative bg-gradient-to-b from-transparent to-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {metrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 relative">
                    <Image
                      src={metric.icon}
                      alt={metric.label}
                      layout="fill"
                      objectFit="contain"
                      className="text-primary"
                    />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{metric.value}</div>
                  <div className="text-white/60">{metric.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Orchestrators Section */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Complete Sales & Success Automation
              </h2>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">
                Six powerful orchestrators working in harmony to automate and optimize your entire customer journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orchestrators.map((orchestrator) => (
                <motion.div
                  key={orchestrator.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  className="flow-card p-6 rounded-lg cursor-pointer hover:border-white/10 hover:bg-white/5 transition-all duration-200"
                  onClick={() => handleOrchestratorClick(orchestrator.id)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 relative">
                      <Image
                        src={orchestrator.icon}
                        alt={orchestrator.name}
                        layout="fill"
                        objectFit="contain"
                        className="rounded"
                      />
                    </div>
                    <h2 className="text-xl font-semibold text-white">{orchestrator.name}</h2>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed mb-4">
                    {orchestrator.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Features</h4>
                      <ul className="space-y-2">
                        {orchestrator.features.map((feature, index) => (
                          <li key={index} className="text-white/60 text-sm flex items-center">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Benefits</h4>
                      <ul className="space-y-2">
                        {orchestrator.benefits.map((benefit, index) => (
                          <li key={index} className="text-white/60 text-sm flex items-center">
                            <span className="w-1.5 h-1.5 bg-secondary rounded-full mr-2"></span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="relative bg-white/5 border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Trusted by Industry Leaders
              </h2>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">
                See how companies are transforming their sales process with ISYNCSO.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  className="bg-white/5 rounded-lg p-6 border border-white/10"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 relative mr-4">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      <p className="text-white/60 text-sm">{testimonial.role}</p>
                      <p className="text-primary text-sm">{testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm italic">"{testimonial.quote}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Integrations Section */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Seamless Integrations
              </h2>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">
                Connect with your favorite tools and platforms for a unified workflow.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {integrations.map((integration, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 flex flex-col items-center justify-center hover:bg-white/10 transition-all duration-200"
                >
                  <div className="w-8 h-8 relative mb-2">
                    <Image
                      src={integration.icon}
                      alt={integration.name}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <p className="text-white/80 text-xs text-center">{integration.name}</p>
                  <p className="text-primary text-xs text-center">{integration.category}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative bg-gradient-to-r from-primary/20 to-secondary/20 border-t border-white/10">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Sales Process?
              </h2>
              <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
                Join the companies using ISYNCSO to automate their sales process and drive unprecedented growth.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-full hover:from-primary-dark hover:to-secondary-dark transition-all duration-200 shadow-glow"
                >
                  Start Your Free Trial
                  <span className="ml-2">→</span>
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center px-8 py-4 text-lg font-medium text-white rounded-full border border-white/10 hover:bg-white/5 transition-all duration-200"
                >
                  Request a Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 