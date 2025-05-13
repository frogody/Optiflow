'use client';

import { 
  ChatBubbleLeftRightIcon, 
  DocumentTextIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  PhoneIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';

// Social media icons
const SocialIcon = ({ href, label, children }: { href: string; label: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="bg-[#1E293B] hover:bg-[#2D3748] p-3 rounded-full transition-colors"
  >
    {children}
  </a>
);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    inquiryType: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState<{
    submitted: boolean;
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would normally send the form data to your backend
    // This is a mock implementation
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormStatus({
        submitted: true,
        success: true,
        message: 'Thank you for your message! We will get back to you within 1-2 business days.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        inquiryType: '',
        message: ''
      });
    } catch (error) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'There was an error submitting your message. Please try again or contact us directly via email.'
      });
    }
  };

  return (
    <div className="min-h-screen text-white bg-[#111111] relative overflow-x-hidden">
      {/* Animated Gradient Backgrounds */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-[700px] h-[700px] left-1/4 top-0 bg-gradient-to-br from-[#3CDFFF]/20 to-[#4AFFD4]/10 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute w-[600px] h-[600px] right-1/4 bottom-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/10 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <section className="relative py-24 overflow-hidden z-10">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-[#3CDFFF] to-white animate-gradient bg-300%">
            Get in Touch with Sync
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            We'd love to hear from you. Reach out with questions, feedback, or partnership inquiries.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="md:col-span-2 bg-[#18181B] rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-[#E5E7EB]">Send Us a Message</h2>

            {formStatus?.submitted ? (
              <div className={`p-4 rounded-lg ${formStatus.success ? 'bg-[#022c22] border border-[#10B981]' : 'bg-[#371520] border border-[#F87171]'}`}>
                <p className={`${formStatus.success ? 'text-[#10B981]' : 'text-[#F87171]'} font-medium mb-1`}>
                  {formStatus.success ? 'Message Sent!' : 'Submission Error'}
                </p>
                <p className="text-[#9CA3AF]">{formStatus.message}</p>
                
                {formStatus.success && (
                  <button 
                    onClick={() => setFormStatus(null)}
                    className="mt-4 text-[#22D3EE] hover:text-[#06B6D4] text-sm"
                  >
                    Send another message
                  </button>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                      aria-label="Your full name"
                      title="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                      aria-label="Your email address"
                      title="Your email address"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                      aria-label="Your company name"
                      title="Your company name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="inquiryType" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                      Inquiry Type *
                    </label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                      aria-label="Select inquiry type"
                      title="Select inquiry type"
                    >
                      <option value="" disabled>Select an option</option>
                      <option value="Sales">Sales</option>
                      <option value="Support">Support</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Media">Media</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="message" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent resize-none"
                      aria-label="Your message"
                      title="Your message"
                    ></textarea>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full px-5 py-3 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors"
                    aria-label="Submit contact form"
                    title="Submit contact form"
                  >
                    Send Message
                  </button>
                </div>
                
                <p className="mt-4 text-sm text-[#9CA3AF]">
                  By submitting this form, you agree to our <Link href="/privacy" className="text-[#22D3EE] hover:text-[#06B6D4]">Privacy Policy</Link>.
                </p>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div>
            {/* Alternative Contact Methods */}
            <div className="bg-[#18181B] rounded-xl p-6 md:p-8 mb-6">
              <h2 className="text-xl font-bold mb-6 text-[#E5E7EB]">Alternative Ways to Reach Us</h2>
              
              <div className="space-y-4">
                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 bg-[#1E293B] rounded-lg flex items-center justify-center mr-4">
                    <EnvelopeIcon className="h-5 w-5 text-[#22D3EE]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#E5E7EB] mb-1">Email</p>
                    <a href="mailto:hello@optiflow.com" className="text-[#9CA3AF] hover:text-[#22D3EE] transition-colors">
                      hello@optiflow.com
                    </a>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 bg-[#1E293B] rounded-lg flex items-center justify-center mr-4">
                    <EnvelopeIcon className="h-5 w-5 text-[#22D3EE]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#E5E7EB] mb-1">Department Emails</p>
                    <div className="space-y-2">
                      <a href="mailto:sales@optiflow.com" className="block text-[#9CA3AF] hover:text-[#22D3EE] transition-colors">
                        sales@optiflow.com
                      </a>
                      <a href="mailto:support@optiflow.com" className="block text-[#9CA3AF] hover:text-[#22D3EE] transition-colors">
                        support@optiflow.com
                      </a>
                      <a href="mailto:press@optiflow.com" className="block text-[#9CA3AF] hover:text-[#22D3EE] transition-colors">
                        press@optiflow.com
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 bg-[#1E293B] rounded-lg flex items-center justify-center mr-4">
                    <PhoneIcon className="h-5 w-5 text-[#22D3EE]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#E5E7EB] mb-1">Phone</p>
                    <a href="tel:+14155552671" className="text-[#9CA3AF] hover:text-[#22D3EE] transition-colors">
                      +1 (415) 555-2671
                    </a>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 bg-[#1E293B] rounded-lg flex items-center justify-center mr-4">
                    <MapPinIcon className="h-5 w-5 text-[#22D3EE]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#E5E7EB] mb-1">Headquarters</p>
                    <address className="text-[#9CA3AF] not-italic">
                      1234 Innovation Way<br />
                      San Francisco, CA 94107<br />
                      United States
                    </address>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Support Resources */}
            <div className="bg-[#18181B] rounded-xl p-6 md:p-8 mb-6">
              <h2 className="text-xl font-bold mb-6 text-[#E5E7EB]">Support Resources</h2>
              
              <div className="space-y-4">
                <Link href="/help" className="flex p-3 bg-[#1E293B] rounded-lg hover:bg-[#2D3748] transition-colors">
                  <QuestionMarkCircleIcon className="h-6 w-6 text-[#22D3EE] mr-3" />
                  <span className="text-[#E5E7EB]">Help Center</span>
                </Link>
                
                <Link href="/faq" className="flex p-3 bg-[#1E293B] rounded-lg hover:bg-[#2D3748] transition-colors">
                  <DocumentTextIcon className="h-6 w-6 text-[#22D3EE] mr-3" />
                  <span className="text-[#E5E7EB]">FAQ</span>
                </Link>
                
                <Link href="/help/community" className="flex p-3 bg-[#1E293B] rounded-lg hover:bg-[#2D3748] transition-colors">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-[#22D3EE] mr-3" />
                  <span className="text-[#E5E7EB]">Community Forum</span>
                </Link>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="bg-[#18181B] rounded-xl p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6 text-[#E5E7EB]">Connect With Us</h2>
              
              <div className="flex justify-between">
                <SocialIcon href="https://twitter.com/optiflow" label="Twitter">
                  <svg className="h-6 w-6 text-[#9CA3AF]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </SocialIcon>
                
                <SocialIcon href="https://linkedin.com/company/optiflow" label="LinkedIn">
                  <svg className="h-6 w-6 text-[#9CA3AF]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </SocialIcon>
                
                <SocialIcon href="https://github.com/optiflow" label="GitHub">
                  <svg className="h-6 w-6 text-[#9CA3AF]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </SocialIcon>
                
                <SocialIcon href="https://facebook.com/optiflow" label="Facebook">
                  <svg className="h-6 w-6 text-[#9CA3AF]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </SocialIcon>
                
                <SocialIcon href="https://youtube.com/optiflow" label="YouTube">
                  <svg className="h-6 w-6 text-[#9CA3AF]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </SocialIcon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 