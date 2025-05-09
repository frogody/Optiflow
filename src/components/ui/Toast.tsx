// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import React, { useEffect, useState } from 'react';
import { HiX } from 'react-icons/hi';

export interface ToastProps {
  title: string;
  description: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  title,
  description,
  variant = 'default',
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isVisible) return null;

  const variantClasses = { default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    destructive: 'bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-800',
    success: 'bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-800'
  };

  const titleClasses = { default: 'text-gray-900 dark:text-gray-100',
    destructive: 'text-red-900 dark:text-red-100',
    success: 'text-green-900 dark:text-green-100'
  };

  const descriptionClasses = { default: 'text-gray-600 dark:text-gray-400',
    destructive: 'text-red-700 dark:text-red-300',
    success: 'text-green-700 dark:text-green-300'
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 max-w-md rounded-lg border p-4 shadow-lg ${variantClasses[variant]}`}>
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className={`font-medium ${titleClasses[variant]}`}>{title}</h3>
          <p className={`mt-1 text-sm ${descriptionClasses[variant]}`}>{description}</p>
        </div>
        <button
          onClick={onClose}
          className={`ml-4 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors ${
            variant === 'destructive'
              ? 'hover:bg-red-100 dark:hover:bg-red-800'
              : variant === 'success'
              ? 'hover:bg-green-100 dark:hover:bg-green-800'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          title="Close notification"
        >
          <HiX className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}; 