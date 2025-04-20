'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  HiOutlineLightningBolt, 
  HiOutlineChartBar, 
  HiOutlineCog,
  HiOutlineServer,
  HiOutlineShieldCheck,
  HiOutlineDocumentReport
} from 'react-icons/hi';

export default function FeaturesPage() {
  // Features data
  const features = [
    {
      title: "Drag-and-Drop Workflow Builder",
      description: "Create automated workflows with our intuitive visual builder. No coding required.",
      icon: <HiOutlineCog className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-400"
    },
    {
      title: "700+ App Integrations",
      description: "Connect with all your favorite tools and services through our extensive library of pre-built integrations.",
      icon: <HiOutlineLightningBolt className="w-8 h-8" />,
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "Advanced Analytics Dashboard",
      description: "Monitor workflow performance, track success rates, and identify bottlenecks with detailed analytics.",
      icon: <HiOutlineChartBar className="w-8 h-8" />,
      color: "from-green-500 to-emerald-400"
    },
    {
      title: "API Management",
      description: "Streamline API connections with our built-in management tools. Test, monitor, and implement APIs with ease.",
      icon: <HiOutlineServer className="w-8 h-8" />,
      color: "from-orange-500 to-amber-400"
    },
    {
      title: "Enterprise-Grade Security",
      description: "Rest easy with SOC 2 compliance, end-to-end encryption, and advanced authorization controls.",
      icon: <HiOutlineShieldCheck className="w-8 h-8" />,
      color: "from-red-500 to-rose-400"
    },
    {
      title: "Automated Reporting",
      description: "Generate comprehensive reports on your workflows and share insights with stakeholders.",
      icon: <HiOutlineDocumentReport className="w-8 h-8" />,
      color: "from-teal-500 to-cyan-400"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(to bottom, #000000, #0A0A0A)' }}>
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute w-[300px] h-[300px] rounded-full left-1/4 top-1/4 bg-[#3CDFFF] opacity-10 blur-[100px]"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full right-1/4 bottom-1/3 bg-[#4AFFD4] opacity-10 blur-[100px]"></div>
        
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Powerful Features for <span className="text-gradient">Seamless Automation</span>
            </h1>
            
            <p className="text-lg text-gray-300 mb-10 max-w-3xl mx-auto">
              Discover how our platform can transform your workflow automation with these powerful capabilities.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="feature-card p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:border-[#3CDFFF]/30 transition-all duration-300"
              >
                <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-r ${feature.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                <div className="mb-4 text-[#3CDFFF]">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#3CDFFF]/5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Workflow?
            </h2>
            
            <p className="text-lg text-gray-300 mb-8">
              Join thousands of teams that use our platform to automate their work and boost productivity.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/signup" 
                className="px-8 py-3 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-lg text-black font-medium hover:opacity-90 transition-opacity"
              >
                Start Free Trial
              </Link>
              
              <Link 
                href="/pricing" 
                className="px-8 py-3 border border-[#3CDFFF] text-[#3CDFFF] rounded-lg hover:bg-[#3CDFFF]/10 transition-all"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 