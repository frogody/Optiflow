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
  version: number;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  isLoaded: false,
  version: 0
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en');
  const [isLoaded, setIsLoaded] = useState(false);
  const [version, setVersion] = useState(0);

  // Initialize language from localStorage or browser preference
  useEffect(() => {
    const initLanguage = () => {
      try {
        console.debug('Initializing language context...');
        // First try to load from localStorage
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage && Object.keys(LANGUAGES).includes(savedLanguage)) {
          console.debug('Found saved language:', savedLanguage);
          setLanguage(savedLanguage);
          document.documentElement.lang = savedLanguage;
          document.documentElement.setAttribute('data-language', savedLanguage);
        } else {
          // Fallback to browser language
          const browserLang = navigator.language.split('-')[0];
          console.debug('No saved language, browser language:', browserLang);
          if (browserLang && Object.keys(LANGUAGES).includes(browserLang)) {
            setLanguage(browserLang);
            document.documentElement.lang = browserLang;
            document.documentElement.setAttribute('data-language', browserLang);
            localStorage.setItem('language', browserLang);
          } else {
            console.debug('Falling back to default language: en');
            setLanguage('en');
            document.documentElement.lang = 'en';
            document.documentElement.setAttribute('data-language', 'en');
            localStorage.setItem('language', 'en');
          }
        }
      } catch (error) {
        console.error('Failed to initialize language:', error);
        // Ensure we always have a valid language set
        setLanguage('en');
        document.documentElement.lang = 'en';
        document.documentElement.setAttribute('data-language', 'en');
      } finally {
        setIsLoaded(true);
      }
    };

    initLanguage();
  }, []);

  const handleSetLanguage = (lang: string) => {
    if (Object.keys(LANGUAGES).includes(lang)) {
      try {
        console.debug('Setting language to:', lang);
        // Update localStorage first
        localStorage.setItem('language', lang);
        
        // Update HTML lang attribute and data attribute
        document.documentElement.lang = lang;
        document.documentElement.setAttribute('data-language', lang);
        
        // Update state and force re-render
        setLanguage(lang);
        setVersion(v => v + 1);
        
        // Log the change
        console.debug(`Language successfully changed to: ${lang}`);
      } catch (error) {
        console.error('Failed to change language:', error);
        // Attempt to recover by setting English
        setLanguage('en');
        document.documentElement.lang = 'en';
        document.documentElement.setAttribute('data-language', 'en');
      }
    } else {
      console.warn(`Invalid language code: ${lang}`);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, isLoaded, version }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext); 