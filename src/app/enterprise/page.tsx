'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { 
  HiOutlineCode, 
  HiOutlineDatabase,
  HiOutlineScale,
  HiOutlineServer,
  HiOutlineShieldCheck,
  HiOutlineSupport
} from 'react-icons/hi';

export default function EnterprisePage(): JSX.Element {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '',
    email: '',
    company: '',
    employees: '',
    message: ''
      });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Enterprise features
  const features = [
    { title: "Enterprise-Grade Security",
      description: "SOC 2 compliance, SSO integration, role-based access control, and end-to-end encryption.",
      icon: <HiOutlineShieldCheck className="w-8 h-8" />
        },
    { title: "Scalable Infrastructure",
      description: "Handle millions of automations with our cloud infrastructure designed for enterprise workloads.",
      icon: <HiOutlineServer className="w-8 h-8" />
        },
    { title: "Compliance Management",
      description: "Stay compliant with GDPR, HIPAA, CCPA, and other regulations with built-in compliance tools.",
      icon: <HiOutlineScale className="w-8 h-8" />
        },
    { title: "Dedicated Support",
      description: "Get a dedicated account manager and 24/7 priority support for your enterprise needs.",
      icon: <HiOutlineSupport className="w-8 h-8" />
        },
    { title: "Data Governance",
      description: "Advanced data governance tools to manage data flows, retention policies, and audit logs.",
      icon: <HiOutlineDatabase className="w-8 h-8" />
        },
    { title: "Custom Development",
      description: "Our team can build custom integrations and workflows tailored to your business needs.",
      icon: <HiOutlineCode className="w-8 h-8" />
        }
  ];
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData,
      [name]: value
        });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({ ...errors,
        [name]: ''
          });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate form submission
      setTimeout(() => {
        setFormSubmitted(true);
        setFormData({ name: '',
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
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        {/* Enhanced Pulsing Light Effects */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="absolute w-[1400px] h-[1400px] rounded-full left-1/4 -top-1/2 bg-gradient-to-r from-[#3CDFFF]/20 to-[#4AFFD4]/20 blur-[200px]"
            animate={{ opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.2, 1],
              x: [-50, 50, -50],
              y: [-50, 50, -50],
              rotate: [0, 45, 0],
                }}
            transition={{ duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
                }}
          />
          <motion.div 
            className="absolute w-[1400px] h-[1400px] rounded-full right-1/4 -bottom-1/2 bg-gradient-to-r from-[#4AFFD4]/20 to-[#3CDFFF]/20 blur-[200px]"
            animate={{ opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.2, 1],
              x: [50, -50, 50],
              y: [50, -50, 50],
              rotate: [0, -45, 0],
                }}
            transition={{ duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
                }}
          />
          <motion.div 
            className="absolute w-[1200px] h-[1200px] rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#3CDFFF]/20 via-[#4AFFD4]/20 to-[#3CDFFF]/20 blur-[200px]"
            animate={{ opacity: [0.15, 0.3, 0.15],
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
                }}
            transition={{ duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
                }}
          />
          {/* Enhanced floating orbs with gradients */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-[${Math.random() * 600 + 400}px] h-[${Math.random() * 600 + 400}px] rounded-full blur-[150px] bg-gradient-to-r ${ i % 3 === 0 ? 'from-[#3CDFFF]/20 to-[#4AFFD4]/20' :
                i % 3 === 1 ? 'from-[#4AFFD4]/20 to-[#3CDFFF]/20' :
                'from-[#3CDFFF]/20 via-[#4AFFD4]/20 to-[#3CDFFF]/20'
                  }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ opacity: [0.1, 0.2, 0.1],
                scale: [1, 1.3, 1],
                x: [0, Math.random() * 200 - 100, 0],
                y: [0, Math.random() * 200 - 100, 0],
                rotate: [0, Math.random() * 180 - 90, 0],
                  }}
              transition={{ duration: Math.random() * 8 + 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5,
                  }}
            />
          ))}
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="min-h-[90vh] flex items-center py-24 px-6">
            <motion.div
              initial={{ opacity: 0, y: 20     }}
              animate={{ opacity: 1, y: 0     }}
              transition={{ duration: 1     }}
              className="max-w-4xl"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8     }}
                animate={{ opacity: 1, scale: 1     }}
                transition={{ duration: 0.7, delay: 0.3     }}
                className="inline-block mb-8"
              >
                <span className="px-6 py-2 rounded-full bg-gradient-to-r from-[#3CDFFF]/10 to-[#4AFFD4]/10 border border-[#3CDFFF]/20 text-[#3CDFFF] text-sm font-medium backdrop-blur-sm">
                  Enterprise-Grade Solutions
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20     }}
                animate={{ opacity: 1, y: 0     }}
                transition={{ duration: 1, delay: 0.5     }}
                className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-[#3CDFFF] to-white bg-300% animate-gradient"
              >
                Transform Your{" "}
                <span className="bg-gradient-to-r from-[#3CDFFF] via-[#4AFFD4] to-[#3CDFFF] text-transparent bg-clip-text animate-gradient bg-300%">
                  Enterprise
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20     }}
                animate={{ opacity: 1, y: 0     }}
                transition={{ duration: 1, delay: 0.7     }}
                className="text-xl md:text-2xl text-[#3CDFFF]/90 mb-12 max-w-3xl leading-relaxed"
              >
                Scale your workflow automation across your entire organization with our enterprise-grade platform. Security, compliance, and scalability built for global teams.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20     }}
                animate={{ opacity: 1, y: 0     }}
                transition={{ duration: 1, delay: 0.9     }}
                className="flex flex-col sm:flex-row gap-6"
              >
                <Link 
                  href="#contact"
                  className="group relative px-8 py-4 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-full font-semibold text-black hover:opacity-90 transition duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#3CDFFF]/25 flex items-center justify-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3CDFFF] via-[#4AFFD4] to-[#3CDFFF] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-300% animate-gradient"></div>
                  <span className="relative flex items-center justify-center">
                    Request Demo
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 5, 0]     }}
                      transition={{ duration: 1.5, repeat: Infinity     }}
                    >
                      →
                    </motion.span>
                  </span>
                </Link>
                <Link 
                  href="/pricing"
                  className="group relative px-8 py-4 border-2 border-[#3CDFFF]/20 text-white rounded-full font-semibold transition duration-300 backdrop-blur-sm flex items-center justify-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3CDFFF]/10 via-[#4AFFD4]/10 to-[#3CDFFF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative">View Pricing</span>
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0     }}
                animate={{ opacity: 1     }}
                transition={{ duration: 1, delay: 1.2     }}
                className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                <motion.div 
                  whileHover={{ scale: 1.05     }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-[#3CDFFF]/30 transition-all duration-300 group"
                >
                  <div className="text-5xl font-bold bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text mb-3 group-hover:scale-110 transition-transform duration-300">99.9%</div>
                  <div className="text-[#3CDFFF]/90 group-hover:text-white transition-colors duration-300">Uptime SLA</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05     }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-[#3CDFFF]/30 transition-all duration-300 group"
                >
                  <div className="text-5xl font-bold bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text mb-3 group-hover:scale-110 transition-transform duration-300">24/7</div>
                  <div className="text-[#3CDFFF]/90 group-hover:text-white transition-colors duration-300">Enterprise Support</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05     }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-[#3CDFFF]/30 transition-all duration-300 group"
                >
                  <div className="text-5xl font-bold bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text mb-3 group-hover:scale-110 transition-transform duration-300">ISO</div>
                  <div className="text-[#3CDFFF]/90 group-hover:text-white transition-colors duration-300">27001 Certified</div>
                </motion.div>
              </motion.div>
            </motion.div>
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
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20     }}
                whileInView={{ opacity: 1, y: 0     }}
                transition={{ duration: 0.5, delay: index * 0.1     }}
                viewport={{ once: true     }}
                className="feature-card p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:border-[#3CDFFF]/30 transition-all duration-300"
              >
                <div className="text-[#3CDFFF] mb-4">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
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
                <motion.div
                  initial={{ opacity: 0, y: 20     }}
                  animate={{ opacity: 1, y: 0     }}
                  className="text-center py-8"
                >
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
                </motion.div>
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
                        className={`w-full px-4 py-2 bg-white/5 border ${ errors.name ? 'border-red-500' : 'border-white/10'    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CDFFF]/50 text-white placeholder-gray-500`}
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
                        className={`w-full px-4 py-2 bg-white/5 border ${ errors.email ? 'border-red-500' : 'border-white/10'    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CDFFF]/50 text-white placeholder-gray-500`}
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
                        className={`w-full px-4 py-2 bg-white/5 border ${ errors.company ? 'border-red-500' : 'border-white/10'    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CDFFF]/50 text-white placeholder-gray-500`}
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
                        className={`w-full px-4 py-2 bg-white/5 border ${ errors.employees ? 'border-red-500' : 'border-white/10'    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CDFFF]/50 text-white`}
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