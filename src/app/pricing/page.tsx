'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useUserStore } from '@/lib/userStore';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const { currentUser } = useUserStore();

  const pricingTiers: PricingTier[] = [
    {
      name: 'Starter',
      price: isAnnual ? '$29/mo' : '$39/mo',
      description: 'Perfect for individuals and small teams getting started with automation',
      features: [
        'Up to 1,000 workflow runs/month',
        '2 team members',
        'Basic integrations',
        'Community support',
        'Standard API rate limits',
        'Basic analytics'
      ],
      cta: currentUser ? 'Upgrade to Starter' : 'Get Started'
    },
    {
      name: 'Professional',
      price: isAnnual ? '$79/mo' : '$99/mo',
      description: 'Ideal for growing businesses with advanced automation needs',
      features: [
        'Up to 10,000 workflow runs/month',
        '5 team members',
        'Advanced integrations',
        'Priority email support',
        'Higher API rate limits',
        'Advanced analytics',
        'Custom workflows',
        'Workflow templates'
      ],
      cta: currentUser ? 'Upgrade to Pro' : 'Start Free Trial',
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For organizations requiring maximum scalability and support',
      features: [
        'Unlimited workflow runs',
        'Unlimited team members',
        'Premium integrations',
        '24/7 dedicated support',
        'Unlimited API access',
        'Custom analytics',
        'Custom development',
        'SLA guarantee',
        'On-premise deployment',
        'Custom security features'
      ],
      cta: 'Contact Sales'
    }
  ];

  return (
    <div className="min-h-screen pb-16">
      {/* Neural Network Background */}
      <div className="neural-bg"></div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your automation needs. All plans include our core features.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-white/60'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-16 h-8 bg-white/10 rounded-full p-1 transition-colors duration-200 ease-in-out"
            >
              <div
                className={`absolute w-6 h-6 bg-primary rounded-full transition-transform duration-200 ease-in-out ${
                  isAnnual ? 'translate-x-8' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-white' : 'text-white/60'}`}>
              Annual
              <span className="ml-1 text-primary text-xs">Save 20%</span>
            </span>
          </div>

          {/* Pricing Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`relative p-8 rounded-xl backdrop-blur-md border ${
                  tier.highlighted
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white text-sm px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold text-white mb-4">{tier.price}</div>
                <p className="text-white/60 mb-6 h-12">{tier.description}</p>

                <ul className="text-left space-y-4 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center text-white/80">
                      <svg
                        className="w-5 h-5 mr-3 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.cta === 'Contact Sales' ? '/contact' : '/signup'}
                  className={`block w-full py-3 px-6 rounded-lg text-center font-medium transition-all duration-200 ${
                    tier.highlighted
                      ? 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-glow'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-24 text-left">
            <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">What's included in the free trial?</h3>
                <p className="text-white/70">
                  Our 14-day free trial includes all features from the Professional plan, allowing you to fully
                  test our platform's capabilities before making a decision.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Can I change plans later?</h3>
                <p className="text-white/70">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your
                  next billing cycle.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">What payment methods do you accept?</h3>
                <p className="text-white/70">
                  We accept all major credit cards, PayPal, and wire transfers for Enterprise plans.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Do you offer custom solutions?</h3>
                <p className="text-white/70">
                  Yes, our Enterprise plan can be customized to meet your specific needs. Contact our sales
                  team to discuss your requirements.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 