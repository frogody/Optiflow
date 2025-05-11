'use client';

import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { 
  BriefcaseIcon, 
  GlobeAltIcon, 
  HeartIcon, 
  LightBulbIcon,
  RocketLaunchIcon,
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
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'CEO & Co-Founder',
    image: '/team/sarah-chen.jpg',
    imageFallback: '/team/placeholder.png',
    bio: 'Former Google product lead with 15+ years experience in workflow automation and AI. Sarah founded Optiflow to make enterprise-grade automation accessible to everyone.',
    linkedin: 'https://linkedin.com/in/',
    twitter: 'https://twitter.com/'
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    role: 'CTO & Co-Founder',
    image: '/team/michael-rodriguez.jpg',
    imageFallback: '/team/placeholder.png',
    bio: 'Ex-AWS engineering leader with deep expertise in distributed systems and API design. Michael leads our technical vision and architecture.',
    linkedin: 'https://linkedin.com/in/',
    twitter: 'https://twitter.com/'
  },
  {
    id: 3,
    name: 'Aisha Johnson',
    role: 'Head of Product',
    image: '/team/aisha-johnson.jpg',
    imageFallback: '/team/placeholder.png',
    bio: 'Product visionary who previously led teams at Slack and Stripe. Aisha is passionate about creating intuitive user experiences for complex workflows.',
    linkedin: 'https://linkedin.com/in/',
    twitter: 'https://twitter.com/'
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Head of AI',
    image: '/team/david-kim.jpg',
    imageFallback: '/team/placeholder.png',
    bio: 'PhD in Machine Learning from MIT with experience at OpenAI. David leads our AI initiatives, including the Jarvis voice agent and workflow intelligence.',
    linkedin: 'https://linkedin.com/in/',
    twitter: 'https://twitter.com/'
  },
  {
    id: 5,
    name: 'Lisa Patel',
    role: 'Head of Customer Success',
    image: '/team/lisa-patel.jpg',
    imageFallback: '/team/placeholder.png',
    bio: 'Customer-obsessed leader who ensures our users get maximum value from Optiflow. Previously led support teams at Salesforce and Zendesk.',
    linkedin: 'https://linkedin.com/in/',
    twitter: 'https://twitter.com/'
  },
  {
    id: 6,
    name: 'James Wilson',
    role: 'Head of Engineering',
    image: '/team/james-wilson.jpg',
    imageFallback: '/team/placeholder.png',
    bio: 'Seasoned engineering leader with a track record of building reliable, scalable systems. James oversees our engineering teams and technical operations.',
    linkedin: 'https://linkedin.com/in/',
    twitter: 'https://twitter.com/'
  }
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

// Open positions
const openPositions = [
  {
    title: 'Senior AI Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time'
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'San Francisco, CA',
    type: 'Full-time'
  },
  {
    title: 'Customer Success Manager',
    department: 'Customer Support',
    location: 'Remote',
    type: 'Full-time'
  }
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

// Company values
const companyValues = [
  {
    title: 'User-Centered Innovation',
    description: 'We put users at the center of everything we build. Our product decisions are driven by real user needs and feedback.'
  },
  {
    title: 'Radical Simplicity',
    description: 'We believe powerful technology should be easy to use. We strive to make complex processes simple and intuitive.'
  },
  {
    title: 'Continuous Improvement',
    description: 'We embrace a culture of learning and iteration. Every day, we work to make our product, our processes, and ourselves better.'
  },
  {
    title: 'Transparent Communication',
    description: 'We believe in open, honest communication within our team and with our customers. We share both successes and challenges.'
  },
  {
    title: 'Ethical AI Development',
    description: 'We develop AI systems responsibly, with human oversight and clear principles for privacy, fairness, and transparency.'
  }
];

export default function AboutPage() {
  return (
    <div className="bg-[#111111] text-[#E5E7EB]">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#22D3EE]">
              Our Mission Is to <span className="text-white">Empower Everyone</span> With Automation
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
      
      {/* Team Section */}
      <section className="py-16 bg-[#111111]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center">Our Team</h2>
            <p className="text-[#9CA3AF] text-center mb-12">The talented people behind Optiflow</p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-[#18181B] rounded-lg overflow-hidden border border-[#374151]">
                  <div className="aspect-square relative">
                    <Image 
                      src={member.imageFallback} 
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                    <p className="text-[#22D3EE] mb-3">{member.role}</p>
                    <p className="text-[#9CA3AF] text-sm mb-4">{member.bio}</p>
                    
                    <div className="flex space-x-3">
                      <a 
                        href={member.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#9CA3AF] hover:text-[#22D3EE] transition-colors"
                        aria-label={`${member.name}'s LinkedIn`}
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                      
                      <a 
                        href={member.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#9CA3AF] hover:text-[#22D3EE] transition-colors"
                        aria-label={`${member.name}'s Twitter`}
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Link
                href="/careers"
                className="inline-flex items-center px-6 py-3 bg-[#1E293B] text-[#E5E7EB] font-medium rounded-md hover:bg-[#374151] transition-colors"
              >
                Join Our Growing Team
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
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