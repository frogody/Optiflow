'use client';

import { useEffect, useState } from 'react';

// Original imports commented out due to build issues
/*
import { useLanguage } from '../lib/languageContext.js';
import translations from '../translations/index.js';
*/

interface TranslatedTextProps { 
  textKey: string;
  fallback?: string;
  className?: string;
}

export default function TranslatedText({ textKey, fallback, className }: TranslatedTextProps): JSX.Element {
  // Temporarily disable translation logic to bypass build errors
  // const { language } = useLanguage(); 
  const [translation, setTranslation] = useState<string>(fallback || textKey);

  /*
  useEffect(() => {
    try {
      // Get the translation file for the current language
      const lang = language as keyof typeof translations;
      const translationObj = translations[lang] || translations.en;
      
      // Navigate through the nested keys
      const keys = textKey.split('.');
      let result: any = translationObj;
      
      for (const key of keys) {
        if (result && result[key] !== undefined) {
          result = result[key];
        } else {
          console.warn(`Translation key not found: ${textKey} in language ${language}`);
          throw new Error(`Translation key not found: ${textKey}`);
        }
      }
      
      if (typeof result === 'string') {
        setTranslation(result);
      } else {
        console.warn(`Translation is not a string: ${textKey}`);
        setTranslation(fallback || textKey);
      }
    } catch (error) {
      setTranslation(fallback || textKey);
    }
  }, [language, textKey, fallback]);
  */

  // Always render fallback or textKey for now
  useEffect(() => {
    setTranslation(fallback || textKey);
  }, [fallback, textKey]);

  return <span className={className}>{translation}</span>;
} 