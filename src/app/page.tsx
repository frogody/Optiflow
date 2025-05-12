'use client';

import { ArrowRightIcon, CheckCircleIcon, PlayCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamically import components that could cause hydration issues
const Image = dynamic(() => import('next/image'), { ssr: false });
const MotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), { ssr: false });

// Define animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.1, 0.6, 0.3, 0.9]
    }
  })
};

// Hero section data
const hero = {
  title: "The Automation Platform For Your Workflow",
  subtitle: "Connect your favorite tools, automate your workflows, and boost productivity with our AI-powered orchestration platform.",
  highlightWords: ["Automation", "Workflow", "AI-powered"]
};

// Persona-specific value props
const personaValueProps = [
  {
    persona: "developers",
    title: "Streamline Development Workflows",
    description: "Automate CI/CD pipelines, code reviews, and deployment processes with Optiflow's developer-focused integrations.",
    icon: "/icons/code.svg",
    link: "/use-cases/developers",
    gradient: "from-blue-400 to-indigo-600"
  },
  {
    persona: "marketers",
    title: "Optimize Your Marketing Campaigns",
    description: "Connect analytics tools, CRMs, and marketing platforms to create automated marketing workflows that save time and increase ROI.",
    icon: "/icons/chart.svg",
    link: "/use-cases/marketers",
    gradient: "from-teal-400 to-emerald-600"
  },
  {
    persona: "operations",
    title: "Efficient Business Operations",
    description: "Reduce manual tasks and ensure data consistency across your organization with automated operational workflows.",
    icon: "/icons/settings.svg",
    link: "/use-cases/operations",
    gradient: "from-purple-400 to-pink-600"
  }
];

// Testimonials data
const testimonials = [
  {
    quote: "Optiflow has completely transformed how our team works. The voice commands make it incredibly easy to automate repetitive tasks.",
    author: "Sarah Johnson",
    title: "CTO, TechNova",
    avatar: "/testimonials/sarah-johnson.jpg"
  },
  {
    quote: "We've cut our workflow setup time by 70% since implementing Optiflow. The integrations with our existing tools made adoption seamless.",
    author: "Michael Chen",
    title: "Head of Marketing, GrowthLabs",
    avatar: "/testimonials/michael-chen.jpg"
  },
  {
    quote: "The credit-based system gives us perfect flexibility to scale up or down as needed, and the voice agent feels like having an AI assistant on the team.",
    author: "Aisha Patel",
    title: "Operations Director, Flexify",
    avatar: "/testimonials/aisha-patel.jpg"
  }
];

// Integration logos
const integrationLogos = [
  { name: "Slack", logo: "/icons/slack.svg" },
  { name: "Gmail", logo: "/icons/gmail.svg" },
  { name: "GitHub", logo: "/icons/github.svg" },
  { name: "Salesforce", logo: "/icons/salesforce.svg" },
  { name: "HubSpot", logo: "/icons/hubspot.svg" },
  { name: "Asana", logo: "/icons/asana.svg" },
  { name: "Stripe", logo: "/icons/stripe.svg" },
  { name: "Zapier", logo: "/icons/zapier.svg" },
];

// Features highlights
const features = [
  {
    title: "Voice-Controlled Workflows",
    description: "Manage your workflows with natural language voice commands for hands-free operation",
    icon: "🎤"
  },
  {
    title: "AI-Powered Automation",
    description: "Leverage cutting-edge AI models to enhance your automation with intelligence",
    icon: "🧠"
  },
  {
    title: "Seamless Integrations",
    description: "Connect with 100+ services and tools through our easy-to-use integration platform",
    icon: "🔗"
  },
  {
    title: "Visual Workflow Editor",
    description: "Design complex workflows with our intuitive drag-and-drop interface",
    icon: "✨"
  }
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  
  // Only run on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to highlight specific words in the hero title
  const renderHighlightedTitle = (title) => {
    const words = title.split(" ");
    return (
      <>
        {words.map((word, i) => {
          const shouldHighlight = hero.highlightWords.some(hw => word.includes(hw));
          return (
            <span key={i} className={shouldHighlight ? "text-transparent bg-clip-text bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4]" : "text-white"}>
              {word}{" "}
            </span>
          );
        })}
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#111111] overflow-hidden">
      {/* Hero Section with 3D-like background */}
      <section className="relative min-h-[80vh] flex items-center">
        {/* Abstract background elements */}
        {mounted && (
          <>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-[#3CDFFF]/20 to-[#4AFFD4]/5 rounded-full filter blur-[100px] opacity-30 animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-purple-500/20 to-indigo-500/5 rounded-full filter blur-[80px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>
          </>
        )}

        <div className="container mx-auto px-4 z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trusted badge */}
            {mounted ? (
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex justify-center mb-6"
              >
                <span className="inline-flex items-center bg-white/5 backdrop-blur-sm text-[#4AFFD4] px-5 py-2 rounded-full text-sm font-medium border border-white/10">
                  <CheckCircleIcon className="h-5 w-5 mr-2" /> Trusted by 10,000+ teams
                </span>
              </MotionDiv>
            ) : (
              <div className="flex justify-center mb-6">
                <span className="inline-flex items-center bg-white/5 backdrop-blur-sm text-[#4AFFD4] px-5 py-2 rounded-full text-sm font-medium border border-white/10">
                  <CheckCircleIcon className="h-5 w-5 mr-2" /> Trusted by 10,000+ teams
                </span>
              </div>
            )}

            {/* Hero title and subtitle */}
            {mounted ? (
              <>
                <MotionDiv
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
                >
                  {renderHighlightedTitle(hero.title)}
                </MotionDiv>

                <MotionDiv
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto"
                >
                  {hero.subtitle}
                </MotionDiv>
              </>
            ) : (
              <>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                  {renderHighlightedTitle(hero.title)}
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
                  {hero.subtitle}
                </p>
              </>
            )}

            {/* CTA Buttons */}
            {mounted ? (
              <MotionDiv
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
                className="flex flex-wrap justify-center gap-5 mb-16"
              >
                <Link
                  href="/signup"
                  className="px-8 py-3.5 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-black font-semibold rounded-lg hover:shadow-glow-cyan transition-all duration-300 text-lg flex items-center"
                >
                  Get Started
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/demo"
                  className="px-8 py-3.5 border-2 border-[#3CDFFF] text-[#3CDFFF] font-semibold rounded-lg hover:bg-[#3CDFFF]/10 transition-all duration-300 text-lg flex items-center"
                >
                  <PlayCircleIcon className="h-5 w-5 mr-2" /> Watch Demo
                </Link>
              </MotionDiv>
            ) : (
              <div className="flex flex-wrap justify-center gap-5 mb-16">
                <Link
                  href="/signup"
                  className="px-8 py-3.5 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-black font-semibold rounded-lg hover:shadow-glow-cyan transition-all duration-300 text-lg flex items-center"
                >
                  Get Started
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/demo"
                  className="px-8 py-3.5 border-2 border-[#3CDFFF] text-[#3CDFFF] font-semibold rounded-lg hover:bg-[#3CDFFF]/10 transition-all duration-300 text-lg flex items-center"
                >
                  <PlayCircleIcon className="h-5 w-5 mr-2" /> Watch Demo
                </Link>
              </div>
            )}

            {/* Integration Logos */}
            {mounted && (
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111111] pointer-events-none z-10 h-20 bottom-0 top-auto"></div>
                <div className="text-center text-gray-400 mb-6 text-sm uppercase tracking-wider font-medium">Integrates with your favorite tools</div>
                <div className="flex flex-wrap justify-center gap-8 items-center">
                  {integrationLogos.map((logo, index) => (
                    <MotionDiv
                      key={logo.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                      className="flex items-center bg-white/5 backdrop-blur-sm p-3 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <Image src={logo.logo} alt={logo.name} width={40} height={40} className="h-10 w-10 object-contain" />
                    </MotionDiv>
                  ))}
                </div>
              </MotionDiv>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative overflow-hidden">
        {mounted && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-[#3CDFFF]/10 to-[#4AFFD4]/5 rounded-full filter blur-[120px] opacity-30"></div>
          </div>
        )}

        <div className="container mx-auto px-4">
          {mounted ? (
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 inline-block">
                <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">Powerful Features</span> for Modern Teams
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Built for teams that want to automate processes, streamline workflows, and boost productivity
              </p>
            </MotionDiv>
          ) : (
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 inline-block">
                <span className="bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-transparent bg-clip-text">Powerful Features</span> for Modern Teams
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Built for teams that want to automate processes, streamline workflows, and boost productivity
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              mounted ? (
                <MotionDiv
                  key={feature.title}
                  custom={index}
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </MotionDiv>
              ) : (
                <div
                  key={feature.title}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Persona Value Props Section */}
      <section className="py-20 relative">
        {mounted && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/10 to-blue-500/5 rounded-full filter blur-[100px] opacity-30"></div>
          </div>
        )}

        <div className="container mx-auto px-4">
          {mounted ? (
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Who is Optiflow for?</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Designed for professionals across various domains who want to streamline their workflow
              </p>
            </MotionDiv>
          ) : (
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Who is Optiflow for?</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Designed for professionals across various domains who want to streamline their workflow
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            {personaValueProps.map((persona, index) => (
              mounted ? (
                <MotionDiv
                  key={persona.persona}
                  custom={index}
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    href={persona.link}
                    className="block bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 h-full hover:border-[#3CDFFF]/40 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${persona.gradient} mb-6 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {persona.icon && (
                        <Image src={persona.icon} alt={persona.title} width={32} height={32} />
                      )}
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-[#4AFFD4] transition-colors">{persona.title}</h3>
                    <p className="text-gray-400 mb-6">{persona.description}</p>
                    <div className="flex items-center text-[#3CDFFF] font-medium">
                      Learn more 
                      <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </MotionDiv>
              ) : (
                <Link
                  key={persona.persona}
                  href={persona.link}
                  className="block bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 h-full hover:border-[#3CDFFF]/40 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${persona.gradient} mb-6 flex items-center justify-center`}>
                    {persona.icon && (
                      <Image src={persona.icon} alt={persona.title} width={32} height={32} />
                    )}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-[#4AFFD4] transition-colors">{persona.title}</h3>
                  <p className="text-gray-400 mb-6">{persona.description}</p>
                  <div className="flex items-center text-[#3CDFFF] font-medium">
                    Learn more 
                    <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {mounted && (
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">What Our Users Say</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Hear from teams that have transformed their workflows with Optiflow
              </p>
            </MotionDiv>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, idx) => (
                <MotionDiv
                  key={idx}
                  custom={idx}
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 flex flex-col"
                >
                  <div className="flex items-center mb-6">
                    <Image 
                      src={testimonial.avatar} 
                      alt={testimonial.author} 
                      width={56} 
                      height={56} 
                      className="rounded-full h-14 w-14 object-cover border-2 border-white/10" 
                    />
                    <div className="ml-4">
                      <div className="text-white font-semibold">{testimonial.author}</div>
                      <div className="text-gray-400 text-sm">{testimonial.title}</div>
                    </div>
                  </div>
                  <p className="text-gray-300 italic leading-relaxed flex-grow">"{testimonial.quote}"</p>
                  <div className="mt-6 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star} 
                        className="h-5 w-5 text-[#4AFFD4]" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </MotionDiv>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        {mounted && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#134e4a]/30 to-[#1e1b4b]/30 rounded-3xl"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-[#3CDFFF]/20 to-[#4AFFD4]/10 rounded-full filter blur-[120px]"></div>
          </div>
        )}

        <div className="container mx-auto px-4 relative z-10">
          {mounted ? (
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 md:p-16 text-center max-w-5xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Workflow?</h2>
              <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
                Join thousands of teams who are already using Optiflow to automate their workflows and boost productivity.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  href="/signup"
                  className="px-8 py-3.5 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-black font-semibold rounded-lg hover:shadow-glow-cyan transition-all duration-300 text-lg"
                >
                  Start Your Free Trial
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-3.5 border-2 border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 text-lg"
                >
                  Contact Sales
                </Link>
              </div>
            </MotionDiv>
          ) : (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 md:p-16 text-center max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Workflow?</h2>
              <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
                Join thousands of teams who are already using Optiflow to automate their workflows and boost productivity.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  href="/signup"
                  className="px-8 py-3.5 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-black font-semibold rounded-lg hover:shadow-glow-cyan transition-all duration-300 text-lg"
                >
                  Start Your Free Trial
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-3.5 border-2 border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 text-lg"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 