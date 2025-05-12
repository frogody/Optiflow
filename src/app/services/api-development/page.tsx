'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// Import each icon individually from react-icons/hi
import { HiOutlineCode } from 'react-icons/hi';
import { HiOutlineCog } from 'react-icons/hi';
import { HiOutlineLightningBolt } from 'react-icons/hi';
import { HiOutlineShieldCheck } from 'react-icons/hi';
import { HiOutlineChartBar } from 'react-icons/hi';
import { HiOutlineRefresh } from 'react-icons/hi';

// Import each icon individually from react-icons/si
import { SiOpenapi } from 'react-icons/si';
import { SiGraphql } from 'react-icons/si';
import { SiSwagger } from 'react-icons/si';
import { SiPostman } from 'react-icons/si';
import { SiNodedotjs } from 'react-icons/si';
import { SiFastapi } from 'react-icons/si';

import { MotionWrapper } from '@/components/MotionWrapper';

export default function ApiDevelopmentPage() {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const features = [
    {
      title: "Custom API Design",
      description: "Tailored API solutions designed to meet your specific business requirements.",
      icon: <HiOutlineCode className="w-8 h-8" />
    },
    {
      title: "RESTful & GraphQL APIs",
      description: "Build APIs with modern architectures and protocols that fit your needs.",
      icon: <SiGraphql className="w-7 h-7" />
    },
    {
      title: "API Documentation",
      description: "Comprehensive, well-structured documentation using OpenAPI/Swagger.",
      icon: <SiSwagger className="w-7 h-7" />
    },
    {
      title: "Performance Optimization",
      description: "High-performance APIs optimized for speed and efficiency.",
      icon: <HiOutlineLightningBolt className="w-8 h-8" />
    },
    {
      title: "Security Implementation",
      description: "Robust security protocols with authentication and authorization mechanisms.",
      icon: <HiOutlineShieldCheck className="w-8 h-8" />
    },
    {
      title: "API Testing & Monitoring",
      description: "Comprehensive testing and continuous monitoring for reliability.",
      icon: <HiOutlineChartBar className="w-8 h-8" />
    }
  ];

  const technologies = [
    { name: "OpenAPI", icon: <SiOpenapi className="w-12 h-12" /> },
    { name: "GraphQL", icon: <SiGraphql className="w-12 h-12" /> },
    { name: "Swagger", icon: <SiSwagger className="w-12 h-12" /> },
    { name: "Postman", icon: <SiPostman className="w-12 h-12" /> },
    { name: "Node.js", icon: <SiNodedotjs className="w-12 h-12" /> },
    { name: "FastAPI", icon: <SiFastapi className="w-12 h-12" /> }
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
        <div className="absolute w-[400px] h-[400px] rounded-full left-1/4 top-1/4 bg-blue-500 opacity-10 blur-[120px]"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full right-1/4 bottom-1/3 bg-purple-500 opacity-10 blur-[120px]"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <MotionWrapper
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight">
              API{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                Development
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Build robust, scalable, and secure APIs to power your applications and services
            </p>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/contact" 
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white text-lg font-semibold hover:opacity-90 transition-all duration-300"
              >
                Get Started
              </Link>
              <Link 
                href="#features" 
                className="px-8 py-3 border-2 border-blue-500 text-blue-500 rounded-xl text-lg font-semibold hover:bg-blue-500/10 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              API Development Services
            </h2>
            <p className="text-lg text-gray-300">
              Comprehensive API solutions tailored to your business needs
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
                className="feature-card p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="text-blue-500 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900/5 to-black"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Technologies We Use
            </h2>
            <p className="text-lg text-gray-300">
              We leverage modern technologies to build powerful APIs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {technologies.map((tech, index) => (
              <MotionWrapper
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 relative overflow-hidden flex flex-col items-center justify-center group hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="text-blue-500 mb-3">
                  {tech.icon}
                </div>
                <p className="text-sm font-medium">{tech.name}</p>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Our API Development Process
            </h2>
            <p className="text-lg text-gray-300">
              A systematic approach to building robust APIs
            </p>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto">
            {/* Process Steps */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500"></div>
              
              {/* Steps */}
              {[
                {
                  title: "Requirements Analysis",
                  description: "We thoroughly analyze your business requirements to design the best API solution.",
                  icon: <HiOutlineCog className="w-6 h-6" />
                },
                {
                  title: "API Design",
                  description: "Creating a comprehensive API design with clear endpoints, request/response formats.",
                  icon: <HiOutlineCode className="w-6 h-6" />
                },
                {
                  title: "Development & Testing",
                  description: "Building robust APIs with comprehensive testing for functionality and performance.",
                  icon: <HiOutlineLightningBolt className="w-6 h-6" />
                },
                {
                  title: "Deployment & Documentation",
                  description: "Deploying APIs with detailed documentation for seamless integration.",
                  icon: <SiSwagger className="w-5 h-5" />
                },
                {
                  title: "Monitoring & Maintenance",
                  description: "Continuous monitoring and maintenance to ensure optimal performance.",
                  icon: <HiOutlineRefresh className="w-6 h-6" />
                }
              ].map((step, index) => (
                <MotionWrapper
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`relative flex md:items-center mb-12 ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} p-4`}>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-300">{step.description}</p>
                  </div>
                  
                  <div className="absolute left-0 md:left-1/2 transform -translate-y-1/4 md:-translate-x-1/2 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center z-10">
                      {step.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1"></div>
                </MotionWrapper>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5"></div>
        <div className="absolute w-[600px] h-[600px] rounded-full left-1/4 -top-1/2 bg-blue-500 opacity-10 blur-[120px]"></div>
        <div className="absolute w-[600px] h-[600px] rounded-full right-1/4 -bottom-1/2 bg-purple-500 opacity-10 blur-[120px]"></div>
        
        <div className="container mx-auto px-4 relative">
          <MotionWrapper 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Ready to{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                Build Your API?
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Let's create a powerful API solution tailored to your business needs.
            </p>
            
            <Link 
              href="/contact" 
              className="inline-block px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white text-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Start Your API Project
            </Link>
          </MotionWrapper>
        </div>
      </section>
    </div>
  );
} 