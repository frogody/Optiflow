'use client';

import { useState } from 'react';
import {
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

export default function ContactSupport() {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    category: '',
    description: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, this would send the form data to a backend API
    setTicketId(`OPT-${Math.floor(100000 + Math.random() * 900000)}`);
    setFormSubmitted(true);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#22D3EE] mb-6">Contact Support</h1>
      
      {/* Contact channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#111111] border border-[#374151] rounded-lg p-6">
          <EnvelopeIcon className="h-8 w-8 text-[#22D3EE] mb-4" />
          <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">Email Support</h3>
          <p className="text-[#9CA3AF] mb-4">
            Send us an email and we'll get back to you within 24 hours.
          </p>
          <a href="mailto:support@optiflow.com" className="text-[#22D3EE] hover:text-[#06B6D4]">
            support@optiflow.com
          </a>
        </div>
        
        <div className="bg-[#111111] border border-[#374151] rounded-lg p-6">
          <ChatBubbleLeftRightIcon className="h-8 w-8 text-[#22D3EE] mb-4" />
          <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">Live Chat</h3>
          <p className="text-[#9CA3AF] mb-4">
            Chat with our support team during business hours.
          </p>
          <span className="text-sm text-[#22D3EE]">Mon-Fri, 9AM-5PM Eastern</span>
        </div>
        
        <div className="bg-[#111111] border border-[#374151] rounded-lg p-6">
          <PhoneIcon className="h-8 w-8 text-[#22D3EE] mb-4" />
          <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">Phone Support</h3>
          <p className="text-[#9CA3AF] mb-4">
            Available for Enterprise customers only.
          </p>
          <a href="tel:+18005551234" className="text-[#22D3EE] hover:text-[#06B6D4]">
            +1 (800) 555-1234
          </a>
        </div>
      </div>
      
      {formSubmitted ? (
        // Success message after form submission
        <div className="bg-[#111111] border border-[#374151] rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-[#134e4a] rounded-full mx-auto flex items-center justify-center mb-6">
            <DocumentTextIcon className="h-8 w-8 text-[#22D3EE]" />
          </div>
          <h2 className="text-2xl font-bold text-[#E5E7EB] mb-4">Support Ticket Created</h2>
          <p className="text-[#9CA3AF] mb-6 max-w-md mx-auto">
            Thank you for reaching out. We've received your request and will get back to you as soon as possible.
          </p>
          <div className="bg-[#1E293B] p-4 rounded-md inline-block mb-6">
            <span className="text-[#9CA3AF]">Your ticket ID: </span>
            <span className="text-[#22D3EE] font-bold">{ticketId}</span>
          </div>
          <p className="text-[#9CA3AF]">
            You'll receive a confirmation email shortly with your ticket details.
          </p>
        </div>
      ) : (
        // Support ticket form
        <div className="bg-[#111111] border border-[#374151] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#E5E7EB] mb-6">Submit a Support Request</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full py-2 px-3 bg-[#18181B] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full py-2 px-3 bg-[#18181B] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                placeholder="Brief description of your issue"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full py-2 px-3 bg-[#18181B] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                aria-label="Select issue category"
              >
                <option value="" disabled>Select a category</option>
                <option value="workflows">Workflows</option>
                <option value="integrations">Integrations</option>
                <option value="voice-agent">Voice Agent (Jarvis)</option>
                <option value="billing">Billing & Subscription</option>
                <option value="account">Account & Access</option>
                <option value="api">API & Development</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="w-full py-2 px-3 bg-[#18181B] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                placeholder="Please provide details about your issue"
              ></textarea>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors"
              >
                Submit Support Request
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Support tiers */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-[#E5E7EB] mb-6">Support Service Levels</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#374151]">
            <thead className="bg-[#111111]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Plan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Response Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Support Hours
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Channels
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#111111] divide-y divide-[#374151]">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E5E7EB]">Basic</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">Within 48 hours</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">Business days, 9AM-5PM ET</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">Email, Help Center</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E5E7EB]">Professional</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">Within 24 hours</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">Business days, 9AM-5PM ET</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">Email, Live Chat, Help Center</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E5E7EB]">Enterprise</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">Within 4 hours</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">24/7/365</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">Email, Chat, Phone, Dedicated Support</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 