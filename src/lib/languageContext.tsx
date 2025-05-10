'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type LanguageCode = 'en' | 'nl' | 'de' | 'fr' | 'es';

export const LANGUAGES: Record<LanguageCode, { name: string, nativeName: string     }> = {
  en: { name: 'English', nativeName: 'English'     },
  nl: { name: 'Dutch', nativeName: 'Nederlands'     },
  de: { name: 'German', nativeName: 'Deutsch'     },
  fr: { name: 'French', nativeName: 'Français'     },
  es: { name: 'Spanish', nativeName: 'Español'     }
};

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  isLoaded: boolean;
};

const LanguageContext = createContext<LanguageContextType>({ language: 'en',
  setLanguage: () => console.warn('LanguageProvider not yet initialized'),
  isLoaded: false,
    });

export function LanguageProvider({ children }: { children: ReactNode     }) {
  const [language, setLanguage] = useState<string>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize language from localStorage or browser preference on client-side
  useEffect(() => {
    const initLanguage = () => {
      if (typeof window !== "undefined") {
        try {
          const savedLanguage = localStorage.getItem('language');
          if (savedLanguage && Object.keys(LANGUAGES).includes(savedLanguage)) {
            setLanguage(savedLanguage);
            document.documentElement.lang = savedLanguage;
          } else {
            const browserLang = navigator.language.split('-')[0];
            if (browserLang && Object.keys(LANGUAGES).includes(browserLang)) {
              setLanguage(browserLang);
              document.documentElement.lang = browserLang;
              localStorage.setItem('language', browserLang);
            } else {
              // Default to 'en' if browser lang is not supported and no saved lang
              document.documentElement.lang = 'en';
              localStorage.setItem('language', 'en');
            }
          }
        } catch (error) { console.error('Failed to initialize language:', error);
          // Ensure a default lang attribute if everything fails
          document.documentElement.lang = 'en'; 
            } finally {
          setIsLoaded(true);
        }
      } else {
        // For server-side rendering or when window is not defined
        // isLoaded remains false, language remains 'en'
        // We could potentially try to get language from accept-language header here for SSR
        // but for now, we stick to the default 'en'.
      }
    };

    initLanguage();
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSetLanguage = (lang: string) => {
    if (Object.keys(LANGUAGES).includes(lang)) {
      setLanguage(lang);
      if (typeof window !== "undefined") {
        document.documentElement.lang = lang;
        try {
          localStorage.setItem('language', lang);
        } catch (error) { console.error('Failed to save language preference:', error);
            }
      }
      console.log(`Language changed to: ${lang}`);
    } else {
      console.warn(`Invalid language code: ${lang}`);
    }
  };

  // When isLoaded is false (SSR or before effect runs), 
  // provide a default context value that won't break consumers.
  // Consumers should ideally check isLoaded if they depend on the exact language.
  const value = isLoaded 
    ? { language, setLanguage: handleSetLanguage, isLoaded     }
    : { language: 'en', setLanguage: handleSetLanguage, isLoaded: false     };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // This typically means useLanguage is used outside of LanguageProvider
    // However, our default value above should prevent `null` issues mostly
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  // To ensure components re-render correctly when isLoaded changes from false to true
  // after client-side hydration, it's good practice for components consuming language
  // to be aware of the isLoaded state.
  return context;
}; 