'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlineLockClosed,
  HiOutlineScale,
  HiOutlineUserGroup,
  HiOutlineChartBar
} from 'react-icons/hi';

const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false, loading: () => (props: any) => <div {...props} /> });

export default function EnsureComplianceSecurityPage() {
  // Features data
  const features = [
    {
      title: "Security Assessment",
      description: "Comprehensive evaluation of your security infrastructure and practices.",
      icon: <HiOutlineShieldCheck className="w-8 h-8" />
    },
    {
      title: "Compliance Audit",
      description: "Detailed review of your compliance with relevant regulations and standards.",
      icon: <HiOutlineDocumentText className="w-8 h-8" />
    },
    {
      title: "Data Protection",
      description: "Assessment of data handling practices and protection measures.",
      icon: <HiOutlineLockClosed className="w-8 h-8" />
    },
    {
      title: "Regulatory Compliance",
      description: "Evaluation of compliance with GDPR, HIPAA, CCPA, and other regulations.",
      icon: <HiOutlineScale className="w-8 h-8" />
    },
    {
      title: "Access Control",
      description: "Review of user access controls and authentication mechanisms.",
      icon: <HiOutlineUserGroup className="w-8 h-8" />
    },
    {
      title: "Risk Management",
      description: "Identification and assessment of potential security risks.",
      icon: <HiOutlineChartBar className="w-8 h-8" />
    }
  ];

  // Process steps
  const processSteps = [
    {
      title: "Initial Assessment",
      description: "Comprehensive review of your current security and compliance status."
    },
    {
      title: "Gap Analysis",
      description: "Identification of gaps in security and compliance requirements."
    },
    {
      title: "Risk Assessment",
      description: "Evaluation of potential security risks and vulnerabilities."
    },
    {
      title: "Recommendations",
      description: "Detailed recommendations for improving security and compliance."
    }
  ];

  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(to bottom, #000000, #0A0A0A)' }}>
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute w-[400px] h-[400px] rounded-full left-1/4 top-1/4 bg-[#3CDFFF] opacity-10 blur-[120px]"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full right-1/4 bottom-1/3 bg-[#4AFFD4] opacity-10 blur-[120px]"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight">
              Ensure Compliance &{" "}
              <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">
                Security
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Comprehensive assessment of legal risks and data security concerns to protect your business.
            </p>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/contact" 
                className="px-8 py-3 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-xl text-black text-lg font-semibold hover:opacity-90 transition-all duration-300"
              >
                Schedule Assessment
              </Link>
              <Link 
                href="#process" 
                className="px-8 py-3 border-2 border-[#3CDFFF] text-[#3CDFFF] rounded-xl text-lg font-semibold hover:bg-[#3CDFFF]/10 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Comprehensive Security & Compliance Services
            </h2>
            <p className="text-lg text-gray-300">
              Our expert team provides thorough evaluation of your security measures and compliance status.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <MotionDiv
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
              </MotionDiv>
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
              Our Assessment Process
            </h2>
            <p className="text-lg text-gray-300">
              A systematic approach to evaluating and improving your security and compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <MotionDiv
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
              </MotionDiv>
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
          <MotionDiv 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Ready to Secure Your{" "}
              <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">
                Business?
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Let our experts help you identify and address security and compliance concerns.
            </p>
            
            <Link 
              href="/contact" 
              className="inline-block px-10 py-4 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-xl text-black text-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Schedule Your Assessment
            </Link>
          </MotionDiv>
        </div>
      </section>
    </div>
  );
} 