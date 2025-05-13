'use client';

import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { 
  GlobeAltIcon, 
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Team data
const teamMembers = [
  // {
  //   id: 1,
  //   name: 'Sarah Chen',
  //   role: 'CEO & Co-Founder',
  //   image: '/team/sarah-chen.jpg',
  //   imageFallback: '/team/placeholder.png',
  //   bio: 'Former Google product lead with 15+ years experience in workflow automation and AI. Sarah founded Optiflow to make enterprise-grade automation accessible to everyone.',
  //   linkedin: 'https://linkedin.com/in/',
  //   twitter: 'https://twitter.com/'
  // },
  // {
  //   id: 2,
  //   name: 'Michael Rodriguez',
  //   role: 'CTO & Co-Founder',
  //   image: '/team/michael-rodriguez.jpg',
  //   imageFallback: '/team/placeholder.png',
  //   bio: 'Ex-AWS engineering leader with deep expertise in distributed systems and API design. Michael leads our technical vision and architecture.',
  //   linkedin: 'https://linkedin.com/in/',
  //   twitter: 'https://twitter.com/'
  // },
  // {
  //   id: 3,
  //   name: 'Aisha Johnson',
  //   role: 'Head of Product',
  //   image: '/team/aisha-johnson.jpg',
  //   imageFallback: '/team/placeholder.png',
  //   bio: 'Product visionary who previously led teams at Slack and Stripe. Aisha is passionate about creating intuitive user experiences for complex workflows.',
  //   linkedin: 'https://linkedin.com/in/',
  //   twitter: 'https://twitter.com/'
  // },
  // {
  //   id: 4,
  //   name: 'David Kim',
  //   role: 'Head of AI',
  //   image: '/team/david-kim.jpg',
  //   imageFallback: '/team/placeholder.png',
  //   bio: 'PhD in Machine Learning from MIT with experience at OpenAI. David leads our AI initiatives, including the Jarvis voice agent and workflow intelligence.',
  //   linkedin: 'https://linkedin.com/in/',
  //   twitter: 'https://twitter.com/'
  // },
  // {
  //   id: 5,
  //   name: 'Lisa Patel',
  //   role: 'Head of Customer Success',
  //   image: '/team/lisa-patel.jpg',
  //   imageFallback: '/team/placeholder.png',
  //   bio: 'Customer-obsessed leader who ensures our users get maximum value from Optiflow. Previously led support teams at Salesforce and Zendesk.',
  //   linkedin: 'https://linkedin.com/in/',
  //   twitter: 'https://twitter.com/'
  // },
  // {
  //   id: 6,
  //   name: 'James Wilson',
  //   role: 'Head of Engineering',
  //   image: '/team/james-wilson.jpg',
  //   imageFallback: '/team/placeholder.png',
  //   bio: 'Seasoned engineering leader with a track record of building reliable, scalable systems. James oversees our engineering teams and technical operations.',
  //   linkedin: 'https://linkedin.com/in/',
  //   twitter: 'https://twitter.com/'
  // }
];

// Values data
const values = [
  {
    icon: SparklesIcon,
    title: 'Innovation',
    description: 'We constantly push boundaries, embracing emerging technologies and fresh ideas to create solutions that anticipate tomorrow\'s challenges.'
  },
  {
    icon: UserGroupIcon,
    title: 'Customer-Centricity',
    description: 'Our customers are at the heart of everything we build. We listen, learn, and evolve based on their needs and feedback.'
  },
  {
    icon: StarIcon,
    title: 'Simplicity',
    description: 'We believe in making complex technology accessible. Our solutions are powerful yet intuitive, eliminating unnecessary complexity.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Integrity',
    description: 'We\'re committed to ethical practices, transparency in our operations, and being worthy of our users\' trust.'
  },
  {
    icon: GlobeAltIcon,
    title: 'Collaboration',
    description: 'We believe great ideas come from diverse perspectives working together. We foster an environment of open communication and teamwork.'
  },
];

// Company timeline
const timelineEvents = [
  {
    year: '2020',
    title: 'The Beginning',
    description: 'Optiflow was founded in San Francisco by Sarah Chen and Michael Rodriguez with a mission to democratize workflow automation for businesses of all sizes.'
  },
  {
    year: '2021',
    title: 'Seed Funding',
    description: 'Raised $3.5M seed round led by Accel Ventures to build out the core platform and first integrations.'
  },
  {
    year: '2022',
    title: 'Public Beta Launch',
    description: 'Launched our public beta with support for 25+ integrations and visual workflow editor, attracting our first 1,000 users.'
  },
  {
    year: '2023',
    title: 'Series A & Enterprise Launch',
    description: 'Secured $12M Series A funding and launched our Enterprise tier with advanced security features and dedicated support.'
  },
  {
    year: '2024',
    title: 'Voice Agent & AI Factory',
    description: 'Introduced Jarvis, our voice-controlled AI agent, and launched AI Factory to help businesses build custom AI solutions on top of Optiflow.'
  },
  {
    year: '2025',
    title: 'Global Expansion',
    description: 'Opened offices in London and Singapore, expanding our team to 100+ employees serving customers in over 50 countries.'
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen text-white bg-[#111111] relative overflow-x-hidden">
      {/* Animated Gradient Backgrounds */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-[700px] h-[700px] left-1/4 top-0 bg-gradient-to-br from-[#3CDFFF]/20 to-[#4AFFD4]/10 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute w-[600px] h-[600px] right-1/4 bottom-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/10 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden z-10">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image 
            src="/images/circuit-pattern.png" 
            alt="Background Pattern" 
            fill 
            className="object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-[#3CDFFF] to-white animate-gradient bg-300%">
              Our Mission Is to <span className="bg-gradient-to-r from-[#3CDFFF] via-[#4AFFD4] to-[#3CDFFF] text-transparent bg-clip-text animate-gradient bg-300%">Empower Everyone</span> With Automation
            </h1>
            
            <p className="text-xl text-[#9CA3AF] mb-8">
              We're building the future where powerful workflow automation is accessible to everyone, 
              not just engineers and large enterprises.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/products" 
                className="px-6 py-3 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors"
              >
                Our Products
              </Link>
              
              <Link 
                href="/careers" 
                className="px-6 py-3 border border-[#22D3EE] text-[#22D3EE] font-medium rounded-md hover:bg-[#22D3EE]/10 transition-colors"
              >
                Join Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-16 bg-[#18181B]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="relative aspect-square w-full rounded-lg overflow-hidden">
                  <Image 
                    src="/images/office-photo.jpg" 
                    alt="Optiflow Office" 
                    fill 
                    className="object-cover"
                  />
                </div>
              </div>
              
              <div>
                <p className="text-[#9CA3AF] mb-4">
                  Founded in 2020 by Sarah Chen and Michael Rodriguez, Optiflow was born from a simple observation: despite the proliferation of SaaS tools, most businesses still struggled with connecting these systems and automating workflows without dedicated IT resources.
                </p>
                
                <p className="text-[#9CA3AF] mb-4">
                  Having experienced this frustration firsthand at previous companies, Sarah and Michael set out to build a platform that would make powerful workflow automation accessible to everyone, regardless of technical background.
                </p>
                
                <p className="text-[#9CA3AF] mb-4">
                  Starting with a small team in San Francisco, Optiflow has grown into a global company with offices in three countries and users across more than 50 nations. Our journey has been guided by a relentless focus on simplifying complexity and empowering users.
                </p>
                
                <p className="text-[#9CA3AF]">
                  Today, Optiflow helps thousands of businesses streamline operations, reduce manual work, and unlock new possibilities through intelligent automation. But we're just getting started on our mission to democratize workflow automation for everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Company Values */}
      <section className="py-16 bg-[#111111]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center">Our Values</h2>
            <p className="text-[#9CA3AF] text-center mb-12">The principles that guide everything we do</p>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="bg-[#18181B] p-6 rounded-lg border border-[#374151] flex items-start gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <value.icon className="h-8 w-8 text-[#22D3EE] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-medium text-[#22D3EE] mb-2">{value.title}</h3>
                    <p className="text-[#9CA3AF]">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Company Timeline */}
      <section className="py-16 bg-[#18181B]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center">Our Journey</h2>
            <p className="text-[#9CA3AF] text-center mb-12">Key milestones in our company's evolution</p>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-[#374151] transform md:translate-x-[-0.5px]"></div>
              
              {/* Timeline events */}
              <div className="space-y-12">
                {timelineEvents.map((event, index) => (
                  <div key={index} className="relative">
                    <div className={`md:flex items-start ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      {/* Timeline dot */}
                      <div className="absolute left-0 md:left-1/2 top-0 w-4 h-4 rounded-full bg-[#22D3EE] transform md:translate-x-[-50%] border-4 border-[#18181B]"></div>
                      
                      {/* Year */}
                      <div className={`text-lg font-bold text-[#22D3EE] md:w-1/2 ${
                        index % 2 === 0 
                          ? 'md:pl-12 pl-10 md:pr-4 md:text-left' 
                          : 'md:pr-12 pl-10 md:pl-4 md:text-right'
                      }`}>
                        {event.year}
                      </div>
                      
                      {/* Content */}
                      <div className={`md:w-1/2 pt-3 md:pt-0 ${
                        index % 2 === 0 
                          ? 'md:pr-12 pl-10 md:pl-4' 
                          : 'md:pl-12 pl-10 md:pr-4'
                      }`}>
                        <h3 className="text-xl font-medium text-white mb-2">{event.title}</h3>
                        <p className="text-[#9CA3AF]">{event.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-[#134e4a] to-[#1e1b4b]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">100+</div>
                <div className="text-[#9CA3AF]">Team Members</div>
              </div>
              
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">50+</div>
                <div className="text-[#9CA3AF]">Countries</div>
              </div>
              
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">10k+</div>
                <div className="text-[#9CA3AF]">Customers</div>
              </div>
              
              <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  1M+
                  <CheckCircleIcon className="h-6 w-6 text-[#22D3EE]" title="Milestone reached" />
                </div>
                <div className="text-[#9CA3AF]">Workflows Run</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Investors Section */}
      <section className="py-16 bg-[#18181B]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center">Backed By</h2>
            <p className="text-[#9CA3AF] text-center mb-12">Our journey is supported by world-class investors</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((index) => (
                <div 
                  key={index} 
                  className="h-16 bg-[#111111] rounded-lg flex items-center justify-center p-4"
                >
                  <div className="text-center text-[#E5E7EB] font-medium">
                    Investor {index}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-[#111111]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Workflows?</h2>
            <p className="text-[#9CA3AF] mb-8">
              Join thousands of organizations using Optiflow to automate their work and boost productivity.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/signup" 
                className="px-6 py-3 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors"
              >
                Start Free Trial
              </Link>
              
              <Link 
                href="/contact" 
                className="px-6 py-3 border border-[#22D3EE] text-[#22D3EE] font-medium rounded-md hover:bg-[#22D3EE]/10 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 