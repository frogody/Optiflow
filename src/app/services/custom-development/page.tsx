'use client';

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';
// Disable cache to avoid static rendering issues
export const revalidate = 0;

// Force dynamic rendering to avoid static generation issues


import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HiOutlineChartBar,
  HiOutlineCode,
  HiOutlineCog,
  HiOutlineDocumentText,
  HiOutlineLightningBolt,
  HiOutlineUserGroup
} from 'react-icons/hi';
export default function CustomDevelopmentPage(): JSX.Element {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Features data
  const features = [
    { title: "Custom Integration",
      description: "Tailored integration solutions to connect your existing systems and workflows.",
      icon: <HiOutlineCode className="w-8 h-8" />
    },
    { title: "Workflow Automation",
      description: "Custom automation solutions to streamline your business processes.",
      icon: <HiOutlineCog className="w-8 h-8" />
    },
    { title: "Performance Optimization",
      description: "Optimization of your existing systems for better performance and efficiency.",
      icon: <HiOutlineLightningBolt className="w-8 h-8" />
    },
    { title: "Documentation",
      description: "Comprehensive documentation for your custom solutions.",
      icon: <HiOutlineDocumentText className="w-8 h-8" />
    },
    { title: "Team Training",
      description: "Training sessions to help your team make the most of the new solutions.",
      icon: <HiOutlineUserGroup className="w-8 h-8" />
    },
    { title: "Analytics & Reporting",
      description: "Custom analytics and reporting solutions for better insights.",
      icon: <HiOutlineChartBar className="w-8 h-8" />
    }
  ];

  // Process steps
  const processSteps = [
    { title: "Discovery",
      description: "Understanding your business needs and requirements." },
    { title: "Planning",
      description: "Creating a detailed plan for the custom solution." },
    { title: "Development",
      description: "Building and testing the custom solution." },
    { title: "Deployment",
      description: "Deploying the solution and providing support." }
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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight">
              Custom{" "}
              <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">
                Development
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Tailored integration and workflow solutions built specifically for your business needs.
            </p>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/contact" 
                className="px-8 py-3 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-xl text-black text-lg font-semibold hover:opacity-90 transition-all duration-300"
              >
                Start Project
              </Link>
              <Link 
                href="#process" 
                className="px-8 py-3 border-2 border-[#3CDFFF] text-[#3CDFFF] rounded-xl text-lg font-semibold hover:bg-[#3CDFFF]/10 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Custom Development Services
            </h2>
            <p className="text-lg text-gray-300">
              Our expert team provides tailored solutions to meet your specific business needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:border-[#3CDFFF]/30 transition-all duration-300"
              >
                <div className="text-[#3CDFFF] mb-4">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
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
              Our Development Process
            </h2>
            <p className="text-lg text-gray-300">
              A systematic approach to delivering custom solutions that meet your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div
                key={index}
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
              </div>
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
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Ready to Build Your{" "}
              <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">
                Custom Solution?
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Let our experts help you create a tailored solution that meets your specific business needs.
            </p>
            
            <Link 
              href="/contact" 
              className="inline-block px-10 py-4 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-xl text-black text-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Start Your Project
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 