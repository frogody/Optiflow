'use client';

import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function RequestIntegrationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    appName: '',
    appWebsite: '',
    appDescription: '',
    useCase: '',
    email: '',
    priority: 'medium'
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.appName.trim() || !formData.useCase.trim()) {
      toast.error('Please fill out the required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, this would be an API call to submit the request
    // For this demo, we'll simulate an API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Integration request submitted successfully!');
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit integration request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-[#E5E7EB]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link 
            href="/integrations" 
            className="inline-flex items-center text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Integrations
          </Link>
        </div>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#22D3EE] mb-2">Request an Integration</h1>
          <p className="text-[#9CA3AF]">
            Can't find the integration you need? Submit a request and our team will consider adding it to our platform.
          </p>
        </div>
        
        {submitted ? (
          <div className="bg-[#18181B] border border-[#374151] rounded-lg p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#022c22] mb-4">
              <CheckCircleIcon className="h-8 w-8 text-[#22D3EE]" />
            </div>
            <h2 className="text-xl font-medium text-[#E5E7EB] mb-2">Request Submitted</h2>
            <p className="text-[#9CA3AF] mb-6">
              Thank you for your integration request! We'll review your submission and reach out if we need more information.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/integrations" 
                className="px-4 py-2 border border-[#374151] text-[#E5E7EB] rounded-md hover:bg-[#1E293B] transition-colors"
              >
                Return to Integrations
              </Link>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    appName: '',
                    appWebsite: '',
                    appDescription: '',
                    useCase: '',
                    email: '',
                    priority: 'medium'
                  });
                }}
                className="px-4 py-2 bg-[#22D3EE] text-[#111111] rounded-md hover:bg-[#06B6D4] transition-colors flex items-center justify-center"
              >
                <PlusCircleIcon className="mr-2 h-5 w-5" />
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#18181B] border border-[#374151] rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* App Details Section */}
              <div>
                <h2 className="text-xl font-medium text-[#E5E7EB] mb-4">Integration Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="appName" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                      App Name <span className="text-[#F87171]">*</span>
                    </label>
                    <input
                      type="text"
                      id="appName"
                      name="appName"
                      value={formData.appName}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Salesforce, Notion, Airtable"
                      className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="appWebsite" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                      App Website URL
                    </label>
                    <input
                      type="url"
                      id="appWebsite"
                      name="appWebsite"
                      value={formData.appWebsite}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="appDescription" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                      Brief Description of the App
                    </label>
                    <textarea
                      id="appDescription"
                      name="appDescription"
                      value={formData.appDescription}
                      onChange={handleInputChange}
                      placeholder="What does this app or service do?"
                      rows={3}
                      className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              {/* Use Case Section */}
              <div>
                <h2 className="text-xl font-medium text-[#E5E7EB] mb-4">Your Use Case</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="useCase" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                      How Would You Use This Integration? <span className="text-[#F87171]">*</span>
                    </label>
                    <textarea
                      id="useCase"
                      name="useCase"
                      value={formData.useCase}
                      onChange={handleInputChange}
                      required
                      placeholder="Describe your workflow and how you would use this integration with Optiflow"
                      rows={5}
                      className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                      aria-label="Select priority"
                    >
                      <option value="low">Low - Nice to have</option>
                      <option value="medium">Medium - Would improve my workflow</option>
                      <option value="high">High - Critical for my business</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-medium text-[#E5E7EB] mb-4">Contact Information</h2>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                    Email Address (if different from your account email)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    We'll use this email to notify you about updates to this integration request
                  </p>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="pt-4 border-t border-[#374151] flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#111111]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isSubmitting ? 'Submitting...' : 'Submit Integration Request'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Popular Requests Section */}
        <div className="mt-8 bg-[#18181B] border border-[#374151] rounded-lg p-6">
          <h2 className="text-xl font-medium text-[#E5E7EB] mb-4">Currently Under Consideration</h2>
          <p className="text-[#9CA3AF] mb-4">
            These integrations have been requested by multiple users and are being evaluated by our team.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#1E293B] rounded-lg">
              <h3 className="font-medium text-[#E5E7EB] mb-1">Notion</h3>
              <p className="text-xs text-[#9CA3AF]">10 requests • Planned for Q1 2024</p>
            </div>
            <div className="p-4 bg-[#1E293B] rounded-lg">
              <h3 className="font-medium text-[#E5E7EB] mb-1">Microsoft Teams</h3>
              <p className="text-xs text-[#9CA3AF]">8 requests • In development</p>
            </div>
            <div className="p-4 bg-[#1E293B] rounded-lg">
              <h3 className="font-medium text-[#E5E7EB] mb-1">Shopify</h3>
              <p className="text-xs text-[#9CA3AF]">7 requests • Under review</p>
            </div>
            <div className="p-4 bg-[#1E293B] rounded-lg">
              <h3 className="font-medium text-[#E5E7EB] mb-1">Linkedin</h3>
              <p className="text-xs text-[#9CA3AF]">5 requests • Under review</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 