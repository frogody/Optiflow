'use client';

import { useState } from 'react';
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  CreditCardIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

// Mock data for demonstration purposes
const mockInvoices = [
  {
    id: 'INV-20250625',
    date: 'June 25, 2025',
    amount: '$49.99',
    status: 'Paid',
    description: 'Pro Plan - Monthly Subscription'
  },
  {
    id: 'INV-20250601',
    date: 'June 1, 2025',
    amount: '$22.99',
    status: 'Paid',
    description: 'Additional 500 Credits'
  },
  {
    id: 'INV-20250525',
    date: 'May 25, 2025',
    amount: '$49.99',
    status: 'Paid',
    description: 'Pro Plan - Monthly Subscription'
  },
  {
    id: 'INV-20250425',
    date: 'April 25, 2025',
    amount: '$49.99',
    status: 'Paid',
    description: 'Pro Plan - Monthly Subscription'
  },
  {
    id: 'INV-20250410',
    date: 'April 10, 2025',
    amount: '$44.99',
    status: 'Paid',
    description: 'Additional 1000 Credits'
  },
  {
    id: 'INV-20250325',
    date: 'March 25, 2025',
    amount: '$49.99',
    status: 'Paid',
    description: 'Pro Plan - Monthly Subscription'
  }
];

const mockPaymentMethods = [
  {
    id: 'pm_1',
    type: 'card',
    brand: 'Visa',
    last4: '4242',
    expMonth: 12,
    expYear: 28,
    isDefault: true
  },
  {
    id: 'pm_2',
    type: 'card',
    brand: 'Mastercard',
    last4: '5678',
    expMonth: 8,
    expYear: 26,
    isDefault: false
  }
];

export default function BillingHistory() {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  
  // For new card form
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  
  const viewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };
  
  const downloadInvoice = (invoiceId) => {
    // In a real implementation, this would download a PDF invoice
    alert(`Downloading invoice ${invoiceId}`);
  };
  
  const handleAddCard = () => {
    setShowAddCardModal(true);
  };
  
  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setNewCard({
      ...newCard,
      [name]: value
    });
  };
  
  const handleSubmitCard = (e) => {
    e.preventDefault();
    // In a real implementation, this would call an API to add the card
    alert('Payment method added successfully!');
    setShowAddCardModal(false);
    setNewCard({
      number: '',
      expiry: '',
      cvc: '',
      name: ''
    });
  };
  
  const makeDefaultPaymentMethod = (id) => {
    // In a real implementation, this would call an API to update the default payment method
    alert(`Payment method ${id} set as default`);
  };
  
  const removePaymentMethod = (id) => {
    // In a real implementation, this would call an API to remove the payment method
    alert(`Payment method ${id} removed`);
  };

  return (
    <div>
      {/* Payment Methods Section */}
      <div className="bg-[#18181B] p-6 rounded-lg border border-[#374151] mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#E5E7EB]">Payment Methods</h2>
          <button
            onClick={handleAddCard}
            className="px-4 py-2 bg-[#22D3EE] text-[#111111] rounded-md hover:bg-[#06B6D4] flex items-center transition-colors text-sm font-medium"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Payment Method
          </button>
        </div>
        
        <div className="space-y-4">
          {mockPaymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 bg-[#111111] border border-[#374151] rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-[#1E293B] rounded-md mr-4">
                  <CreditCardIcon className="h-6 w-6 text-[#E5E7EB]" />
                </div>
                <div>
                  <p className="text-[#E5E7EB] font-medium">
                    {method.brand} •••• {method.last4}
                    {method.isDefault && (
                      <span className="ml-2 text-xs bg-[#022c22] text-[#22D3EE] px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-[#9CA3AF]">
                    Expires {method.expMonth}/{method.expYear}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {!method.isDefault && (
                  <button
                    onClick={() => makeDefaultPaymentMethod(method.id)}
                    className="px-3 py-2 text-sm text-[#9CA3AF] hover:text-[#E5E7EB] bg-[#1E293B] rounded-md transition-colors"
                  >
                    Make Default
                  </button>
                )}
                <button
                  onClick={() => removePaymentMethod(method.id)}
                  className="px-3 py-2 text-sm text-[#F87171] hover:text-[#FCA5A5] bg-[#1E293B] rounded-md transition-colors"
                  disabled={method.isDefault}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Billing History Section */}
      <div className="bg-[#18181B] p-6 rounded-lg border border-[#374151]">
        <h2 className="text-xl font-bold text-[#E5E7EB] mb-6">Invoice History</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#374151]">
            <thead>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Invoice ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#374151]">
              {mockInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-[#1E293B] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#E5E7EB]">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E5E7EB]">
                    {invoice.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E5E7EB]">
                    {invoice.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-[#022c22] text-[#22D3EE]">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => viewInvoice(invoice)}
                        className="p-1.5 text-[#9CA3AF] hover:text-[#E5E7EB] bg-[#1E293B] rounded transition-colors"
                        aria-label="View Invoice"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => downloadInvoice(invoice.id)}
                        className="p-1.5 text-[#9CA3AF] hover:text-[#E5E7EB] bg-[#1E293B] rounded transition-colors"
                        aria-label="Download Invoice"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {mockInvoices.length === 0 && (
          <div className="text-center py-8">
            <DocumentTextIcon className="h-12 w-12 mx-auto text-[#374151]" />
            <p className="mt-2 text-[#9CA3AF]">No invoices yet</p>
          </div>
        )}
      </div>
      
      {/* Invoice Detail Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#18181B] rounded-lg p-6 max-w-2xl w-full border border-[#374151]">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-[#E5E7EB]">Invoice Detail</h3>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors"
                aria-label="Close invoice details"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="bg-[#111111] rounded-lg p-6 border border-[#374151] mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-lg font-bold text-[#E5E7EB]">Optiflow, Inc.</h4>
                  <p className="text-[#9CA3AF]">123 Tech Street</p>
                  <p className="text-[#9CA3AF]">San Francisco, CA 94107</p>
                </div>
                <div className="text-right">
                  <h4 className="text-lg font-bold text-[#E5E7EB]">Invoice</h4>
                  <p className="text-[#9CA3AF]">#{selectedInvoice.id}</p>
                  <p className="text-[#9CA3AF]">{selectedInvoice.date}</p>
                </div>
              </div>
              
              <div className="border-t border-b border-[#374151] py-4 my-4">
                <div className="flex justify-between mb-2">
                  <span className="text-[#9CA3AF]">Description</span>
                  <span className="text-[#9CA3AF]">Amount</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#E5E7EB]">{selectedInvoice.description}</span>
                  <span className="text-[#E5E7EB]">{selectedInvoice.amount}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-[#374151] mt-4">
                  <span className="font-bold text-[#E5E7EB]">Total</span>
                  <span className="font-bold text-[#22D3EE]">{selectedInvoice.amount}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[#9CA3AF] text-sm mb-1">Payment Method</p>
                  <p className="text-[#E5E7EB]">Visa •••• 4242</p>
                </div>
                <div className="text-right">
                  <p className="text-[#9CA3AF] text-sm mb-1">Status</p>
                  <span className="px-2 py-1 text-xs rounded-full bg-[#022c22] text-[#22D3EE]">
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-4 py-2 border border-[#374151] rounded-md text-[#9CA3AF] hover:text-[#E5E7EB] hover:border-[#6B7280] transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => downloadInvoice(selectedInvoice.id)}
                className="px-4 py-2 bg-[#22D3EE] text-[#111111] rounded-md hover:bg-[#06B6D4] transition-colors flex items-center"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Payment Method Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#18181B] rounded-lg p-6 max-w-md w-full border border-[#374151]">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-[#E5E7EB]">Add Payment Method</h3>
              <button
                onClick={() => setShowAddCardModal(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors"
                aria-label="Close payment method form"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitCard} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newCard.name}
                  onChange={handleCardInputChange}
                  placeholder="John Smith"
                  required
                  className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="number" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  id="number"
                  name="number"
                  value={newCard.number}
                  onChange={handleCardInputChange}
                  placeholder="4242 4242 4242 4242"
                  required
                  maxLength={19}
                  className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiry" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    id="expiry"
                    name="expiry"
                    value={newCard.expiry}
                    onChange={handleCardInputChange}
                    placeholder="MM/YY"
                    required
                    maxLength={5}
                    className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    id="cvc"
                    name="cvc"
                    value={newCard.cvc}
                    onChange={handleCardInputChange}
                    placeholder="123"
                    required
                    maxLength={3}
                    className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="pt-4 mt-4 border-t border-[#374151]">
                <p className="text-[#9CA3AF] text-sm mb-4">
                  Your payment information is securely processed and stored. We use industry-standard security to protect your data.
                </p>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddCardModal(false)}
                    className="px-4 py-2 border border-[#374151] rounded-md text-[#9CA3AF] hover:text-[#E5E7EB] hover:border-[#6B7280] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#22D3EE] text-[#111111] rounded-md hover:bg-[#06B6D4] transition-colors flex items-center"
                  >
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Add Payment Method
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 