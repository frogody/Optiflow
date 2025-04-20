'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/languageContext';
import translations from '@/translations';

interface TranslatedTextProps {
  textKey: string;
  fallback?: string;
  className?: string;
}

export default function TranslatedText({ textKey, fallback, className }: TranslatedTextProps) {
  const { language } = useLanguage();
  const [translation, setTranslation] = useState<string>(fallback || textKey);

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

  return <span className={className}>{translation}</span>;
} 