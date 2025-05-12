'use client';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

// Heroicons removed to prevent React version conflicts
import { useState } from 'react';

// Mock data for demonstration purposes
const mockUserCredits = {
  totalCredits: 850,
  usedThisMonth: 150,
  includedPerMonth: 1000,
  nextRefill: 'July 15, 2025',
  additionalPurchased: 0
};

const mockCreditHistory = [
  { date: 'June 25, 2025', amount: -20, description: 'Voice workflow processing', type: 'usage' },
  { date: 'June 23, 2025', amount: -35, description: 'API integration execution', type: 'usage' },
  { date: 'June 20, 2025', amount: -15, description: 'Workflow automation', type: 'usage' },
  { date: 'June 15, 2025', amount: 1000, description: 'Monthly plan credits', type: 'refill' },
  { date: 'June 10, 2025', amount: -40, description: 'Voice workflow processing', type: 'usage' },
  { date: 'June 5, 2025', amount: -30, description: 'API integration execution', type: 'usage' },
  { date: 'June 1, 2025', amount: 100, description: 'Additional credits purchase', type: 'purchase' },
];

const creditPackages = [
  { id: 'small', amount: 100, price: '$4.99', perCredit: '$0.050' },
  { id: 'medium', amount: 500, price: '$22.99', perCredit: '$0.046', popular: true },
  { id: 'large', amount: 1000, price: '$44.99', perCredit: '$0.045' },
  { id: 'xl', amount: 5000, price: '$199.99', perCredit: '$0.040' },
];

// Simple icon component to replace Heroicons
const Icon = ({ name, className }) => {
  return (
    <div className={`icon-placeholder ${name} ${className || ''}`}>
      <span className="sr-only">{name}</span>
    </div>
  );
};

export default function Credits() {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomAmount, setIsCustomAmount] = useState(false);

  // Usage percentage calculation
  const usagePercentage = (mockUserCredits.usedThisMonth / mockUserCredits.includedPerMonth) * 100;
  
  const handleBuyCredits = () => {
    setShowPurchaseModal(true);
  };

  const selectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setIsCustomAmount(false);
  };

  const enableCustomAmount = () => {
    setIsCustomAmount(true);
    setSelectedPackage(null);
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setCustomAmount(value);
    }
  };

  const confirmPurchase = () => {
    // In a real implementation, this would call an API to purchase credits
    const amount = isCustomAmount ? parseInt(customAmount, 10) : selectedPackage.amount;
    const estimatedCost = isCustomAmount 
      ? `$${(parseInt(customAmount, 10) * 0.05).toFixed(2)}` 
      : selectedPackage.price;
      
    alert(`Purchased ${amount} credits for ${estimatedCost}!`);
    setShowPurchaseModal(false);
    setCustomAmount('');
    setSelectedPackage(null);
    setIsCustomAmount(false);
  };

  return (
    <div>
      {/* Credits Summary */}
      <div className="bg-[#18181B] p-6 rounded-lg border border-[#374151] mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-[#E5E7EB] mb-1">Current Balance</h2>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-[#22D3EE]">{mockUserCredits.totalCredits}</span>
              <span className="text-sm text-[#9CA3AF] ml-2">credits</span>
            </div>
            <p className="text-[#9CA3AF] mt-2">
              Next refill: <span className="text-[#E5E7EB]">{mockUserCredits.nextRefill}</span>
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-[#E5E7EB] mb-2">Monthly Usage</h2>
            <div className="flex items-center">
              <div className="flex-1 bg-[#111111] rounded-full h-4 mr-3">
                <div
                  className={`h-4 rounded-full ${
                    usagePercentage > 90 ? 'bg-[#F87171]' : 'bg-[#22D3EE]'
                  }`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                ></div>
              </div>
              <span className="text-[#E5E7EB] whitespace-nowrap">
                {mockUserCredits.usedThisMonth} / {mockUserCredits.includedPerMonth}
              </span>
            </div>
            <p className="text-[#9CA3AF] mt-2">
              {mockUserCredits.includedPerMonth - mockUserCredits.usedThisMonth} credits remaining this month
            </p>
          </div>
          
          <div className="flex flex-col items-start md:items-end">
            <button
              onClick={handleBuyCredits}
              className="px-4 py-2 bg-[#22D3EE] text-[#111111] rounded-md font-medium hover:bg-[#06B6D4] transition-colors flex items-center"
            >
              <Icon name="plus-" className="h-5 w-5 mr-1" />
              Buy Additional Credits
            </button>
            <p className="text-[#9CA3AF] mt-2 text-sm">
              Pro Plan: $0.05 per additional credit
            </p>
          </div>
        </div>
      </div>
      
      {/* Credits Usage Graph */}
      <div className="bg-[#18181B] p-6 rounded-lg border border-[#374151] mb-10">
        <h2 className="text-xl font-bold text-[#E5E7EB] mb-6">Credits Usage</h2>
        
        <div className="h-64 relative">
          {/* This would be a real chart in a production app */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Icon name="chart-bar-" className="h-16 w-16 mx-auto text-[#374151]" />
              <p className="text-[#9CA3AF] mt-2">Credits usage visualization would appear here</p>
              <p className="text-[#9CA3AF] text-sm mt-1">
                Including historical usage, trends, and forecasting
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Credits History */}
      <div className="bg-[#18181B] p-6 rounded-lg border border-[#374151] mb-6">
        <h2 className="text-xl font-bold text-[#E5E7EB] mb-6">Credits History</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#374151]">
            <thead>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#374151]">
              {mockCreditHistory.map((item, index) => (
                <tr key={index} className="hover:bg-[#1E293B] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E5E7EB]">
                    {item.description}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium flex items-center justify-end
                    ${item.type === 'usage' ? 'text-[#F87171]' : item.type === 'refill' ? 'text-[#22D3EE]' : 'text-[#A855F7]'}`}
                  >
                    {item.type === 'usage' ? (
                      <Icon name="arrow-down-" className="h-4 w-4 mr-1" />
                    ) : (
                      <Icon name="arrow-up-" className="h-4 w-4 mr-1" />
                    )}
                    {item.type === 'usage' ? item.amount : `+${item.amount}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Credits Information */}
      <div className="bg-[#111111] border border-[#374151] rounded-lg p-4 text-[#9CA3AF] text-sm flex items-start">
        <Icon name="information-circle-" className="h-5 w-5 text-[#9CA3AF] mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <p className="mb-2">
            Credits are used for all Optiflow operations, including workflow executions, API calls, and voice agent interactions.
          </p>
          <p>
            Your Pro plan includes 1,000 credits per month. Additional credits can be purchased at any time and never expire.
          </p>
        </div>
      </div>
      
      {/* Purchase Credits Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#18181B] rounded-lg p-6 max-w-md w-full border border-[#374151]">
            <h3 className="text-xl font-bold text-[#E5E7EB] mb-6">Purchase Additional Credits</h3>
            
            <div className="space-y-4 mb-6">
              {creditPackages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => selectPackage(pkg)}
                  className={`w-full flex items-center justify-between p-4 rounded-md border transition-colors ${
                    selectedPackage && selectedPackage.id === pkg.id
                      ? 'bg-[#022c22] border-[#22D3EE] text-[#E5E7EB]'
                      : 'bg-[#111111] border-[#374151] text-[#9CA3AF] hover:border-[#6B7280] hover:text-[#E5E7EB]'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon name="currency-dollar-" className={`h-5 w-5 mr-2 ${
                      selectedPackage && selectedPackage.id === pkg.id ? 'text-[#22D3EE]' : 'text-[#9CA3AF]'
                    }`} />
                    <div className="text-left">
                      <p className="font-medium text-[#E5E7EB]">{pkg.amount} Credits</p>
                      <p className="text-xs text-[#9CA3AF]">{pkg.perCredit} per credit</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#E5E7EB]">{pkg.price}</p>
                    {pkg.popular && (
                      <span className="inline-block text-xs bg-[#022c22] text-[#22D3EE] px-2 py-0.5 rounded-full mt-1">
                        Most Popular
                      </span>
                    )}
                  </div>
                </button>
              ))}
              
              <button
                onClick={enableCustomAmount}
                className={`w-full flex items-center justify-between p-4 rounded-md border transition-colors ${
                  isCustomAmount
                    ? 'bg-[#022c22] border-[#22D3EE] text-[#E5E7EB]'
                    : 'bg-[#111111] border-[#374151] text-[#9CA3AF] hover:border-[#6B7280] hover:text-[#E5E7EB]'
                }`}
              >
                <div className="flex items-center">
                  <Icon name="plus-" className={`h-5 w-5 mr-2 ${
                    isCustomAmount ? 'text-[#22D3EE]' : 'text-[#9CA3AF]'
                  }`} />
                  <div className="text-left">
                    <p className="font-medium text-[#E5E7EB]">Custom Amount</p>
                    <p className="text-xs text-[#9CA3AF]">$0.05 per credit</p>
                  </div>
                </div>
                {isCustomAmount && (
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Enter amount"
                    className="w-24 px-2 py-1 bg-[#111111] border border-[#22D3EE] rounded text-[#E5E7EB] text-right focus:outline-none"
                    onFocus={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </button>
            </div>
            
            {isCustomAmount && customAmount && (
              <div className="mb-6 p-3 bg-[#111111] rounded-md border border-[#374151]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Cost for {customAmount} credits:</span>
                  <span className="font-medium text-[#E5E7EB]">
                    ${(parseInt(customAmount, 10) * 0.05).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
            
            {selectedPackage && (
              <div className="mb-6 p-3 bg-[#111111] rounded-md border border-[#374151]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Selected package:</span>
                  <span className="font-medium text-[#E5E7EB]">
                    {selectedPackage.amount} credits for {selectedPackage.price}
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="px-4 py-2 border border-[#374151] rounded-md text-[#9CA3AF] hover:text-[#E5E7EB] hover:border-[#6B7280] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPurchase}
                disabled={!selectedPackage && (!isCustomAmount || !customAmount)}
                className="px-4 py-2 bg-[#22D3EE] text-[#111111] rounded-md hover:bg-[#06B6D4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Purchase Credits
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 