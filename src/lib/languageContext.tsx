'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type LanguageCode = 'en' | 'nl' | 'de' | 'fr' | 'es';

export const LANGUAGES: Record<LanguageCode, { name: string, nativeName: string }> = {
  en: { name: 'English', nativeName: 'English' },
  nl: { name: 'Dutch', nativeName: 'Nederlands' },
  de: { name: 'German', nativeName: 'Deutsch' },
  fr: { name: 'French', nativeName: 'Français' },
  es: { name: 'Spanish', nativeName: 'Español' }
};

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  isLoaded: boolean;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  isLoaded: false
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en');
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize language from localStorage or browser preference
  useEffect(() => {
    const initLanguage = () => {
      try {
        // First try to load from localStorage
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage && Object.keys(LANGUAGES).includes(savedLanguage)) {
          setLanguage(savedLanguage);
          document.documentElement.lang = savedLanguage;
        } else {
          // Fallback to browser language
          const browserLang = navigator.language.split('-')[0];
          if (browserLang && Object.keys(LANGUAGES).includes(browserLang)) {
            setLanguage(browserLang);
            document.documentElement.lang = browserLang;
            localStorage.setItem('language', browserLang);
          }
        }
      } catch (error) {
        console.error('Failed to initialize language:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    initLanguage();
  }, []);

  const handleSetLanguage = (lang: string) => {
    if (Object.keys(LANGUAGES).includes(lang)) {
      // Update state
      setLanguage(lang);
      
      // Update HTML lang attribute
      document.documentElement.lang = lang;
      
      // Save to localStorage
      try {
        localStorage.setItem('language', lang);
      } catch (error) {
        console.error('Failed to save language preference:', error);
      }
      
      // Force a re-render of the page to apply translations
      console.log(`Language changed to: ${lang}`);
    } else {
      console.warn(`Invalid language code: ${lang}`);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, isLoaded }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext); 