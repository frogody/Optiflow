import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import MockScreenshot from './MockScreenshotGenerator';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DemoStep {
  id: number;
  title: string;
  description: string;
  image: string;
  callout?: {
    text: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  };
  action?: {
    text: string;
    link?: string;
    onClick?: () => void;
  };
}

const demoSteps: DemoStep[] = [
  {
    id: 1,
    title: "Connect Your Tools",
    description: "Start by connecting your favorite tools and services. Optiflow integrates with hundreds of popular services like Google, Slack, Salesforce, and more.",
    image: "/images/demo/connect-tools.png",
    callout: {
      text: "Click here to add new connections",
      position: "top-right"
    },
    action: {
      text: "Explore Connections",
      link: "/connections"
    }
  },
  {
    id: 2,
    title: "Build Your Workflow",
    description: "Use our intuitive workflow editor to create automated processes. Drag and drop nodes, connect them together, and configure actions with our visual builder.",
    image: "/images/demo/workflow-builder.png",
    callout: {
      text: "Drag and drop nodes from the sidebar to create your workflow",
      position: "bottom-left"
    }
  },
  {
    id: 3,
    title: "Configure Triggers",
    description: "Set up triggers that start your workflow automatically. These can be scheduled times, webhook events, or actions in connected tools.",
    image: "/images/demo/configure-trigger.png",
    callout: {
      text: "Configure when your workflow should run",
      position: "center"
    }
  },
  {
    id: 4,
    title: "Add Actions & Logic",
    description: "Add actions that should happen when your workflow runs. Include conditional logic, data transformations, and service-specific operations.",
    image: "/images/demo/add-actions.png",
    callout: {
      text: "Define what happens in each step",
      position: "bottom-right"
    }
  },
  {
    id: 5,
    title: "Test & Deploy",
    description: "Test your workflow to make sure it's working correctly, then deploy it to run automatically. Monitor performance from your dashboard.",
    image: "/images/demo/test-deploy.png",
    callout: {
      text: "See real-time metrics on your dashboard",
      position: "top-left"
    },
    action: {
      text: "Start Building Now",
      link: "/dashboard"
    }
  }
];

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showCallout, setShowCallout] = useState(false);
  
  // Reset to first step when modal is opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setShowCallout(false);
      // Show callout with delay
      const timer = setTimeout(() => {
        setShowCallout(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Show callout with delay when step changes
  useEffect(() => {
    setShowCallout(false);
    const timer = setTimeout(() => {
      setShowCallout(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [currentStep]);
  
  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  
  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };
  
  const nextStep = () => {
    if (currentStep < demoSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentDemoStep = demoSteps.find(step => step.id === currentStep) || demoSteps[0];
  
  if (!isOpen) return null;

  // Get position class for callout
  const getCalloutPositionClass = (position: string) => {
    switch(position) {
      case 'top-left': return 'top-4 left-4';
      case 'top-right': return 'top-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      default: return 'top-4 right-4';
    }
  };
  
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
      >
        <motion.div 
          className="bg-dark-100 border border-gray-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-dark-200">
            <h2 className="text-xl font-bold text-white">Optiflow Interactive Demo</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-700 transition-all"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row">
            {/* Demo content */}
            <div className="p-6 flex-1">
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <span className="bg-primary text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mr-2">
                    {currentStep}
                  </span>
                  <h3 className="text-xl font-bold text-white">{currentDemoStep.title}</h3>
                </div>
                <p className="text-gray-300">{currentDemoStep.description}</p>
              </div>
              
              <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden border border-gray-700 bg-dark-200 flex items-center justify-center mb-4">
                {/* Use the MockScreenshot component instead of placeholder */}
                <MockScreenshot 
                  type={currentDemoStep.id === 1 ? 'connect-tools' : 
                         currentDemoStep.id === 2 ? 'workflow-builder' :
                         currentDemoStep.id === 3 ? 'configure-trigger' :
                         currentDemoStep.id === 4 ? 'add-actions' : 'test-deploy'}
                  className="w-full h-full"
                />
                
                {/* Callout bubble */}
                {currentDemoStep.callout && showCallout && (
                  <motion.div 
                    className={`absolute ${getCalloutPositionClass(currentDemoStep.callout.position)} max-w-[200px] bg-primary text-white p-3 rounded-lg shadow-lg z-10`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="text-sm font-medium">{currentDemoStep.callout.text}</div>
                    <div className="absolute w-3 h-3 bg-primary transform rotate-45" 
                      style={{ 
                        top: currentDemoStep.callout.position.includes('bottom') ? '-6px' : 'auto',
                        bottom: currentDemoStep.callout.position.includes('top') ? '-6px' : 'auto',
                        left: currentDemoStep.callout.position.includes('right') ? '10px' : 
                               currentDemoStep.callout.position === 'center' ? 'calc(50% - 6px)' : 'auto',
                        right: currentDemoStep.callout.position.includes('left') ? '10px' : 'auto'
                      }}
                    />
                  </motion.div>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-4 py-2 rounded-md ${
                    currentStep === 1 
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex items-center">
                  {demoSteps.map(step => (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(step.id)}
                      className={`w-2.5 h-2.5 rounded-full mx-1 ${
                        step.id === currentStep 
                          ? 'bg-primary' 
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                      aria-label={`Go to step ${step.id}`}
                    />
                  ))}
                </div>
                
                {currentDemoStep.action ? (
                  <Link
                    href={currentDemoStep.action.link || '#'}
                    onClick={() => {
                      onClose();
                      currentDemoStep.action?.onClick?.();
                    }}
                    className="px-4 py-2 rounded-md bg-primary hover:bg-primary/90 text-white"
                  >
                    {currentDemoStep.action.text}
                  </Link>
                ) : (
                  <button
                    onClick={nextStep}
                    className="px-4 py-2 rounded-md bg-primary hover:bg-primary/90 text-white"
                  >
                    {currentStep === demoSteps.length ? 'Finish' : 'Next'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 