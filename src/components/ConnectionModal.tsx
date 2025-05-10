import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ConnectionModalProps { isOpen: boolean;
  onClose: () => void;
  onConnect: (appId: string) => void;
    }

// Mock data for available connections
const availableConnections = [
  { id: 'salesforce',
    name: 'Salesforce',
    icon: '/icons/salesforce.svg',
    description: 'CRM and customer engagement platform',
    category: 'CRM'
      },
  { id: 'mailchimp',
    name: 'Mailchimp',
    icon: '/icons/mailchimp.svg',
    description: 'Email marketing platform',
    category: 'Marketing'
      },
  { id: 'stripe',
    name: 'Stripe',
    icon: '/icons/stripe.svg',
    description: 'Payment processing platform',
    category: 'Payments'
      },
  { id: 'dropbox',
    name: 'Dropbox',
    icon: '/icons/dropbox.svg',
    description: 'Cloud storage and file sharing',
    category: 'Storage'
      },
  { id: 'twitter',
    name: 'Twitter',
    icon: '/icons/twitter.svg',
    description: 'Social media platform',
    category: 'Social Media'
      }
];

export default function ConnectionModal({ isOpen, onClose, onConnect }: ConnectionModalProps): JSX.Element | null {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConnections, setFilteredConnections] = useState(availableConnections);
  
  // Filter connections based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredConnections(availableConnections);
      return;
    }
    
    const filtered = availableConnections.filter(conn => 
      conn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conn.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredConnections(filtered);
  }, [searchTerm]) // eslint-disable-line react-hooks/exhaustive-deps
  
  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]) // eslint-disable-line react-hooks/exhaustive-deps
  
  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0     }}
        animate={{ opacity: 1     }}
        exit={{ opacity: 0     }}
        onClick={handleBackdropClick}
      >
        <motion.div 
          className="bg-gray-900 border border-white/10 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0     }}
          animate={{ scale: 1, opacity: 1     }}
          exit={{ scale: 0.9, opacity: 0     }}
          transition={{ type: 'spring', damping: 25, stiffness: 300     }}
        >
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Add New Connection</h2>
            <button 
              onClick={onClose}
              aria-label="Close modal"
              className="p-1 rounded-full hover:bg-white/10 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/60 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-4">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search connections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/50 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="overflow-y-auto max-h-[50vh] pr-2 space-y-3">
              {filteredConnections.length > 0 ? (
                filteredConnections.map((conn) => (
                  <motion.div
                    key={conn.id}
                    initial={{ opacity: 0, y: 10     }}
                    animate={{ opacity: 1, y: 0     }}
                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg cursor-pointer transition-all"
                    onClick={() => onConnect(conn.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <Image
                          src={conn.icon}
                          alt={conn.name}
                          width={40}
                          height={40}
                          className="rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-md font-medium text-white">{conn.name}</h3>
                        <p className="text-sm text-white/60">{conn.description}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/80">
                          {conn.category}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/60">No connections found</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 