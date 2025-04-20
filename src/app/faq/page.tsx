'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const faqItems: FAQItem[] = [
    {
      category: 'general',
      question: 'What is ISYNCSO?',
      answer: 'ISYNCSO is an advanced automation platform that helps businesses streamline their workflows and operations. Our platform combines AI-powered automation with seamless integrations to help you work more efficiently.'
    },
    {
      category: 'general',
      question: 'How does the platform work?',
      answer: 'Our platform works by connecting your existing tools and services through our intuitive interface. You can create custom workflows, automate repetitive tasks, and monitor everything from a central dashboard.'
    },
    {
      category: 'workflows',
      question: 'What types of workflows can I create?',
      answer: 'You can create a wide variety of workflows, from simple task automation to complex business processes. Common examples include lead generation, customer onboarding, data synchronization, and marketing automation.'
    },
    {
      category: 'workflows',
      question: 'Can I customize my workflows?',
      answer: 'Yes! Our platform offers extensive customization options. You can create conditional logic, set triggers, add custom actions, and integrate with your favorite tools to build workflows that match your exact needs.'
    },
    {
      category: 'integrations',
      question: 'Which tools and services can I integrate?',
      answer: 'We support integration with hundreds of popular services including CRM systems, marketing tools, communication platforms, and custom APIs. Our platform is constantly expanding to include new integrations.'
    },
    {
      category: 'integrations',
      question: 'How secure are the integrations?',
      answer: 'Security is our top priority. We use industry-standard encryption, OAuth 2.0 authentication, and regular security audits to ensure your data and connections are always protected.'
    },
    {
      category: 'billing',
      question: 'How does billing work?',
      answer: 'We offer flexible monthly and annual billing options. You can choose from our Starter, Professional, or Enterprise plans, with the ability to upgrade or downgrade at any time. Annual plans come with a 20% discount.'
    },
    {
      category: 'billing',
      question: 'Is there a free trial?',
      answer: 'Yes! We offer a 14-day free trial of our Professional plan, allowing you to test all features and capabilities before making a decision. No credit card is required to start your trial.'
    },
    {
      category: 'support',
      question: 'What kind of support do you offer?',
      answer: 'We provide multiple levels of support depending on your plan. This includes community support, email support, priority support, and dedicated account management for enterprise customers.'
    },
    {
      category: 'support',
      question: 'Do you offer training and onboarding?',
      answer: 'Yes, we provide comprehensive documentation, video tutorials, and getting started guides. Enterprise customers also receive personalized onboarding and training sessions.'
    }
  ];

  const categories = ['all', ...Array.from(new Set(faqItems.map(item => item.category)))];

  const filteredItems = selectedCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen pb-16">
      {/* Neural Network Background */}
      <div className="neural-bg"></div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text text-center mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-white/80 text-center max-w-2xl mx-auto mb-12">
            Find answers to common questions about our platform, features, and services.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-white/5 text-white/80 hover:bg-white/10'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border border-white/10 rounded-lg overflow-hidden backdrop-blur-md"
              >
                <button
                  onClick={() => setOpenItem(openItem === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200"
                >
                  <span className="text-lg font-medium text-white">{item.question}</span>
                  <svg
                    className={`w-5 h-5 text-white/60 transition-transform duration-200 ${
                      openItem === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <AnimatePresence>
                  {openItem === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-white/10"
                    >
                      <div className="px-6 py-4 text-white/70">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Contact Support */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Still have questions?
            </h2>
            <p className="text-white/70 mb-6">
              Our support team is here to help you with any questions you might have.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="mailto:support@isyncso.com"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
              >
                Contact Support
              </a>
              <a
                href="/docs"
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-glow transition-all duration-200"
              >
                View Documentation
              </a>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 