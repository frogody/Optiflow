'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';
import { HiOutlineCube, HiOutlineSparkles, HiOutlineLightningBolt } from 'react-icons/hi';

// Interface for integration items
interface Integration {
  name: string;
  category: string;
  description: string;
  icon: string;
  popular: boolean;
}

// Enhanced floating particle component
const FloatingParticle = ({ delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ 
        opacity: [0.1, 0.3, 0.1],
        y: [-20, 0, -20],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute"
      style={{
        width: '2px',
        height: '2px',
        background: 'radial-gradient(circle at center, #1E90FF, #00BFFF)',
        boxShadow: '0 0 8px #1E90FF',
        borderRadius: '50%',
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        willChange: 'transform, opacity',
      }}
    />
  );
};

// Enhanced aurora effect component
const AuroraEffect = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 overflow-hidden"
    >
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: {
            duration: 50,
            repeat: Infinity,
            ease: "linear"
          },
          scale: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2"
        style={{
          background: 'conic-gradient(from 0deg at 50% 50%, transparent, rgba(60,223,255,0.1), rgba(74,255,212,0.1), transparent)',
          filter: 'blur(100px)',
        }}
      />
    </motion.div>
  );
};

// Enhanced gradient orb component
const GradientOrb = ({ delay = 0, size = 600, color = 'blue' }) => {
  const gradients = {
    blue: 'from-[#3CDFFF]/20 to-[#4AFFD4]/20',
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
      animate={{
        opacity: [0.1, 0.2, 0.1],
        scale: [1, 1.2, 1],
        x: [0, Math.random() * 100 - 50, 0],
        y: [0, Math.random() * 100 - 50, 0],
        rotate: [0, Math.random() * 90 - 45, 0],
      }}
      transition={{
        duration: Math.random() * 5 + 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
    />
  );
};

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  
  // Categories with icons
  const categories = [
    { name: 'All', icon: HiOutlineCube },
    { name: 'CRM', icon: HiOutlineSparkles },
    { name: 'Marketing', icon: HiOutlineLightningBolt },
    { name: 'Communication', icon: HiOutlineCube },
    { name: 'Productivity', icon: HiOutlineSparkles },
    { name: 'Development', icon: HiOutlineLightningBolt },
    { name: 'Finance', icon: HiOutlineCube },
    { name: 'Analytics', icon: HiOutlineSparkles },
    { name: 'Social Media', icon: HiOutlineLightningBolt }
  ];
  
  // Mock integrations data
  const integrations: Integration[] = [
    {
      name: 'Slack',
      category: 'Communication',
      description: 'Connect your workflow with Slack channels and messages.',
      icon: '/icons/slack.svg',
      popular: true
    },
    {
      name: 'Gmail',
      category: 'Communication',
      description: 'Automate email communication and notifications.',
      icon: '/icons/gmail.svg',
      popular: true
    },
    {
      name: 'HubSpot',
      category: 'CRM',
      description: 'Sync customer data and automate CRM workflows.',
      icon: '/icons/hubspot.svg',
      popular: true
    },
    {
      name: 'Google Sheets',
      category: 'Productivity',
      description: 'Automate data entry and reporting in spreadsheets.',
      icon: '/icons/sheets.svg',
      popular: true
    },
    {
      name: 'Zapier',
      category: 'Development',
      description: 'Connect with thousands of apps through Zapier.',
      icon: '/icons/zapier.svg',
      popular: true
    },
    {
      name: 'Stripe',
      category: 'Finance',
      description: 'Automate payment processing and financial workflows.',
      icon: '/icons/stripe.svg',
      popular: true
    },
    {
      name: 'Asana',
      category: 'Productivity',
      description: 'Streamline task management and project workflows.',
      icon: '/icons/asana.svg',
      popular: true
    },
    {
      name: 'GitHub',
      category: 'Development',
      description: 'Automate development workflows and code reviews.',
      icon: '/icons/github.svg',
      popular: true
    },
    {
      name: 'QuickBooks',
      category: 'Finance',
      description: 'Connect accounting data with your automation workflows.',
      icon: '/icons/quickbooks.svg',
      popular: true
    },
    {
      name: 'Mailchimp',
      category: 'Marketing',
      description: 'Automate email marketing campaigns and subscriber management.',
      icon: '/icons/mailchimp.svg',
      popular: true
    },
    {
      name: 'Salesforce',
      category: 'CRM',
      description: 'Connect your CRM data with other business tools.',
      icon: '/icons/salesforce.svg',
      popular: true
    },
    {
      name: 'Google Analytics',
      category: 'Analytics',
      description: 'Automate reporting and data collection for web analytics.',
      icon: '/icons/analytics.svg',
      popular: true
    },
    {
      name: 'Twitter',
      category: 'Social Media',
      description: 'Schedule posts and monitor engagement automatically.',
      icon: '/icons/twitter.svg',
      popular: true
    },
    {
      name: 'Trello',
      category: 'Productivity',
      description: 'Automate board updates and task management.',
      icon: '/icons/trello.svg',
      popular: true
    },
    {
      name: 'Dropbox',
      category: 'Productivity',
      description: 'Automate file management and document workflows.',
      icon: '/icons/dropbox.svg',
      popular: true
    }
  ];
  
  // Filter integrations by search query and category
  const filteredIntegrations = integrations.filter(integration => {
    const matchesQuery = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || integration.category === selectedCategory;
    
    return matchesQuery && matchesCategory;
  });
  
  // Group popular integrations
  const popularIntegrations = integrations.filter(integration => integration.popular);
  
  // Generate particles
  const particles = Array.from({ length: 50 }).map((_, i) => (
    <FloatingParticle key={i} delay={i * 0.1} />
  ));

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
            color={i % 3 === 0 ? 'blue' : i % 3 === 1 ? 'purple' : 'mixed'}
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
              animate={{
                x: [-1000, 1000],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: i * 1,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Floating Particles */}
      <AnimatePresence>
        {isMounted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-1"
          >
            {particles}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Enhanced Glow Effects */}
        <motion.div 
          animate={{
            opacity: [0.05, 0.15, 0.05],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-[1400px] h-[1400px] rounded-full left-1/4 top-1/4 bg-gradient-to-r from-[#3CDFFF]/20 to-[#4AFFD4]/20 blur-[200px]"
          style={{ 
            willChange: 'transform, opacity',
          }}
        />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="inline-block mb-8"
            >
              <span className="px-6 py-2 rounded-full bg-gradient-to-r from-[#3CDFFF]/10 to-[#4AFFD4]/10 border border-[#3CDFFF]/20 text-[#3CDFFF] text-sm font-medium backdrop-blur-sm">
                Seamless Integration Hub
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#3CDFFF] to-white bg-300% animate-gradient">
                700+ Integrations
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#3CDFFF] via-[#4AFFD4] to-[#3CDFFF] text-transparent bg-clip-text animate-gradient bg-300%">
                One Platform
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-[#3CDFFF]/90 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              Connect and automate your entire tech stack with our powerful integration platform.
            </motion.p>

            {/* Enhanced Search Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="relative max-w-xl mx-auto group"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-[#3CDFFF]" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-4 rounded-full bg-white/5 backdrop-blur-xl border border-[#3CDFFF]/20 text-white placeholder-[#3CDFFF]/50 focus:outline-none focus:ring-2 focus:ring-[#3CDFFF]/50 focus:border-transparent transition-all duration-300 group-hover:border-[#3CDFFF]/40"
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <motion.div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle at center, rgba(60,223,255,0.1), transparent)',
                  filter: 'blur(10px)',
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === category.name
                      ? 'bg-gradient-to-r from-[#3CDFFF]/20 to-[#4AFFD4]/20 text-[#3CDFFF] border border-[#3CDFFF]/30'
                      : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:border-[#3CDFFF]/20'
                  }`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </section>
      
      {/* Popular Integrations Section */}
      {searchQuery === '' && selectedCategory === 'All' && (
        <section className="py-16 relative z-10">
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-3xl font-bold mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Most Popular Integrations
            </motion.h2>
            
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.1 }}
            >
              {popularIntegrations.map((integration, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl hover:border-[#3CDFFF]/30 transition-all duration-300"
                >
                  <motion.div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(60,223,255,0.1), transparent)',
                      filter: 'blur(10px)',
                    }}
                  />
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#3CDFFF]/20 to-[#4AFFD4]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src={integration.icon}
                        alt={integration.name}
                        width={32}
                        height={32}
                        className="w-8 h-8"
                      />
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-1 text-center">{integration.name}</h3>
                    <p className="text-sm text-[#3CDFFF]/70 text-center">{integration.category}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}
      
      {/* All Integrations Grid */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
          >
            {filteredIntegrations.length > 0 ? (
              filteredIntegrations.map((integration, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl hover:border-[#3CDFFF]/30 transition-all duration-300"
                >
                  <motion.div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(60,223,255,0.1), transparent)',
                      filter: 'blur(10px)',
                    }}
                  />
                  
                  <div className="relative z-10">
                    <div className="flex items-start">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3CDFFF]/20 to-[#4AFFD4]/20 flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Image
                          src={integration.icon}
                          alt={integration.name}
                          width={32}
                          height={32}
                          className="w-8 h-8"
                        />
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{integration.name}</h3>
                        <p className="text-sm text-[#3CDFFF]/70 mb-3">{integration.category}</p>
                        <p className="text-gray-300">{integration.description}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <Link
                        href={`/integrations/${integration.name.toLowerCase()}`}
                        className="inline-flex items-center text-sm text-[#3CDFFF] hover:text-[#4AFFD4] transition-colors duration-300"
                      >
                        Learn more
                        <motion.span
                          className="ml-2"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="col-span-full text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-2xl text-gray-400 mb-6">No integrations found matching your criteria.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-[#3CDFFF]/20 to-[#4AFFD4]/20 rounded-full text-[#3CDFFF] border border-[#3CDFFF]/30 hover:border-[#3CDFFF]/50 transition-all duration-300"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                >
                  Clear filters
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* Enhanced CTA Section */}
      <section className="py-32 relative z-10 overflow-hidden">
        <motion.div 
          animate={{
            opacity: [0.02, 0.08, 0.02],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-[800px] h-[800px] rounded-full left-1/4 -top-1/2 bg-[#3CDFFF] opacity-5 blur-[200px]"
        />
        
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#3CDFFF]/10 to-[#4AFFD4]/10 backdrop-blur-xl" />
              <div className="relative p-12 text-center">
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold mb-6"
                  animate={{ 
                    textShadow: [
                      "0 0 20px rgba(60,223,255, 0)",
                      "0 0 20px rgba(60,223,255, 0.2)",
                      "0 0 20px rgba(60,223,255, 0)"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Need a Custom Integration?
                </motion.h2>
                
                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                  Our team of experts can build custom integrations tailored to your specific business needs.
                </p>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/contact" 
                    className="inline-block px-10 py-4 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-full text-black text-lg font-semibold hover:opacity-90 transition-all duration-300 transform relative overflow-hidden group"
                  >
                    <span className="relative z-10">Get Started</span>
                    <motion.div 
                      className="absolute inset-0 bg-black"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(60,223,255,0.2), transparent)',
                        filter: 'blur(15px)',
                      }}
                    />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 