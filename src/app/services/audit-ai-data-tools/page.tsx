'use client';

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

// Force dynamic rendering to avoid static generation issues with React version conflicts


import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HiOutlineChartBar,
  HiOutlineCode,
  HiOutlineDocumentReport,
  HiOutlineLightningBolt,
  HiOutlineSearchCircle,
  HiOutlineShieldCheck
} from 'react-icons/hi';
import { MotionWrapper } from '@/components/MotionWrapper';

export default function AuditAIDataToolsPage(): JSX.Element {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Features data
  const features = [
    { title: "Comprehensive AI Assessment",
      description: "In-depth evaluation of your AI systems, algorithms, and data pipelines to identify optimization opportunities.",
      icon: <HiOutlineSearchCircle className="w-8 h-8" />
        },
    { title: "Performance Analytics",
      description: "Detailed analysis of model performance, resource utilization, and cost efficiency.",
      icon: <HiOutlineChartBar className="w-8 h-8" />
        },
    { title: "Security Audit",
      description: "Thorough security assessment of your AI infrastructure and data handling practices.",
      icon: <HiOutlineShieldCheck className="w-8 h-8" />
        },
    { title: "Code Review",
      description: "Expert review of your AI implementation code for best practices and optimization.",
      icon: <HiOutlineCode className="w-8 h-8" />
        },
    { title: "Infrastructure Optimization",
      description: "Recommendations for improving your AI infrastructure and deployment pipeline.",
      icon: <HiOutlineLightningBolt className="w-8 h-8" />
        },
    { title: "Detailed Reporting",
      description: "Comprehensive reports with actionable insights and improvement recommendations.",
      icon: <HiOutlineDocumentReport className="w-8 h-8" />
        }
  ];

  // Process steps
  const processSteps = [
    { title: "Initial Assessment",
      description: "We begin with a thorough analysis of your current AI systems and data infrastructure."
        },
    { title: "Deep Dive Analysis",
      description: "Our experts perform detailed technical reviews and performance testing."
        },
    { title: "Security Review",
      description: "Comprehensive security assessment of your AI systems and data handling."
        },
    { title: "Recommendations",
      description: "Detailed report with actionable insights and improvement strategies."
        }
  ];

  // Only render the full content on the client side to avoid React version conflicts
  if (!isClient) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center" style={{ background: 'linear-gradient(to bottom, #000000, #0A0A0A)' }}>
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-64 bg-gray-700 rounded mb-4"></div>
          <div className="h-6 w-96 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(to bottom, #000000, #0A0A0A)' }}>
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute w-[400px] h-[400px] rounded-full left-1/4 top-1/4 bg-[#3CDFFF] opacity-10 blur-[120px]"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full right-1/4 bottom-1/3 bg-[#4AFFD4] opacity-10 blur-[120px]"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <MotionWrapper
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight">
              Audit AI & Data{" "}
              <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">
                Tools
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Expert evaluation of your AI tools and data infrastructure to ensure optimal performance, security, and ROI.
            </p>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/contact" 
                className="px-8 py-3 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-xl text-black text-lg font-semibold hover:opacity-90 transition-all duration-300"
              >
                Schedule Audit
              </Link>
              <Link 
                href="#process" 
                className="px-8 py-3 border-2 border-[#3CDFFF] text-[#3CDFFF] rounded-xl text-lg font-semibold hover:bg-[#3CDFFF]/10 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Comprehensive Audit Services
            </h2>
            <p className="text-lg text-gray-300">
              Our expert team provides thorough evaluation of your AI systems and data infrastructure to identify opportunities for improvement.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <MotionWrapper
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="feature-card p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:border-[#3CDFFF]/30 transition-all duration-300"
              >
                <div className="text-[#3CDFFF] mb-4">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#3CDFFF]/5 to-black"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Our Audit Process
            </h2>
            <p className="text-lg text-gray-300">
              A systematic approach to evaluating and improving your AI systems and data infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <MotionWrapper
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 relative overflow-hidden group hover:border-[#3CDFFF]/30 transition-all duration-300"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-[#3CDFFF] opacity-10 blur-xl group-hover:opacity-20 transition-all duration-500"></div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-[#3CDFFF]/20 flex items-center justify-center mb-4 text-[#3CDFFF] text-xl font-bold">
                    {index + 1}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#3CDFFF]/5 to-[#4AFFD4]/5"></div>
        <div className="absolute w-[600px] h-[600px] rounded-full left-1/4 -top-1/2 bg-[#3CDFFF] opacity-10 blur-[120px]"></div>
        <div className="absolute w-[600px] h-[600px] rounded-full right-1/4 -bottom-1/2 bg-[#4AFFD4] opacity-10 blur-[120px]"></div>
        
        <div className="container mx-auto px-4 relative">
          <MotionWrapper 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Ready to Optimize Your{" "}
              <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">
                AI Systems?
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Let our experts help you identify opportunities for improvement and optimization in your AI infrastructure.
            </p>
            
            <Link 
              href="/contact" 
              className="inline-block px-10 py-4 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-xl text-black text-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Schedule Your Audit
            </Link>
          </MotionWrapper>
        </div>
      </section>
    </div>
  );
} 