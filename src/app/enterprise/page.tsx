'use client';

import { useState, useEffect } from 'react';

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';
// Disable cache to avoid static rendering issues
export const revalidate = 0;

import Link from 'next/link';

// Simple icon component to replace Heroicons
const Icon = ({ name, className }) => {
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
    <div className={`icon-placeholder ${name} ${className || ''}`}>
      <span className="sr-only">{name}</span>
    </div>
  );
};

export default function EnterprisePage() {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '',
    email: '',
    company: '',
    employees: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  
  // Enterprise features
  const features = [
    { 
      title: "Enterprise-Grade Security",
      description: "SOC 2 compliance, SSO integration, role-based access control, and end-to-end encryption.",
      icon: "shield-check" 
    },
    { 
      title: "Scalable Infrastructure",
      description: "Handle millions of automations with our cloud infrastructure designed for enterprise workloads.",
      icon: "server" 
    },
    { 
      title: "Compliance Management",
      description: "Stay compliant with GDPR, HIPAA, CCPA, and other regulations with built-in compliance tools.",
      icon: "scale" 
    },
    { 
      title: "Dedicated Support",
      description: "Get a dedicated account manager and 24/7 priority support for your enterprise needs.",
      icon: "support" 
    },
    { 
      title: "Data Governance",
      description: "Advanced data governance tools to manage data flows, retention policies, and audit logs.",
      icon: "database" 
    },
    { 
      title: "Custom Development",
      description: "Our team can build custom integrations and workflows tailored to your business needs.",
      icon: "code" 
    }
  ];
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    
    if (!formData.employees) {
      newErrors.employees = 'Please select company size';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate form submission
      setTimeout(() => {
        setFormSubmitted(true);
        setFormData({ 
          name: '',
          email: '',
          company: '',
          employees: '',
          message: ''
        });
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-purple-900/20 opacity-30" />
        
        <div className="container mx-auto max-w-7xl relative z-10 px-6">
          <div className="py-24">
            <div className="max-w-4xl">
              <div className="inline-block mb-8">
                <span className="px-6 py-2 rounded-full bg-gradient-to-r from-[#3CDFFF]/10 to-[#4AFFD4]/10 border border-[#3CDFFF]/20 text-[#3CDFFF] text-sm font-medium backdrop-blur-sm">
                  Enterprise-Grade Solutions
                </span>
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-[#3CDFFF] to-white">
                Transform Your{" "}
                <span className="bg-gradient-to-r from-[#3CDFFF] via-[#4AFFD4] to-[#3CDFFF] text-transparent bg-clip-text">
                  Enterprise
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-[#3CDFFF]/90 mb-12 max-w-3xl leading-relaxed">
                Scale your workflow automation across your entire organization with our enterprise-grade platform. Security, compliance, and scalability built for global teams.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Link 
                  href="#contact"
                  className="px-8 py-4 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-full font-semibold text-black hover:opacity-90 transition duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#3CDFFF]/25 flex items-center justify-center"
                >
                  <span className="flex items-center justify-center">
                    Request Demo →
                  </span>
                </Link>
                <Link 
                  href="/pricing"
                  className="px-8 py-4 border-2 border-[#3CDFFF]/20 text-white rounded-full font-semibold transition duration-300 backdrop-blur-sm flex items-center justify-center"
                >
                  <span>View Pricing</span>
                </Link>
              </div>
              
              <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-[#3CDFFF]/30 transition-all duration-300 group">
                  <div className="text-5xl font-bold bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text mb-3">99.9%</div>
                  <div className="text-[#3CDFFF]/90">Uptime SLA</div>
                </div>
                <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-[#3CDFFF]/30 transition-all duration-300 group">
                  <div className="text-5xl font-bold bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text mb-3">24/7</div>
                  <div className="text-[#3CDFFF]/90">Enterprise Support</div>
                </div>
                <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-[#3CDFFF]/30 transition-all duration-300 group">
                  <div className="text-5xl font-bold bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text mb-3">ISO</div>
                  <div className="text-[#3CDFFF]/90">27001 Certified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Enterprise-Grade Features
            </h2>
            <p className="text-lg text-gray-300">
              Our platform is designed to meet the needs of large organizations with advanced security, scalability, and compliance requirements.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:border-[#3CDFFF]/30 transition-all duration-300"
              >
                <div className="text-[#3CDFFF] mb-4">
                  <Icon name={feature.icon} className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Form Section */}
      <section id="contact" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-[#3CDFFF]/5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/40 border border-white/10 rounded-xl p-8 backdrop-blur-md">
              <h2 className="text-3xl font-bold mb-6 text-center">
                Request Enterprise Demo
              </h2>
              
              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Thank You!</h3>
                  <p className="text-gray-300 mb-6">
                    Your demo request has been submitted. Our enterprise team will contact you within 24 hours.
                  </p>
                  <Link
                    href="/"
                    className="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                  >
                    Back to Home
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CDFFF]/50 text-white placeholder-gray-500`}
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Business Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CDFFF]/50 text-white placeholder-gray-500`}
                        placeholder="john@company.com"
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">Company Name</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 bg-white/5 border ${errors.company ? 'border-red-500' : 'border-white/10'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CDFFF]/50 text-white placeholder-gray-500`}
                        placeholder="Acme Inc."
                      />
                      {errors.company && <p className="mt-1 text-sm text-red-500">{errors.company}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="employees" className="block text-sm font-medium text-gray-300 mb-1">Company Size</label>
                      <select
                        id="employees"
                        name="employees"
                        value={formData.employees}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 bg-white/5 border ${errors.employees ? 'border-red-500' : 'border-white/10'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CDFFF]/50 text-white`}
                      >
                        <option value="" className="bg-gray-900">Select company size</option>
                        <option value="1-50" className="bg-gray-900">1-50 employees</option>
                        <option value="51-200" className="bg-gray-900">51-200 employees</option>
                        <option value="201-500" className="bg-gray-900">201-500 employees</option>
                        <option value="501-1000" className="bg-gray-900">501-1000 employees</option>
                        <option value="1000+" className="bg-gray-900">1000+ employees</option>
                      </select>
                      {errors.employees && <p className="mt-1 text-sm text-red-500">{errors.employees}</p>}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Additional Information</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CDFFF]/50 text-white placeholder-gray-500"
                      placeholder="Tell us about your automation needs..."
                    ></textarea>
                  </div>
                  
                  <div className="mt-8 flex justify-center">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-lg text-black font-medium hover:opacity-90 transition-opacity"
                    >
                      Request Demo
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}