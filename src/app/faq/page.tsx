'use client';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

// Heroicons removed to prevent React version conflicts
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// FAQ Item types
type FAQCategory = 
  | 'all'
  | 'general'
  | 'billing'
  | 'account'
  | 'workflows'
  | 'voice-agent'
  | 'integrations';

interface FAQItem {
  question: string;
  answer: string;
  category: Exclude<FAQCategory, 'all'>;
}

// FAQ Categories with icons
const categories: { id: FAQCategory; name: string; icon: any }[] = [
  { id: 'all', name: 'All Questions', icon: QuestionMarkCircleIcon },
  { id: 'general', name: 'General', icon: CubeIcon },
  { id: 'billing', name: 'Billing & Pricing', icon: CreditCardIcon },
  { id: 'account', name: 'Account Management', icon: UserIcon },
  { id: 'workflows', name: 'Workflows', icon: BoltIcon },
  { id: 'voice-agent', name: 'Voice Agent', icon: MicrophoneIcon },
  { id: 'integrations', name: 'Integrations', icon: PuzzlePieceIcon },
];

// FAQ content
const faqItems: FAQItem[] = [
  // General FAQs
  {
    question: 'What is Optiflow?',
    answer: 'Optiflow is an AI-powered workflow automation platform that enables users to create, manage, and monitor automated workflows across different applications without requiring extensive coding knowledge. It features an intuitive drag-and-drop interface, voice command capabilities with Jarvis, and seamless third-party integrations.',
    category: 'general',
  },
  {
    question: 'How can Optiflow help my business?',
    answer: 'Optiflow helps businesses streamline operations, reduce manual tasks, minimize human error, and increase productivity. By automating routine workflows, your team can focus on higher-value activities. Our platform offers solutions for various teams, including marketing, sales, operations, development, and customer support.',
    category: 'general',
  },
  {
    question: 'Do I need technical skills to use Optiflow?',
    answer: "No, Optiflow is designed for users of all technical backgrounds. Our visual workflow editor uses a simple drag-and-drop interface, and our AI assistant can even help you build workflows using natural language instructions. While technical knowledge can enable more complex workflows, it's not required to get started and achieve significant results.",
    category: 'general',
  },
  {
    question: 'Is my data secure with Optiflow?',
    answer: 'Yes, we take data security very seriously. Optiflow employs industry-standard encryption for data in transit and at rest, maintains strict access controls, and undergoes regular security audits. We are compliant with major regulations like GDPR and CCPA. For more details, please visit our Security page.',
    category: 'general',
  },
  
  // Billing & Pricing FAQs
  {
    question: 'How does the credit-based system work?',
    answer: 'Optiflow uses a credit system to provide flexibility in how you use our platform. Credits are consumed when you execute workflows, make API calls, process voice commands, and perform other operations. Each plan includes a monthly allocation of credits, and you can purchase additional credits if needed. This approach allows you to pay for what you actually use rather than features you may not need.',
    category: 'billing',
  },
  {
    question: 'What happens if I run out of credits?',
    answer: 'If you exhaust your monthly credit allocation, your workflows will continue to run without interruption as we automatically convert to a pay-as-you-go model. You can set up spending limits and alerts to manage costs. Alternatively, you can purchase additional credit packs in advance, which never expire, or upgrade to a higher tier plan with more included credits.',
    category: 'billing',
  },
  {
    question: 'Can I switch between plans?',
    answer: "Yes, you can upgrade your plan at any time, and the changes will take effect immediately. When downgrading, the changes will apply at the end of your current billing cycle. If you upgrade mid-cycle, you'll be charged the prorated difference and receive the additional credits immediately.",
    category: 'billing',
  },
  {
    question: 'Do you offer a free trial?',
    answer: 'Yes, we offer a 14-day free trial with full access to our Pro plan features and 500 credits. No credit card is required to start the trial. At the end of your trial, you can choose to subscribe to any of our plans or continue with our limited free tier.',
    category: 'billing',
  },
  {
    question: 'Are there discounts for annual billing?',
    answer: "Yes, we offer a 20% discount when you choose annual billing. You'll be billed for 12 months upfront and receive the full annual allocation of credits at the beginning of the billing cycle.",
    category: 'billing',
  },
  
  // Account Management FAQs
  {
    question: 'How do I create a team account?',
    answer: 'To create a team account, upgrade to our Pro or Enterprise plan, which includes team collaboration features. You can then invite team members via email from your account settings. Each team member will have their own login credentials and configurable permissions based on their role in your organization.',
    category: 'account',
  },
  {
    question: 'How can I reset my password?',
    answer: "To reset your password, click on the 'Forgot password?' link on the login page. Enter your email address, and we'll send you a password reset link. For security reasons, this link is valid for 24 hours. If you're already logged in, you can change your password through your profile settings.",
    category: 'account',
  },
  {
    question: 'How do I update my billing information?',
    answer: 'You can update your billing information in the "Billing" section of your account settings. Navigate to Settings > Billing > Payment Methods, where you can add, edit, or remove payment methods. For security, we do not store your full credit card details on our servers; we use a secure third-party payment processor.',
    category: 'account',
  },
  {
    question: 'Can I transfer my account to someone else?',
    answer: 'Account transfers are handled on a case-by-case basis. For personal accounts, please contact our support team to assist with transferring ownership. For business accounts, an administrator can manage user access and roles without needing to transfer the entire account.',
    category: 'account',
  },
  
  // Workflow FAQs
  {
    question: 'How do I create my first workflow?',
    answer: 'To create your first workflow, log in to your Optiflow dashboard and click the "Create Workflow" button. Select a trigger (the event that starts your workflow), then add actions (the tasks to perform when triggered). Connect these elements by dragging lines between them, configure their settings, and click "Save." For a detailed guide, check our "Getting Started" tutorial in the Help Center.',
    category: 'workflows',
  },
  {
    question: 'Can I schedule workflows to run at specific times?',
    answer: 'Yes, Optiflow supports scheduled workflows using our Schedule trigger. You can configure workflows to run at specific times, on particular days of the week, or at regular intervals (hourly, daily, weekly, monthly). You can also set up complex scheduling patterns, such as "every Monday at 9 AM" or "the first day of each month at noon."',
    category: 'workflows',
  },
  {
    question: 'How can I monitor workflow executions?',
    answer: 'Optiflow provides comprehensive monitoring tools for your workflows. In the dashboard, you can view real-time execution status, historical runs, and detailed logs for each workflow. You can also set up notifications to alert you of failures or specific conditions. For Pro and Enterprise plans, we offer advanced analytics to help you optimize workflow performance and resource usage.',
    category: 'workflows',
  },
  {
    question: 'Is there a limit to how complex my workflows can be?',
    answer: "While there's no strict limit on workflow complexity, performance considerations come into play with very large workflows. Pro and Enterprise plans support more complex workflows with higher action limits and computation resources. We recommend breaking very complex processes into multiple connected workflows for better maintainability and performance.",
    category: 'workflows',
  },
  {
    question: 'Can I import or export workflows?',
    answer: 'Yes, Optiflow supports importing and exporting workflows in JSON format. This allows you to back up your workflows, share them between accounts, or move them between environments. Pro and Enterprise users also have access to our Workflow Template Library for quickly deploying pre-built workflows for common business scenarios.',
    category: 'workflows',
  },
  
  // Voice Agent FAQs
  {
    question: 'What is the Jarvis Voice Agent?',
    answer: 'Jarvis is our AI-powered voice assistant that allows you to control Optiflow using natural language commands. You can use voice commands to create, run, and monitor workflows, search for information, and perform various actions within the platform without needing to navigate the interface manually.',
    category: 'voice-agent',
  },
  {
    question: 'How do I set up Jarvis?',
    answer: "Jarvis is available on Pro and Enterprise plans. To set up Jarvis, go to Settings > Voice Agent and follow the setup wizard. You'll need to grant microphone permissions in your browser and complete a brief voice calibration process. You can customize Jarvis's settings, including wake word, voice style, and command preferences.",
    category: 'voice-agent',
  },
  {
    question: 'What can I do with voice commands?',
    answer: 'With Jarvis, you can perform almost any action available in the Optiflow platform using voice commands. Examples include: "Create a new workflow," "Run the email notification workflow," "Show me failed workflow executions from yesterday," "Connect to my Slack account," and "Schedule this workflow to run every Monday." The more you use Jarvis, the better it becomes at understanding your specific needs.',
    category: 'voice-agent',
  },
  {
    question: 'Does Jarvis work in all languages?',
    answer: "Currently, Jarvis works primarily in English, with beta support for Spanish, French, German, and Japanese. We're continuously adding support for more languages. You can switch languages in the Voice Agent settings menu. Even within supported languages, Jarvis may have varying levels of accuracy based on accents and dialects.",
    category: 'voice-agent',
  },
  
  // Integrations FAQs
  {
    question: 'What integrations does Optiflow support?',
    answer: 'Optiflow supports hundreds of integrations with popular services and applications, including Slack, Gmail, Google Sheets, Salesforce, HubSpot, Asana, Jira, GitHub, Stripe, QuickBooks, and many more. Additionally, our Pipedream Connect feature gives you access to thousands of additional integrations. For a complete list, visit our Integrations page.',
    category: 'integrations',
  },
  {
    question: 'How do I connect an integration?',
    answer: 'To connect an integration, go to the Integrations hub in your dashboard and select the service you want to connect. Follow the authentication process, which typically involves granting Optiflow permission to access your account on that service. Once connected, you can use the integration in your workflows by selecting it from the actions or triggers menu in the workflow editor.',
    category: 'integrations',
  },
  {
    question: 'What is Pipedream Connect?',
    answer: "Pipedream Connect is a feature that extends Optiflow's integration capabilities by connecting with the Pipedream platform. This gives you access to thousands of additional integrations and enables more complex integration scenarios. Pipedream Connect is available on all paid plans and provides a seamless way to leverage Pipedream's extensive connector library within your Optiflow workflows.",
    category: 'integrations',
  },
  {
    question: 'Can I create custom integrations?',
    answer: 'Yes, you can create custom integrations using our HTTP actions and webhooks to connect with any service that provides an API. For more advanced scenarios, Pro and Enterprise users can use our Developer SDK to build custom components that appear natively in the workflow editor. Our Enterprise plan also includes custom integration development services.',
    category: 'integrations',
  },
  {
    question: 'Is it possible to connect to on-premise systems?',
    answer: 'Yes, Enterprise customers can connect to on-premise systems using our secure agent technology. This involves installing a lightweight connector in your network that establishes a secure connection to Optiflow while keeping your systems behind your firewall. This enables integration with internal databases, legacy systems, and custom applications not accessible from the public internet.',
    category: 'integrations',
  },
];

// Simple icon component to replace Heroicons
const Icon = ({ name, className }) => {
  return (
    <div className={`icon-placeholder ${name} ${className || ''}`}>
      <span className="sr-only">{name}</span>
    </div>
  );
};

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>('all');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [filteredItems, setFilteredItems] = useState<FAQItem[]>(faqItems);
  
  // Filter FAQ items based on search query and selected category
  useEffect(() => {
    let filtered = faqItems;
    
    // Filter by category if not 'all'
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Filter by search query if not empty
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item => 
          item.question.toLowerCase().includes(query) || 
          item.answer.toLowerCase().includes(query)
      );
    }
    
    setFilteredItems(filtered);
    // Reset expanded items when filter changes
    setExpandedItems([]);
  }, [searchQuery, selectedCategory]);
  
  // Toggle FAQ item expansion
  const toggleItem = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setExpandedItems([]);
  };

  return (
    <div className="min-h-screen bg-[#111111] text-[#E5E7EB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#22D3EE] mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-[#9CA3AF] max-w-2xl mx-auto">
            Find answers to common questions about Optiflow, our features, billing, and more.
          </p>
        </div>
        
        {/* Search bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a question..."
              className="w-full bg-[#18181B] border border-[#374151] rounded-lg pl-12 pr-4 py-3 text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
            />
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#6B7280] hover:text-[#E5E7EB]"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>
        
        {/* Category filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#E5E7EB]">Categories</h2>
            <button
              onClick={resetFilters}
              className="flex items-center text-[#22D3EE] hover:text-[#06B6D4] text-sm"
            >
              <Icon name="arrow-path-" className="h-4 w-4 mr-1" />
              Reset filters
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center p-3 rounded-lg border transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#1E293B] border-[#22D3EE] text-[#22D3EE]'
                    : 'bg-[#18181B] border-[#374151] text-[#9CA3AF] hover:bg-[#1E293B]'
                }`}
              >
                <category.icon className={`h-5 w-5 mr-2 ${
                  selectedCategory === category.id ? 'text-[#22D3EE]' : 'text-[#6B7280]'
                }`} />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* FAQ items */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-[#18181B] rounded-lg border border-[#374151]">
              <Icon name="question-mark-circle-" className="h-12 w-12 text-[#6B7280] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">No questions found</h3>
              <p className="text-[#9CA3AF]">
                Try adjusting your search or category filters
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-[#22D3EE] text-[#111111] rounded-md hover:bg-[#06B6D4] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <div 
                key={index}
                className="bg-[#18181B] border border-[#374151] rounded-lg overflow-hidden transition-colors hover:border-[#22D3EE]"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                  aria-expanded={!!expandedItems.includes(index)}
                >
                  <h3 className="text-lg font-medium text-[#E5E7EB] pr-8">{item.question}</h3>
                  {expandedItems.includes(index) ? (
                    <Icon name="chevron-up-" className="h-5 w-5 text-[#22D3EE] flex-shrink-0" />
                  ) : (
                    <Icon name="chevron-down-" className="h-5 w-5 text-[#6B7280] flex-shrink-0" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedItems.includes(index) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 pt-2 text-[#9CA3AF] border-t border-[#374151]">
                        <p>{item.answer}</p>
                        
                        <div className="mt-4 pt-4 border-t border-[#374151] flex items-center justify-between">
                          <span className="text-xs text-[#6B7280]">
                            Category: {categories.find(c => c.id === item.category)?.name}
                          </span>
                          <div className="flex space-x-4">
                            <button className="text-xs text-[#22D3EE] hover:text-[#06B6D4]">
                              Was this helpful?
                            </button>
                            <Link 
                              href={`/help/${item.category}` as any} 
                              className="text-xs text-[#22D3EE] hover:text-[#06B6D4]"
                            >
                              Learn more
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>
        
        {/* Still need help section */}
        <div className="mt-12 bg-gradient-to-r from-[#134e4a] to-[#1e1b4b] rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h2>
          <p className="text-[#D1D5DB] mb-6 max-w-2xl mx-auto">
            If you couldn't find the answer you're looking for, our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/help/contact-support"
              className="px-6 py-3 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors w-full sm:w-auto"
            >
              Contact Support
            </Link>
            <Link
              href="/help"
              className="px-6 py-3 bg-transparent border border-[#22D3EE] text-[#22D3EE] font-medium rounded-md hover:bg-[#22D3EE]/10 transition-colors w-full sm:w-auto"
            >
              Browse Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}