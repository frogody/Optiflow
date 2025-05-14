'use client';

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  UserCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

// Define types for form steps and data
type FormStep = {
  id: string;
  title: string;
  description?: string;
  component: React.ReactNode;
};

type FormData = {
  intendedUse: string;
  usageFrequency: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  companyWebsite: string;
  companySize: string;
  industry: string;
  useCase: string;
  additionalInfo: string;
  joinReason: string;
  isAiConsultant: boolean;
};

export default function BetaRegistration() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    intendedUse: '',
    usageFrequency: '',
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    companyWebsite: '',
    companySize: '',
    industry: '',
    useCase: '',
    additionalInfo: '',
    joinReason: '',
    isAiConsultant: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Update form data
  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user makes changes
    if (errorMessage) setErrorMessage(null);
  };

  // Step navigation
  const goToNextStep = () => {
    if (currentStepIndex < formSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // Check for required fields before submission
      if (formData.joinReason.length < 10) {
        throw new Error('Please provide a reason for joining the beta program (min. 10 characters)');
      }
      
      // Send the data to the API
      const response = await fetch('/api/beta-access/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle different types of errors
        if (response.status === 409) {
          throw new Error('An account with this email already exists. Please use a different email address.');
        } else if (response.status === 400 && data.details) {
          // Format validation errors
          const errorDetails = data.details.map((err: any) => `${err.path}: ${err.message}`).join(', ');
          throw new Error(`Please fix the following issues: ${errorDetails}`);
        } else {
          throw new Error(data.error || 'Failed to submit beta request');
        }
      }
      
      // Show success state
      setIsSubmitted(true);
      
      // Log the response data
      console.log('Beta request submitted:', data);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit your application. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Scroll to top of form when step changes
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentStepIndex]);

  // Define form steps
  const formSteps: FormStep[] = [
    {
      id: 'intended-use',
      title: 'How do you plan to use our platform?',
      description: 'This helps us understand your needs better.',
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                updateFormData('intendedUse', 'personal');
                goToNextStep();
              }}
              className={`p-6 border rounded-xl hover:bg-white/5 transition-all duration-200 text-left ${
                formData.intendedUse === 'personal'
                  ? 'border-[#3CDFFF] bg-[#3CDFFF]/5'
                  : 'border-white/10'
              }`}
            >
              <UserCircleIcon className="h-8 w-8 text-[#3CDFFF] mb-3" />
              <h3 className="text-lg font-medium mb-2">Personal Use</h3>
              <p className="text-sm text-gray-400">
                I'm interested in using the platform for my personal projects or individual needs.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                updateFormData('intendedUse', 'professional');
                goToNextStep();
              }}
              className={`p-6 border rounded-xl hover:bg-white/5 transition-all duration-200 text-left ${
                formData.intendedUse === 'professional'
                  ? 'border-[#3CDFFF] bg-[#3CDFFF]/5'
                  : 'border-white/10'
              }`}
            >
              <BriefcaseIcon className="h-8 w-8 text-[#3CDFFF] mb-3" />
              <h3 className="text-lg font-medium mb-2">Professional Use</h3>
              <p className="text-sm text-gray-400">
                I plan to use this for my work or professional activities.
              </p>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                updateFormData('intendedUse', 'business');
                goToNextStep();
              }}
              className={`p-6 border rounded-xl hover:bg-white/5 transition-all duration-200 text-left ${
                formData.intendedUse === 'business'
                  ? 'border-[#3CDFFF] bg-[#3CDFFF]/5'
                  : 'border-white/10'
              }`}
            >
              <BuildingOfficeIcon className="h-8 w-8 text-[#3CDFFF] mb-3" />
              <h3 className="text-lg font-medium mb-2">Business/Organization</h3>
              <p className="text-sm text-gray-400">
                I'm looking for a solution for my company or organization.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                updateFormData('intendedUse', 'consultant');
                updateFormData('isAiConsultant', true);
                goToNextStep();
              }}
              className={`p-6 border rounded-xl hover:bg-white/5 transition-all duration-200 text-left ${
                formData.intendedUse === 'consultant'
                  ? 'border-[#3CDFFF] bg-[#3CDFFF]/5'
                  : 'border-white/10'
              }`}
            >
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-[#3CDFFF] mb-3" />
              <h3 className="text-lg font-medium mb-2">AI Consultant</h3>
              <p className="text-sm text-gray-400">
                I help others implement AI solutions and need tools for my clients.
              </p>
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'usage-frequency',
      title: 'How often would you use our platform?',
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {['Daily', 'Few times a week', 'Weekly', 'Monthly', 'Just exploring'].map((frequency) => (
              <button
                key={frequency}
                type="button"
                onClick={() => {
                  updateFormData('usageFrequency', frequency);
                  goToNextStep();
                }}
                className={`p-4 border rounded-xl hover:bg-white/5 transition-all duration-200 text-left ${
                  formData.usageFrequency === frequency
                    ? 'border-[#3CDFFF] bg-[#3CDFFF]/5'
                    : 'border-white/10'
                }`}
              >
                {frequency}
              </button>
            ))}
          </div>
          
          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={goToPreviousStep}
              className="px-4 py-2 text-gray-400 hover:text-white flex items-center"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'personal-info',
      title: 'Tell us about yourself',
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => updateFormData('firstName', e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CDFFF]/50 text-white placeholder-gray-500"
                placeholder="John"
                required
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={(e) => updateFormData('lastName', e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CDFFF]/50 text-white placeholder-gray-500"
                placeholder="Smith"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Work Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CDFFF]/50 text-white placeholder-gray-500"
              placeholder="john@company.com"
              required
            />
          </div>
          
          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={goToPreviousStep}
              className="px-4 py-2 text-gray-400 hover:text-white flex items-center"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back
            </button>
            
            <button
              type="button"
              onClick={goToNextStep}
              disabled={!formData.firstName || !formData.lastName || !formData.email}
              className="px-6 py-2 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-lg text-black text-lg font-medium hover:opacity-90 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'company-info',
      title: 'Tell us about your company',
      description: 'We want to understand your organization better.',
      component: (
        <div className="space-y-4">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-1">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={(e) => updateFormData('companyName', e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CDFFF]/50 text-white placeholder-gray-500"
              placeholder="Acme Inc."
              required
            />
          </div>
          
          <div>
            <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-300 mb-1">Company Website</label>
            <input
              type="url"
              id="companyWebsite"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={(e) => updateFormData('companyWebsite', e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CDFFF]/50 text-white placeholder-gray-500"
              placeholder="https://acme.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="companySize" className="block text-sm font-medium text-gray-300 mb-1">Company Size</label>
            <select
              id="companySize"
              name="companySize"
              value={formData.companySize}
              onChange={(e) => updateFormData('companySize', e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CDFFF]/50 text-white placeholder-gray-500"
              required
            >
              <option value="" disabled>Select company size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501-1000">501-1000 employees</option>
              <option value="1001-5000">1001-5000 employees</option>
              <option value="5000+">5000+ employees</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-300 mb-1">Industry</label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={(e) => updateFormData('industry', e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CDFFF]/50 text-white placeholder-gray-500"
              required
            >
              <option value="" disabled>Select industry</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Retail">Retail</option>
              <option value="Media">Media & Entertainment</option>
              <option value="Consulting">Consulting</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Transportation">Transportation</option>
              <option value="Energy">Energy</option>
              <option value="Government">Government</option>
              <option value="Non-profit">Non-profit</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={goToPreviousStep}
              className="px-4 py-2 text-gray-400 hover:text-white flex items-center"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back
            </button>
            
            <button
              type="button"
              onClick={goToNextStep}
              disabled={!formData.companyName || !formData.companyWebsite || !formData.companySize || !formData.industry}
              className="px-6 py-2 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-lg text-black text-lg font-medium hover:opacity-90 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'use-case',
      title: 'What problems are you looking to solve?',
      description: 'Help us understand how we can best assist you.',
      component: (
        <div className="space-y-4">
          <div>
            <label htmlFor="useCase" className="block text-sm font-medium text-gray-300 mb-1">Use Case</label>
            <select
              id="useCase"
              name="useCase"
              value={formData.useCase}
              onChange={(e) => updateFormData('useCase', e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CDFFF]/50 text-white placeholder-gray-500"
              required
            >
              <option value="" disabled>Select primary use case</option>
              <option value="Workflow Automation">Workflow Automation</option>
              <option value="Customer Support">Customer Support</option>
              <option value="Document Processing">Document Processing</option>
              <option value="Data Analysis">Data Analysis</option>
              <option value="Content Creation">Content Creation</option>
              <option value="Internal Tools">Internal Tools</option>
              <option value="Product Integration">Product Integration</option>
              <option value="AI Assistants">AI Assistants</option>
              <option value="Voice Applications">Voice Applications</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-300 mb-1">
              Additional Details
              <span className="text-gray-400 ml-1">(min. 10 characters)</span>
            </label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={(e) => updateFormData('additionalInfo', e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CDFFF]/50 text-white placeholder-gray-500"
              placeholder="Please describe your use case or problem in more detail..."
              rows={4}
              required
            />
          </div>
          
          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={goToPreviousStep}
              className="px-4 py-2 text-gray-400 hover:text-white flex items-center"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back
            </button>
            
            <button
              type="button"
              onClick={goToNextStep}
              disabled={!formData.useCase || formData.additionalInfo.length < 10}
              className="px-6 py-2 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-lg text-black text-lg font-medium hover:opacity-90 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'join-reasons',
      title: 'Why do you want to join our beta program?',
      description: 'This helps us prioritize access to users who align with our current focus.',
      component: (
        <div className="space-y-4">
          <div>
            <label htmlFor="joinReason" className="block text-sm font-medium text-gray-300 mb-1">
              Your Motivation
              <span className="text-gray-400 ml-1">(min. 10 characters)</span>
            </label>
            <textarea
              id="joinReason"
              name="joinReason"
              value={formData.joinReason}
              onChange={(e) => updateFormData('joinReason', e.target.value)}
              className={`w-full px-4 py-2 bg-white/5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CDFFF]/50 text-white placeholder-gray-500 ${
                formData.joinReason.length < 10 && formData.joinReason.length > 0
                  ? 'border-red-500/50'
                  : 'border-white/10'
              }`}
              placeholder="Tell us why you're interested in being part of our beta program and what you hope to achieve..."
              rows={4}
              required
            />
            <div className="flex justify-between mt-1 text-xs">
              <span className={formData.joinReason.length < 10 && formData.joinReason.length > 0 ? 'text-red-400' : 'text-gray-500'}>
                {formData.joinReason.length < 10 
                  ? `${formData.joinReason.length}/10 characters (minimum)`
                  : `${formData.joinReason.length} characters`}
              </span>
              {formData.joinReason.length < 10 && formData.joinReason.length > 0 && (
                <span className="text-red-400">Please enter at least 10 characters</span>
              )}
            </div>
          </div>
          
          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={goToPreviousStep}
              className="px-4 py-2 text-gray-400 hover:text-white flex items-center"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back
            </button>
            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || formData.joinReason.length < 10}
              className="px-6 py-2 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-lg text-black text-lg font-medium hover:opacity-90 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#111111] text-white">
      {/* Animated background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-gradient-to-r from-[#3CDFFF]/10 to-[#4AFFD4]/5 rounded-full filter blur-[100px] opacity-30 animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-purple-500/20 to-indigo-500/5 rounded-full filter blur-[80px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center relative z-10 px-4 py-12">
        {/* Logo */}
        <Link href="/" className="mb-12">
          <Image 
            src="/ISYNCSO_LOGO.png" 
            alt="SYNC" 
            width={180} 
            height={60}
            priority
          />
        </Link>
        
        <div className="w-full max-w-3xl" ref={formRef}>
          {/* Success Screen */}
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center"
            >
              <div className="w-20 h-20 bg-[#4AFFD4]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="h-12 w-12 text-[#4AFFD4]" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Application Received!</h2>
              <p className="text-xl text-gray-300 mb-8">
                Thanks for your interest in SYNC, {formData.firstName}! We'll review your application and get back to you soon.
              </p>
              <p className="text-gray-400 mb-8">
                We prioritize applications based on use case and industry fit. You'll receive an email at <span className="text-[#3CDFFF]">{formData.email}</span> with your invitation code when you're approved.
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <Link 
                  href="/" 
                  className="px-6 py-3 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-lg text-black font-medium hover:opacity-90 transition-all duration-300"
                >
                  Return to Home
                </Link>
                <Link 
                  href="/login" 
                  className="px-6 py-3 border border-[#3CDFFF] text-[#3CDFFF] rounded-lg font-medium hover:bg-[#3CDFFF]/10 transition-all duration-300"
                >
                  Go to Login
                </Link>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Form Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-3">Beta Registration</h1>
                <p className="text-lg text-gray-400">
                  Join our exclusive beta program to get early access to SYNC
                </p>
              </div>
              
              {/* Error Message Display */}
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-white">
                  <p className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errorMessage}
                  </p>
                </div>
              )}
              
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] transition-all duration-300"
                    style={{ width: `${((currentStepIndex + 1) / formSteps.length) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Start</span>
                  <span>{`Step ${currentStepIndex + 1} of ${formSteps.length}`}</span>
                  <span>Complete</span>
                </div>
              </div>

              {/* Form Content */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">{formSteps[currentStepIndex].title}</h2>
                  {formSteps[currentStepIndex].description && (
                    <p className="text-gray-400 mt-2">{formSteps[currentStepIndex].description}</p>
                  )}
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`step-${currentStepIndex}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {formSteps[currentStepIndex].component}
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
