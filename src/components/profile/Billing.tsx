'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex' | 'paypal';
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: 'paid' | 'pending' | 'failed';
  invoice: string;
}

export default function Billing() {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [usageData, setUsageData] = useState({
    apiCalls: 12485,
    apiLimit: 25000,
    workflows: 7,
    workflowLimit: 15,
    storage: 2.4, // GB
    storageLimit: 10, // GB
  });
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm_1',
      type: 'visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 25,
      isDefault: true
    },
    {
      id: 'pm_2',
      type: 'mastercard',
      last4: '8888',
      expiryMonth: 3,
      expiryYear: 26,
      isDefault: false
    }
  ]);
  
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([
    {
      id: 'inv_1',
      date: 'Dec 15, 2023',
      amount: 29.99,
      description: 'Pro Plan - Monthly',
      status: 'paid',
      invoice: 'INV-2023-001'
    },
    {
      id: 'inv_2',
      date: 'Nov 15, 2023',
      amount: 29.99,
      description: 'Pro Plan - Monthly',
      status: 'paid',
      invoice: 'INV-2023-000'
    }
  ]);
  
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
    toast.success('Default payment method updated');
  };
  
  const removePaymentMethod = (id: string) => {
    if (confirm('Are you sure you want to remove this payment method?')) {
      setPaymentMethods(prev => prev.filter(method => method.id !== id));
      toast.success('Payment method removed');
    }
  };
  
  const handleCancelSubscription = async () => {
    setIsUpdatingPlan(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowCancelModal(false);
      toast.success('Your subscription has been canceled');
    } catch (error) {
      toast.error('Failed to cancel subscription');
      console.error(error);
    } finally {
      setIsUpdatingPlan(false);
    }
  };
  
  const getCardLogo = (type: string) => {
    switch (type) {
      case 'visa': return '💳'; // Replace with actual card logo image
      case 'mastercard': return '💳'; // Replace with actual card logo image
      case 'amex': return '💳'; // Replace with actual card logo image
      case 'paypal': return '💳'; // Replace with actual PayPal logo
      default: return '💳';
    }
  };
  
  return (
    <>
      {/* Current Plan */}
      <div className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Current Plan</h2>
            <p className="text-white/60 text-sm">Manage your subscription and billing</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              Cancel Subscription
            </button>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-6 border border-white/10 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold text-white">Pro Plan</h3>
                <span className="ml-3 px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                  Active
                </span>
              </div>
              <p className="text-white/60 mt-1">$29.99/month • Billed monthly</p>
              <p className="text-white/80 mt-2">Your next payment is on January 15, 2024</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                href="/pricing"
                className="px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/15 transition-all duration-300"
              >
                Upgrade Plan
              </Link>
            </div>
          </div>
        </div>
        
        {/* Usage Stats */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Current Usage</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/30 rounded-lg p-4">
              <h4 className="text-white/60 text-sm mb-1">API Calls</h4>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">{usageData.apiCalls.toLocaleString()}</span>
                <span className="text-white/60 text-sm">of {usageData.apiLimit.toLocaleString()}</span>
              </div>
              <div className="mt-2 bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-primary h-full"
                  style={{ width: `${(usageData.apiCalls / usageData.apiLimit) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-black/30 rounded-lg p-4">
              <h4 className="text-white/60 text-sm mb-1">Workflows</h4>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">{usageData.workflows}</span>
                <span className="text-white/60 text-sm">of {usageData.workflowLimit}</span>
              </div>
              <div className="mt-2 bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-primary h-full"
                  style={{ width: `${(usageData.workflows / usageData.workflowLimit) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-black/30 rounded-lg p-4">
              <h4 className="text-white/60 text-sm mb-1">Storage</h4>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">{usageData.storage} GB</span>
                <span className="text-white/60 text-sm">of {usageData.storageLimit} GB</span>
              </div>
              <div className="mt-2 bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-primary h-full"
                  style={{ width: `${(usageData.storage / usageData.storageLimit) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Methods */}
      <div className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Payment Methods</h2>
            <p className="text-white/60 text-sm">Manage your payment information</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setIsAddingCard(true)}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/15 transition-colors"
            >
              Add Payment Method
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {paymentMethods.map(method => (
            <div key={method.id} className="bg-black/30 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-8 flex items-center justify-center bg-white/10 rounded mr-3">
                  {getCardLogo(method.type)}
                </div>
                <div>
                  <div className="flex items-center">
                    <p className="text-white font-medium">
                      {method.type.charAt(0).toUpperCase() + method.type.slice(1)} ending in {method.last4}
                    </p>
                    {method.isDefault && (
                      <span className="ml-2 px-2 py-1 bg-white/10 text-white/80 text-xs rounded">Default</span>
                    )}
                  </div>
                  <p className="text-white/60 text-xs">
                    Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center mt-4 md:mt-0">
                {!method.isDefault && (
                  <button
                    onClick={() => setDefaultPaymentMethod(method.id)}
                    className="mr-3 text-primary hover:text-primary-light transition-colors text-sm"
                  >
                    Make Default
                  </button>
                )}
                <button
                  onClick={() => removePaymentMethod(method.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                  disabled={method.isDefault}
                  title={method.isDefault ? "Can't remove default payment method" : "Remove payment method"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Billing History */}
      <div className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Billing History</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-white/60 text-sm border-b border-white/10">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map(item => (
                <tr key={item.id} className="border-b border-white/5 text-sm">
                  <td className="py-4 text-white">{item.date}</td>
                  <td className="py-4 text-white">{item.description}</td>
                  <td className="py-4 text-white">${item.amount.toFixed(2)}</td>
                  <td className="py-4">
                    {item.status === 'paid' && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                        Paid
                      </span>
                    )}
                    {item.status === 'pending' && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                        Pending
                      </span>
                    )}
                    {item.status === 'failed' && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    <button className="text-primary hover:text-primary-light text-sm">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => !isUpdatingPlan && setShowCancelModal(false)}></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-dark-100 border border-white/10 rounded-xl p-6 w-full max-w-md"
          >
            <button
              onClick={() => !isUpdatingPlan && setShowCancelModal(false)}
              className="absolute top-3 right-3 text-white/60 hover:text-white"
              disabled={isUpdatingPlan}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-xl font-semibold text-white mb-4">Cancel Subscription</h3>
            
            <div className="mb-6">
              <p className="text-white/80 mb-4">
                Are you sure you want to cancel your Pro subscription? You'll lose access to:
              </p>
              
              <ul className="space-y-2 text-white/60">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Unlimited API calls</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Up to 15 custom workflows</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>10GB storage for workflow data</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Premium support</span>
                </li>
              </ul>
              
              <p className="text-white/60 mt-4">
                Your plan will be active until the end of your current billing period on <span className="text-white">January 15, 2024</span>.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => !isUpdatingPlan && setShowCancelModal(false)}
                className="px-4 py-2 text-white/80 hover:text-white transition-colors"
                disabled={isUpdatingPlan}
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={isUpdatingPlan}
                className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-all duration-300"
              >
                {isUpdatingPlan ? 'Canceling...' : 'Cancel Subscription'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
} 