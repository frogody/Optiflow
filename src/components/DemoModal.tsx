import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DemoStep {
  id: number;
  title: string;
  description: string;
  image: string;
}

const demoSteps: DemoStep[] = [
  {
    id: 1,
    title: "Connect Your Tools",
    description: "Start by connecting your favorite tools and services. Optiflow integrates with hundreds of popular services like Google, Slack, Salesforce, and more.",
    image: "/images/demo/connect-tools.png"
  },
  {
    id: 2,
    title: "Build Your Workflow",
    description: "Use our intuitive workflow editor to create automated processes. Drag and drop nodes, connect them together, and configure actions with our visual builder.",
    image: "/images/demo/workflow-builder.png"
  },
  {
    id: 3,
    title: "Configure Triggers",
    description: "Set up triggers that start your workflow automatically. These can be scheduled times, webhook events, or actions in connected tools.",
    image: "/images/demo/configure-trigger.png"
  },
  {
    id: 4,
    title: "Add Actions & Logic",
    description: "Add actions that should happen when your workflow runs. Include conditional logic, data transformations, and service-specific operations.",
    image: "/images/demo/add-actions.png"
  },
  {
    id: 5,
    title: "Test & Deploy",
    description: "Test your workflow to make sure it's working correctly, then deploy it to run automatically. Monitor performance from your dashboard.",
    image: "/images/demo/test-deploy.png"
  }
];

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Reset to first step when modal is opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
    }
  }, [isOpen]);
  
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
                {/* Fallback image display */}
                <div className="text-center text-gray-500">
                  <p>[Demo image placeholder for {currentDemoStep.title}]</p>
                  <p className="text-xs mt-2">Image would be loaded from: {currentDemoStep.image}</p>
                </div>
                
                {/* Use this instead when you have actual images
                <Image
                  src={currentDemoStep.image}
                  alt={currentDemoStep.title}
                  fill
                  className="object-contain"
                />
                */}
              </div>
              
              <div className="flex justify-between mt-4">
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
                
                <button
                  onClick={nextStep}
                  className="px-4 py-2 rounded-md bg-primary hover:bg-primary/90 text-white"
                >
                  {currentStep === demoSteps.length ? 'Finish' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 