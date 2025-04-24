'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  HiOutlineLightningBolt, 
  HiOutlineShieldCheck, 
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineCode,
  HiOutlineAcademicCap,
  HiOutlineOfficeBuilding,
  HiOutlineSearchCircle
} from 'react-icons/hi';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';

interface ServiceCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  link?: string;
  isProduct?: boolean;
}

interface CaseStudy {
  title: string;
  description: string;
  impact: string;
  industry: string;
}

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Service cards data
  const consultancyServices: ServiceCard[] = [
    {
      title: "Audit AI & Data Tools",
      description: "Expert evaluation of AI tools and data infrastructure to ensure optimal performance and ROI.",
      icon: <HiOutlineSearchCircle className="w-6 h-6" />
    },
    {
      title: "Evaluate Innovation",
      description: "Cut through marketing hype to identify real innovation that drives business value.",
      icon: <HiOutlineChartBar className="w-6 h-6" />
    },
    {
      title: "Ensure Compliance & Security",
      description: "Comprehensive assessment of legal risks and data security concerns.",
      icon: <HiOutlineShieldCheck className="w-6 h-6" />
    },
    {
      title: "Custom Development",
      description: "Tailored integration and workflow solutions built for your specific needs.",
      icon: <HiOutlineCode className="w-6 h-6" />
    }
  ];

  const productOfferings: ServiceCard[] = [
    {
      title: "Optiflow",
      description: "Intelligent workflow automation platform for seamless business processes.",
      icon: <HiOutlineLightningBolt className="w-6 h-6" />,
      link: "/products/optiflow",
      isProduct: true
    },
    {
      title: "AI Factory",
      description: "Innovation platform for rapid AI solution development and deployment.",
      icon: <HiOutlineCog className="w-6 h-6" />,
      link: "/products/ai-factory",
      isProduct: true
    },
    {
      title: "AIcademy",
      description: "Comprehensive AI education and training programs for teams.",
      icon: <HiOutlineAcademicCap className="w-6 h-6" />,
      link: "/products/aicademy",
      isProduct: true
    },
    {
      title: "Enterprise Solutions",
      description: "Custom AI and data solutions for enterprise-scale operations.",
      icon: <HiOutlineOfficeBuilding className="w-6 h-6" />,
      link: "/enterprise",
      isProduct: true
    }
  ];

  const caseStudies: CaseStudy[] = [
    {
      title: "AI Strategy Transformation",
      description: "Helped a Fortune 500 company evaluate and implement AI solutions across their operations.",
      impact: "40% reduction in operational costs",
      industry: "Manufacturing"
    },
    {
      title: "Data Infrastructure Optimization",
      description: "Redesigned data architecture for improved AI model performance and compliance.",
      impact: "60% faster model deployment",
      industry: "Healthcare"
    },
    {
      title: "AI Security Assessment",
      description: "Comprehensive security audit and implementation of AI governance framework.",
      impact: "Zero security incidents post-implementation",
      industry: "Financial Services"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col text-white" style={{ background: 'linear-gradient(to bottom, #000000, #0A0A0A)' }}>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#3CDFFF] z-50"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <section className="flex-1 relative flex flex-col items-center justify-center pt-16 md:pt-20 pb-24 md:pb-32 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto px-4"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            AI Beyond Hype – <span className="text-[#3CDFFF]">Built for Real Impact</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 mb-8"
          >
            We don't just advise—we ensure AI & Data solutions actually fit. Cutting through the noise around AI adoption with strategic integration and real results.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/consultation"
              className="px-8 py-3 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Schedule a Consultation
            </Link>
            <Link
              href="#services"
              className="px-8 py-3 border border-[#3CDFFF] text-[#3CDFFF] font-medium rounded-lg hover:bg-[#3CDFFF]/10 transition-colors"
            >
              Explore Our Solutions
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Who We Are Section */}
      <section className="py-16 md:py-24 bg-black/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Your Expert Guide, <span className="text-[#3CDFFF]">Not a Vendor</span>
            </h2>
            <p className="text-gray-300 mb-12">
              We're on a mission to close the gap between AI innovation and knowledge. Our approach is simple: we don't sell software or push prepackaged solutions. Instead, we build, audit, assess, and align AI & Data investments to ensure real business impact.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                "We don't sell software or push prepackaged solutions",
                "We build, audit, assess, and align AI & Data investments",
                "We separate what's possible today from what's inevitable tomorrow"
              ].map((text, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 bg-[#3CDFFF]/5 rounded-lg"
                >
                  <p className="text-sm md:text-base">{text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              We Talk Tech <span className="text-[#3CDFFF]">So You Don't Have To</span>
            </h2>
            <p className="text-gray-300 text-center mb-12">
              AI, security, and contracts are complex—especially in high-stake decisions. We step in as your first line of defense, cutting through noise so you make decisions with confidence.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="feature-card p-6 relative">
                <div className="absolute -inset-1 bg-[#3CDFFF]/10 rounded-lg blur-lg"></div>
                <div className="relative">
                  <h3 className="text-xl font-semibold mb-4 text-[#3CDFFF]">Strategic Assessment</h3>
                  <ul className="space-y-4">
                    {[
                      "Evaluate current AI & Data landscape",
                      "Identify opportunities and risks",
                      "Define clear implementation roadmap"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center">
                        <span className="mr-2 text-[#4AFFD4]">✓</span>
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="feature-card p-6 relative">
                <div className="absolute -inset-1 bg-[#3CDFFF]/10 rounded-lg blur-lg"></div>
                <div className="relative">
                  <h3 className="text-xl font-semibold mb-4 text-[#3CDFFF]">Expert Implementation</h3>
                  <ul className="space-y-4">
                    {[
                      "Custom solution development",
                      "Security and compliance focus",
                      "Continuous optimization and support"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center">
                        <span className="mr-2 text-[#4AFFD4]">✓</span>
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Ecosystem */}
      <section id="services" className="py-16 md:py-24 bg-black/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Our Services <span className="text-[#3CDFFF]">Ecosystem</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {consultancyServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="feature-card p-6 relative"
                >
                  <div className="absolute right-4 top-4 text-[#3CDFFF]">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 pr-8">{service.title}</h3>
                  <p className="text-gray-300 text-sm">{service.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productOfferings.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="feature-card p-6 relative group"
                >
                  <Link href={product.link || '#'} className="block">
                    <div className="absolute right-4 top-4 text-[#3CDFFF]">
                      {product.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 pr-8 group-hover:text-[#3CDFFF] transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-gray-300 text-sm">{product.description}</p>
                    <div className="mt-4 text-[#3CDFFF] text-sm flex items-center">
                      <span>Learn more</span>
                      <FaArrowUpRightFromSquare className="ml-2 w-3 h-3" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose iSyncso */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Bold, Agile, and <span className="text-[#3CDFFF]">Highly Knowledgeable</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Trend Definers",
                  description: "We don't just follow the trends—we define them through deep industry expertise and forward-thinking solutions."
                },
                {
                  title: "Network of Experts",
                  description: "We understand who can build what, who can't, and who to ask when it matters most for your success."
                },
                {
                  title: "Living AI Daily",
                  description: "We're immersed in AI & Data daily, ensuring you're ahead of the curve, not catching up to it."
                },
                {
                  title: "Mission Driven",
                  description: "We're on a mission to close the gap between AI innovation and knowledge through practical implementation."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="feature-card p-6 relative"
                >
                  <h3 className="text-xl font-semibold mb-3 text-[#3CDFFF]">{item.title}</h3>
                  <p className="text-gray-300">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 md:py-24 bg-black/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Success <span className="text-[#3CDFFF]">Stories</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {caseStudies.map((study, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="feature-card p-6 relative"
                >
                  <div className="mb-4">
                    <span className="text-sm text-[#3CDFFF]">{study.industry}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{study.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{study.description}</p>
                  <div className="text-[#4AFFD4] font-medium">{study.impact}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start Your <span className="text-[#3CDFFF]">AI Transformation</span> Journey
            </h2>
            <p className="text-gray-300 mb-8">
              Ready to transform your business with AI? Let's start with a conversation about your goals.
            </p>
            <Link
              href="/consultation"
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Schedule Your Free Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 