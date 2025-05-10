'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  UserGroupIcon,
  AcademicCapIcon,
  HeartIcon,
  GlobeAltIcon,
  SparklesIcon,
  ClockIcon,
  HomeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

// Job openings data
const jobOpenings = [
  {
    id: 'job-1',
    title: 'Senior AI Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'We\'re looking for an experienced AI Engineer to help design and develop our core machine learning models and AI capabilities.',
    responsibilities: [
      'Design, develop, and optimize machine learning models for various workflow automation tasks',
      'Collaborate with product and engineering teams to integrate AI capabilities into our platform',
      'Research and implement state-of-the-art techniques in natural language processing and computer vision',
      'Develop efficient and scalable data processing pipelines',
      'Evaluate model performance and continuously improve algorithms'
    ],
    requirements: [
      'BS/MS/PhD in Computer Science, Machine Learning, or a related field',
      '5+ years of experience in machine learning and AI development',
      'Strong programming skills in Python and familiarity with ML frameworks like TensorFlow or PyTorch',
      'Experience with NLP, computer vision, or reinforcement learning',
      'Strong problem-solving abilities and attention to detail',
      'Excellent communication and collaboration skills'
    ]
  },
  {
    id: 'job-2',
    title: 'Product Designer',
    department: 'Design',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'We're seeking a talented Product Designer to create intuitive and delightful user experiences for our workflow automation platform.',
    responsibilities: [
      'Design user interfaces for web and mobile applications that are both beautiful and functional',
      'Create wireframes, prototypes, and high-fidelity designs',
      'Conduct user research and usability testing to inform design decisions',
      'Collaborate with engineers to ensure designs are implemented accurately',
      'Help establish and maintain our design system'
    ],
    requirements: [
      'Bachelor's degree in Design, HCI, or related field',
      '3+ years of product design experience, preferably for SaaS or enterprise products',
      'Strong portfolio demonstrating UX/UI design skills',
      'Proficiency in design tools like Figma, Sketch, or Adobe Creative Suite',
      'Experience with design systems and component-based design',
      'Ability to clearly communicate design decisions and respond to feedback'
    ]
  },
  {
    id: 'job-3',
    title: 'Customer Success Manager',
    department: 'Customer Support',
    location: 'Remote',
    type: 'Full-time',
    description: 'Join our Customer Success team to help our customers get the most value from our platform and become Optiflow champions.',
    responsibilities: [
      'Serve as the primary point of contact for a portfolio of enterprise customers',
      'Develop and maintain strong relationships with key stakeholders',
      'Provide product training and best practices guidance',
      'Monitor customer health and proactively address potential issues',
      'Identify opportunities for customers to expand their use of our platform'
    ],
    requirements: [
      'Bachelor's degree or equivalent practical experience',
      '3+ years of experience in customer success, account management, or similar roles',
      'Strong interpersonal and communication skills',
      'Problem-solving mindset and ability to work in a fast-paced environment',
      'Experience with CRM systems and customer success tools',
      'Technical aptitude and ability to learn new software quickly'
    ]
  },
  {
    id: 'job-4',
    title: 'Full Stack Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'We're looking for a Full Stack Developer to help build and maintain our web applications and services.',
    responsibilities: [
      'Develop and maintain features across our full stack',
      'Write clean, maintainable, and efficient code',
      'Collaborate with designers, product managers, and other engineers',
      'Troubleshoot and debug issues across the stack',
      'Participate in code reviews and contribute to engineering best practices'
    ],
    requirements: [
      'Bachelor's degree in Computer Science or equivalent experience',
      '3+ years of experience in full stack development',
      'Proficiency in JavaScript/TypeScript, React, Node.js, and modern front-end frameworks',
      'Experience with databases (SQL and NoSQL)',
      'Understanding of REST APIs and microservices architecture',
      'Strong problem-solving skills and attention to detail'
    ]
  },
  {
    id: 'job-5',
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'Join our marketing team to help drive awareness and adoption of Optiflow's automation platform.',
    responsibilities: [
      'Develop and execute marketing campaigns across various channels',
      'Create compelling content for our website, blog, and social media',
      'Manage digital advertising programs and track performance',
      'Collaborate with sales team to generate qualified leads',
      'Analyze marketing metrics and optimize strategies'
    ],
    requirements: [
      'Bachelor's degree in Marketing, Communications, or related field',
      '4+ years of B2B marketing experience, preferably in SaaS',
      'Strong writing and content creation skills',
      'Experience with marketing automation and CRM tools',
      'Data-driven approach to marketing strategy',
      'Excellent project management and organizational skills'
    ]
  },
];

// Company benefits
const benefits = [
  {
    icon: CurrencyDollarIcon,
    title: 'Competitive Compensation',
    description: 'Competitive salary, equity, and performance bonuses to reward your contributions.'
  },
  {
    icon: HeartIcon,
    title: 'Comprehensive Healthcare',
    description: 'Full medical, dental, and vision coverage for you and your dependents.'
  },
  {
    icon: ClockIcon,
    title: 'Flexible PTO',
    description: 'Unlimited paid time off policy that encourages work-life balance.'
  },
  {
    icon: HomeIcon,
    title: 'Remote-Friendly',
    description: 'Work from anywhere with our distributed-first approach.'
  },
  {
    icon: AcademicCapIcon,
    title: 'Learning & Development',
    description: 'Dedicated budget for conferences, courses, and continuous learning.'
  },
  {
    icon: GlobeAltIcon,
    title: 'Parental Leave',
    description: 'Generous parental leave policy for growing families.'
  },
];

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Get unique departments for filter
  const departments = ['All', ...Array.from(new Set(jobOpenings.map(job => job.department)))];

  // Filter jobs based on search query and department
  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'All' || job.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  // Get the selected job details
  const jobDetails = selectedJob ? jobOpenings.find(job => job.id === selectedJob) : null;

  return (
    <div className="bg-[#111111] text-[#E5E7EB] min-h-screen">
      {/* Hero section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#22D3EE]">
          Join Our Mission to Transform Work
        </h1>
        <p className="text-xl max-w-3xl mx-auto text-[#9CA3AF]">
          We're a team of builders, innovators, and problem-solvers on a mission to make powerful AI and automation accessible to everyone.
        </p>
      </section>

      {/* Company Culture */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] opacity-80 rounded-xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <UserGroupIcon className="h-32 w-32 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6 text-[#22D3EE]">Our Culture</h2>
            <p className="mb-4 text-[#E5E7EB]">
              At Optiflow, we believe in fostering a culture where innovation thrives, diverse perspectives are valued, and everyone can do their best work.
            </p>
            <p className="mb-4 text-[#E5E7EB]">
              We work in small, autonomous teams with the freedom to move fast and make impactful decisions. We embrace a culture of continuous learning, open feedback, and constant improvement.
            </p>
            <p className="text-[#E5E7EB]">
              We're a remote-friendly company that values results over rigid schedules, offering the flexibility for our team to work when and where they're most productive.
            </p>
          </div>
        </div>
      </section>
      
      {/* Values section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#18181B] rounded-xl">
        <h2 className="text-3xl font-bold mb-10 text-center text-[#22D3EE]">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#111111] p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-[#1E293B] rounded-lg mr-3">
                <SparklesIcon className="h-6 w-6 text-[#22D3EE]" />
              </div>
              <h3 className="text-xl font-medium text-[#E5E7EB]">Innovation</h3>
            </div>
            <p className="text-[#9CA3AF]">
              We push boundaries and embrace new ideas, technologies, and approaches to create exceptional products.
            </p>
          </div>
          <div className="bg-[#111111] p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-[#1E293B] rounded-lg mr-3">
                <UserGroupIcon className="h-6 w-6 text-[#22D3EE]" />
              </div>
              <h3 className="text-xl font-medium text-[#E5E7EB]">Collaboration</h3>
            </div>
            <p className="text-[#9CA3AF]">
              We believe in the power of diverse perspectives working together. We're better when we collaborate across teams and disciplines.
            </p>
          </div>
          <div className="bg-[#111111] p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-[#1E293B] rounded-lg mr-3">
                <GlobeAltIcon className="h-6 w-6 text-[#22D3EE]" />
              </div>
              <h3 className="text-xl font-medium text-[#E5E7EB]">Impact</h3>
            </div>
            <p className="text-[#9CA3AF]">
              We focus on work that makes a meaningful difference for our customers and changes how people work for the better.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center text-[#22D3EE]">Why Work With Us</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-[#18181B] p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-[#1E293B] rounded-lg mr-3">
                  <benefit.icon className="h-6 w-6 text-[#22D3EE]" />
                </div>
                <h3 className="text-xl font-medium text-[#E5E7EB]">{benefit.title}</h3>
              </div>
              <p className="text-[#9CA3AF]">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Job Listings section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="openings">
        <h2 className="text-3xl font-bold mb-10 text-center text-[#22D3EE]">Open Positions</h2>
        
        {/* Search and filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search positions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-[#18181B] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full md:w-auto px-4 py-2 bg-[#18181B] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
        
        {selectedJob ? (
          // Job details view
          <div className="bg-[#18181B] rounded-xl p-6 md:p-8">
            <button
              onClick={() => setSelectedJob(null)}
              className="text-[#22D3EE] hover:text-[#06B6D4] mb-6 flex items-center"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to all positions
            </button>
            
            <div className="mb-6 pb-6 border-b border-[#374151]">
              <h3 className="text-2xl font-bold text-[#E5E7EB] mb-2">{jobDetails?.title}</h3>
              <div className="flex flex-wrap gap-4 text-[#9CA3AF]">
                <div className="flex items-center">
                  <BriefcaseIcon className="h-5 w-5 mr-1" />
                  <span>{jobDetails?.department}</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-1" />
                  <span>{jobDetails?.location}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-1" />
                  <span>{jobDetails?.type}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <p className="text-[#E5E7EB] mb-6">{jobDetails?.description}</p>
              
              <h4 className="text-xl font-medium text-[#E5E7EB] mb-4">Responsibilities</h4>
              <ul className="list-disc pl-6 space-y-2 text-[#9CA3AF] mb-8">
                {jobDetails?.responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              
              <h4 className="text-xl font-medium text-[#E5E7EB] mb-4">Requirements</h4>
              <ul className="list-disc pl-6 space-y-2 text-[#9CA3AF] mb-8">
                {jobDetails?.requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a 
                href={`/apply/${jobDetails?.id}`}
                className="px-5 py-3 bg-[#22D3EE] text-[#111111] rounded-md font-medium hover:bg-[#06B6D4] transition-colors inline-flex justify-center"
              >
                Apply for this position
              </a>
              <button 
                className="px-5 py-3 bg-transparent border border-[#374151] text-[#E5E7EB] rounded-md font-medium hover:bg-[#1E293B] transition-colors inline-flex justify-center"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
              >
                Share this job
              </button>
            </div>
          </div>
        ) : (
          // Job listings view
          <>
            {filteredJobs.length > 0 ? (
              <div className="bg-[#18181B] rounded-xl overflow-hidden">
                <div className="grid grid-cols-1 divide-y divide-[#374151]">
                  {filteredJobs.map((job) => (
                    <div key={job.id} className="p-6 hover:bg-[#1E293B] transition-colors">
                      <div className="md:flex md:justify-between md:items-center">
                        <div className="mb-4 md:mb-0">
                          <h3 className="text-xl font-medium text-[#E5E7EB] mb-2">{job.title}</h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[#9CA3AF]">
                            <div className="flex items-center">
                              <BriefcaseIcon className="h-5 w-5 mr-1" />
                              <span>{job.department}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPinIcon className="h-5 w-5 mr-1" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center">
                              <ClockIcon className="h-5 w-5 mr-1" />
                              <span>{job.type}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedJob(job.id)}
                          className="text-[#22D3EE] hover:text-[#06B6D4] font-medium flex items-center"
                        >
                          View Details
                          <svg className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-[#18181B] rounded-xl p-8 text-center">
                <BriefcaseIcon className="h-12 w-12 text-[#9CA3AF] mx-auto mb-4" />
                <h3 className="text-xl font-medium text-[#E5E7EB] mb-2">No positions found</h3>
                <p className="text-[#9CA3AF]">
                  We couldn't find any positions matching your search. Try adjusting your filters or check back later.
                </p>
              </div>
            )}
          </>
        )}
      </section>

      {/* Application Process */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#18181B] rounded-xl">
        <h2 className="text-3xl font-bold mb-10 text-center text-[#22D3EE]">Our Hiring Process</h2>
        <div className="max-w-3xl mx-auto">
          <div className="space-y-12">
            <div className="relative pl-10 md:pl-0 md:grid md:grid-cols-5 md:gap-10">
              <div className="col-span-1 flex md:justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#22D3EE] text-[#111111] font-bold">
                  1
                </div>
                <div className="absolute top-10 bottom-0 left-5 w-px bg-[#374151] md:hidden"></div>
              </div>
              <div className="col-span-4 space-y-2">
                <h3 className="text-xl font-medium text-[#E5E7EB]">Application Review</h3>
                <p className="text-[#9CA3AF]">
                  Our team reviews your application to assess how your skills and experience align with the role requirements.
                </p>
              </div>
            </div>
            
            <div className="relative pl-10 md:pl-0 md:grid md:grid-cols-5 md:gap-10">
              <div className="col-span-1 flex md:justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#22D3EE] text-[#111111] font-bold">
                  2
                </div>
                <div className="absolute top-10 bottom-0 left-5 w-px bg-[#374151] md:hidden"></div>
              </div>
              <div className="col-span-4 space-y-2">
                <h3 className="text-xl font-medium text-[#E5E7EB]">Initial Screening</h3>
                <p className="text-[#9CA3AF]">
                  A 30-minute call with a recruiter to discuss your background, experience, and interest in the role.
                </p>
              </div>
            </div>
            
            <div className="relative pl-10 md:pl-0 md:grid md:grid-cols-5 md:gap-10">
              <div className="col-span-1 flex md:justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#22D3EE] text-[#111111] font-bold">
                  3
                </div>
                <div className="absolute top-10 bottom-0 left-5 w-px bg-[#374151] md:hidden"></div>
              </div>
              <div className="col-span-4 space-y-2">
                <h3 className="text-xl font-medium text-[#E5E7EB]">Technical Assessment</h3>
                <p className="text-[#9CA3AF]">
                  Depending on the role, you may be asked to complete a skills assessment or take-home project that reflects the kind of work you'll be doing.
                </p>
              </div>
            </div>
            
            <div className="relative pl-10 md:pl-0 md:grid md:grid-cols-5 md:gap-10">
              <div className="col-span-1 flex md:justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#22D3EE] text-[#111111] font-bold">
                  4
                </div>
                <div className="absolute top-10 bottom-0 left-5 w-px bg-[#374151] md:hidden"></div>
              </div>
              <div className="col-span-4 space-y-2">
                <h3 className="text-xl font-medium text-[#E5E7EB]">Team Interviews</h3>
                <p className="text-[#9CA3AF]">
                  Meet with team members and potential colleagues to dive deeper into your experience and assess team fit. We typically conduct 2-3 interviews with different team members.
                </p>
              </div>
            </div>
            
            <div className="relative pl-10 md:pl-0 md:grid md:grid-cols-5 md:gap-10">
              <div className="col-span-1 flex md:justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#22D3EE] text-[#111111] font-bold">
                  5
                </div>
              </div>
              <div className="col-span-4 space-y-2">
                <h3 className="text-xl font-medium text-[#E5E7EB]">Offer & Onboarding</h3>
                <p className="text-[#9CA3AF]">
                  If there's a mutual fit, we'll extend an offer and work with you to determine a start date. Our comprehensive onboarding process will help you get up to speed quickly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#18181B] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3 text-[#E5E7EB]">Don't See the Right Position?</h2>
          <p className="text-[#9CA3AF] mb-6 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. Send us your resume and let us know how you can contribute.
          </p>
          <Link href="/careers/general-application" className="px-5 py-3 bg-[#22D3EE] text-[#111111] rounded-md font-medium hover:bg-[#06B6D4] transition-colors inline-block">
            Submit a General Application
          </Link>
        </div>
      </section>
    </div>
  );
} 