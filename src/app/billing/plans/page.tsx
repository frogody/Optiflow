'use client';

import { useState } from 'react';
import {
  CheckIcon,
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

// Mock data for demonstration purposes
const mockUserPlan = {
  name: 'Pro',
  nextRenewal: 'July 15, 2025',
  cost: '$49.99',
  cycleType: 'monthly',
  credits: 1000
};

export default function SubscriptionPlans() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  // Mock plans data
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      monthlyCredits: 50,
      features: [
        { name: 'Up to 5 workflows', included: true },
        { name: 'Basic integrations', included: true },
        { name: 'Community support', included: true },
        { name: 'Voice agent (limited)', included: false },
        { name: 'Advanced integrations', included: false },
        { name: 'Team collaboration', included: false },
        { name: 'Priority support', included: false },
      ],
      additionalCreditsCost: 'N/A',
      cta: mockUserPlan.name === 'Pro' ? 'Downgrade' : 'Current Plan',
      action: mockUserPlan.name === 'Pro' ? () => handleDowngrade('free') : null,
      popular: false,
    },
    {
      id: 'starter',
      name: 'Starter',
      price: '$19.99',
      monthlyCredits: 200,
      features: [
        { name: 'Up to 20 workflows', included: true },
        { name: 'Basic integrations', included: true },
        { name: 'Email support', included: true },
        { name: 'Voice agent (basic)', included: true },
        { name: 'Advanced integrations', included: false },
        { name: 'Team collaboration', included: false },
        { name: 'Priority support', included: false },
      ],
      additionalCreditsCost: '$0.10 per credit',
      cta: mockUserPlan.name === 'Pro' ? 'Downgrade' : 'Upgrade',
      action: mockUserPlan.name === 'Pro' ? () => handleDowngrade('starter') : () => handleUpgrade('starter'),
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$49.99',
      monthlyCredits: 1000,
      features: [
        { name: 'Unlimited workflows', included: true },
        { name: 'All integrations', included: true },
        { name: 'Priority email support', included: true },
        { name: 'Voice agent (full access)', included: true },
        { name: 'Advanced integrations', included: true },
        { name: 'Team collaboration (up to 5 members)', included: true },
        { name: 'Priority support', included: true },
      ],
      additionalCreditsCost: '$0.05 per credit',
      cta: mockUserPlan.name === 'Pro' ? 'Current Plan' : 'Upgrade',
      action: mockUserPlan.name === 'Pro' ? null : () => handleUpgrade('pro'),
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      monthlyCredits: 'Custom',
      features: [
        { name: 'Unlimited workflows', included: true },
        { name: 'All integrations', included: true },
        { name: 'Dedicated support', included: true },
        { name: 'Voice agent (full access)', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'Team collaboration (unlimited)', included: true },
        { name: 'SLA & dedicated account manager', included: true },
      ],
      additionalCreditsCost: 'Custom',
      cta: 'Contact Sales',
      action: () => window.location.href = '/contact-sales',
      popular: false,
    }
  ];

  const handleUpgrade = (planId) => {
    const plan = plans.find(p => p.id === planId);
    setSelectedPlan(plan);
    setShowUpgradeModal(true);
  };

  const handleDowngrade = (planId) => {
    const plan = plans.find(p => p.id === planId);
    setSelectedPlan(plan);
    setShowDowngradeModal(true);
  };

  const confirmUpgrade = () => {
    // In a real implementation, this would call an API to change the subscription
    alert(`Upgraded to ${selectedPlan.name} plan!`);
    setShowUpgradeModal(false);
  };

  const confirmDowngrade = () => {
    // In a real implementation, this would call an API to change the subscription
    alert(`Downgraded to ${selectedPlan.name} plan! Changes will take effect at the end of your billing cycle.`);
    setShowDowngradeModal(false);
  };

  const handleCancelSubscription = () => {
    setShowCancelModal(true);
  };

  const confirmCancelSubscription = () => {
    // In a real implementation, this would call an API to cancel the subscription
    alert('Subscription has been canceled. You will have access until the end of your current billing cycle.');
    setShowCancelModal(false);
    setConfirmCancel(false);
  };

  return (
    <div>
      {/* Current Plan Summary */}
      <div className="bg-[#18181B] p-6 rounded-lg border border-[#374151] mb-10">
        <div className="md:flex md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#E5E7EB] flex items-center">
              Your Current Plan: 
              <span className="text-[#22D3EE] ml-2">{mockUserPlan.name}</span>
              {mockUserPlan.name === 'Pro' && (
                <span className="ml-2 text-xs bg-[#022c22] text-[#22D3EE] px-2 py-1 rounded-full">Active</span>
              )}
            </h2>
            <p className="text-[#9CA3AF] mt-1">
              Renews on <span className="text-[#E5E7EB]">{mockUserPlan.nextRenewal}</span> · 
              <span className="text-[#E5E7EB]"> {mockUserPlan.cost}/{mockUserPlan.cycleType}</span>
            </p>
            <p className="text-[#9CA3AF] mt-1">
              <span className="text-[#E5E7EB] font-medium">{mockUserPlan.credits}</span> credits included per month
            </p>
          </div>
          
          {mockUserPlan.name !== 'Free' && (
            <div className="mt-4 md:mt-0">
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 text-[#F87171] border border-[#F87171] rounded-md hover:bg-[#371520] transition-colors"
              >
                Cancel Subscription
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Plan Comparison */}
      <div>
        <h2 className="text-xl font-bold text-[#E5E7EB] mb-6">Available Plans</h2>
        
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden border border-[#374151] rounded-lg">
              <table className="min-w-full divide-y divide-[#374151]">
                <thead className="bg-[#1E293B]">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-[#E5E7EB] sm:pl-6">
                      Plan
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[#E5E7EB]">
                      Price
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[#E5E7EB]">
                      Monthly Credits
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[#E5E7EB]">
                      Additional Credits
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[#E5E7EB]">
                      <span className="sr-only">Features</span>
                    </th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-[#374151] bg-[#111111]">
                  {plans.map((plan) => (
                    <tr key={plan.id} className={plan.popular ? 'bg-[#111111] relative' : ''}>
                      {plan.popular && (
                        <div className="absolute -top-2 left-0 right-0 flex justify-center">
                          <span className="bg-[#22D3EE] text-[#111111] text-xs font-semibold px-3 py-1 rounded-full">
                            Most Popular
                          </span>
                        </div>
                      )}
                      
                      <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 ${plan.popular ? 'pt-6' : ''}`}>
                        <div className="font-medium text-[#E5E7EB]">{plan.name}</div>
                      </td>
                      
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-[#E5E7EB]">
                        {plan.price}
                      </td>
                      
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-[#E5E7EB]">
                        {plan.monthlyCredits}
                      </td>
                      
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-[#9CA3AF]">
                        {plan.additionalCreditsCost}
                      </td>
                      
                      <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
                        <button
                          onClick={plan.action}
                          className={`px-4 py-2 rounded-md
                            ${plan.cta === 'Current Plan' 
                              ? 'bg-[#022c22] text-[#22D3EE] cursor-default' 
                              : plan.cta === 'Downgrade' 
                              ? 'bg-[#1E293B] text-[#9CA3AF] hover:bg-[#2D3748] hover:text-[#E5E7EB]' 
                              : plan.cta === 'Upgrade' 
                              ? 'bg-[#22D3EE] text-[#111111] hover:bg-[#06B6D4]' 
                              : 'bg-[#1E293B] text-[#E5E7EB] hover:bg-[#2D3748]'} 
                            transition-colors`}
                          disabled={plan.cta === 'Current Plan'}
                        >
                          {plan.cta}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Features Comparison */}
        <div className="mt-12">
          <h3 className="text-lg font-medium text-[#E5E7EB] mb-6">Feature Comparison</h3>
          
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border border-[#374151] rounded-lg">
                <table className="min-w-full divide-y divide-[#374151]">
                  <thead className="bg-[#1E293B]">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-[#E5E7EB] sm:pl-6">
                        Feature
                      </th>
                      {plans.map((plan) => (
                        <th key={plan.id} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-[#E5E7EB]">
                          {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-[#374151] bg-[#111111]">
                    {plans[0].features.map((feature, featureIdx) => (
                      <tr key={feature.name}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-[#E5E7EB] sm:pl-6">
                          {feature.name}
                        </td>
                        
                        {plans.map((plan) => (
                          <td key={`${plan.id}-${featureIdx}`} className="whitespace-nowrap px-3 py-4 text-sm text-center">
                            {plan.features[featureIdx].included ? (
                              <CheckIcon className="h-5 w-5 text-[#22D3EE] inline-block" />
                            ) : (
                              <XMarkIcon className="h-5 w-5 text-[#6B7280] inline-block" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Confirmation Modal */}
      {showUpgradeModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#18181B] rounded-lg p-6 max-w-md w-full border border-[#374151]">
            <h3 className="text-xl font-bold text-[#E5E7EB] mb-4">Upgrade to {selectedPlan.name} Plan</h3>
            
            <div className="mb-6">
              <p className="text-[#9CA3AF] mb-2">
                You're about to upgrade from <span className="text-[#E5E7EB]">{mockUserPlan.name}</span> to <span className="text-[#E5E7EB]">{selectedPlan.name}</span>.
              </p>
              
              <div className="bg-[#111111] p-4 rounded-md my-4">
                <div className="flex justify-between mb-2">
                  <span className="text-[#9CA3AF]">New price:</span>
                  <span className="text-[#E5E7EB] font-medium">{selectedPlan.price}/month</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-[#9CA3AF]">Monthly credits:</span>
                  <span className="text-[#E5E7EB] font-medium">{selectedPlan.monthlyCredits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Effective immediately:</span>
                  <span className="text-[#22D3EE] font-medium">Yes (prorated)</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-2 border border-[#374151] rounded-md text-[#9CA3AF] hover:text-[#E5E7EB] hover:border-[#6B7280] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpgrade}
                className="px-4 py-2 bg-[#22D3EE] text-[#111111] rounded-md hover:bg-[#06B6D4] transition-colors"
              >
                Confirm Upgrade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Downgrade Confirmation Modal */}
      {showDowngradeModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#18181B] rounded-lg p-6 max-w-md w-full border border-[#374151]">
            <h3 className="text-xl font-bold text-[#E5E7EB] mb-4">Downgrade to {selectedPlan.name} Plan</h3>
            
            <div className="mb-6">
              <p className="text-[#9CA3AF] mb-2">
                You're about to downgrade from <span className="text-[#E5E7EB]">{mockUserPlan.name}</span> to <span className="text-[#E5E7EB]">{selectedPlan.name}</span>.
              </p>
              
              <div className="bg-[#111111] p-4 rounded-md my-4">
                <div className="flex justify-between mb-2">
                  <span className="text-[#9CA3AF]">New price:</span>
                  <span className="text-[#E5E7EB] font-medium">{selectedPlan.price}/month</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-[#9CA3AF]">Monthly credits:</span>
                  <span className="text-[#E5E7EB] font-medium">{selectedPlan.monthlyCredits}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#9CA3AF]">Effective date:</span>
                  <span className="text-[#E5E7EB] font-medium">End of current billing cycle ({mockUserPlan.nextRenewal})</span>
                </div>
              </div>
              
              <div className="flex items-start mt-4 bg-[#422006] p-3 rounded-md">
                <InformationCircleIcon className="h-5 w-5 text-[#F59E0B] flex-shrink-0 mt-0.5 mr-2" />
                <p className="text-sm text-[#F59E0B]">
                  Downgrading may reduce feature access and workflow limits. Your data will be retained, but you may need to remove workflows or integrations that exceed the new plan's limits.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDowngradeModal(false)}
                className="px-4 py-2 border border-[#374151] rounded-md text-[#9CA3AF] hover:text-[#E5E7EB] hover:border-[#6B7280] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDowngrade}
                className="px-4 py-2 bg-[#1E293B] text-[#E5E7EB] rounded-md hover:bg-[#2D3748] transition-colors"
              >
                Confirm Downgrade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#18181B] rounded-lg p-6 max-w-md w-full border border-[#374151]">
            <h3 className="text-xl font-bold text-[#E5E7EB] mb-4">Cancel Your Subscription</h3>
            
            <div className="mb-6">
              {!confirmCancel ? (
                <>
                  <p className="text-[#9CA3AF] mb-4">
                    We're sorry to see you go. Before you cancel, would you consider:
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <button className="w-full text-left p-3 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] hover:border-[#22D3EE] transition-colors">
                      <p className="font-medium">Downgrading to a lower plan?</p>
                      <p className="text-sm text-[#9CA3AF] mt-1">Keep your account active with fewer features.</p>
                    </button>
                    
                    <button className="w-full text-left p-3 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] hover:border-[#22D3EE] transition-colors">
                      <p className="font-medium">Pausing your subscription for 1 month?</p>
                      <p className="text-sm text-[#9CA3AF] mt-1">Take a break and come back later.</p>
                    </button>
                    
                    <button className="w-full text-left p-3 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] hover:border-[#22D3EE] transition-colors">
                      <p className="font-medium">Talking to our support team?</p>
                      <p className="text-sm text-[#9CA3AF] mt-1">We might be able to help with any issues.</p>
                    </button>
                  </div>
                  
                  <div className="flex items-start mt-6 bg-[#371520] p-3 rounded-md">
                    <InformationCircleIcon className="h-5 w-5 text-[#F87171] flex-shrink-0 mt-0.5 mr-2" />
                    <p className="text-sm text-[#F87171]">
                      If you proceed with cancellation, your subscription will remain active until the end of your current billing period ({mockUserPlan.nextRenewal}). After that, your account will revert to the Free plan with limited features.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center mb-6">
                    <div className="h-16 w-16 bg-[#371520] rounded-full flex items-center justify-center">
                      <XMarkIcon className="h-8 w-8 text-[#F87171]" />
                    </div>
                  </div>
                  
                  <p className="text-center text-[#E5E7EB] font-medium mb-2">
                    Are you sure you want to cancel?
                  </p>
                  
                  <p className="text-center text-[#9CA3AF] mb-6">
                    This will cancel your subscription at the end of your current billing period. Your data will be preserved, but your access will be limited to Free plan features.
                  </p>
                </>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setConfirmCancel(false);
                }}
                className="px-4 py-2 border border-[#374151] rounded-md text-[#9CA3AF] hover:text-[#E5E7EB] hover:border-[#6B7280] transition-colors"
              >
                Go Back
              </button>
              
              {!confirmCancel ? (
                <button
                  onClick={() => setConfirmCancel(true)}
                  className="px-4 py-2 bg-[#371520] text-[#F87171] rounded-md hover:bg-[#4B1D29] transition-colors"
                >
                  Continue to Cancel
                </button>
              ) : (
                <button
                  onClick={confirmCancelSubscription}
                  className="px-4 py-2 bg-[#371520] text-[#F87171] rounded-md hover:bg-[#4B1D29] transition-colors"
                >
                  Confirm Cancellation
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 