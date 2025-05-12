import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

let initialized = false;

// Initialize i18next with safe client-side checks
const initI18n = () => {
  if (typeof window !== 'undefined' && !initialized) {
    try {
      // Create localStorage plugin that doesn't use deprecated options
      const localStoragePlugin = {
        type: 'languageDetector',
        async: false,
        init: () => {},
        detect: () => {
          if (!localStorage) return undefined;
          return localStorage.getItem('i18nextLng');
        },
        cacheUserLanguage: (lng) => {
          if (!localStorage) return;
          localStorage.setItem('i18nextLng', lng);
        }
      };

      // Create cookie plugin that doesn't use deprecated options
      const cookiePlugin = {
        type: 'languageDetector',
        async: false,
        init: () => {},
        detect: () => {
          const match = document.cookie.match(new RegExp('(^| )i18nextLng=([^;]+)'));
          return match ? match[2] : undefined;
        },
        cacheUserLanguage: (lng) => {
          const date = new Date();
          date.setFullYear(date.getFullYear() + 1);
          document.cookie = `i18nextLng=${lng};path=/;expires=${date.toUTCString()};SameSite=strict;${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`;
        }
      };

      i18n
        .use(Backend)
        .use({ 
          type: 'languageDetector',
          async: false,
          init: () => {},
          detect: () => {
            // First try localStorage
            if (localStorage) {
              const storedLng = localStorage.getItem('i18nextLng');
              if (storedLng) return storedLng;
            }
            
            // Then try cookies
            const match = document.cookie.match(new RegExp('(^| )i18nextLng=([^;]+)'));
            if (match) return match[2];
            
            // Finally use navigator
            if (navigator.language) {
              return navigator.language;
            }
            
            return undefined;
          },
          cacheUserLanguage: (lng) => {
            // Cache in localStorage
            if (localStorage) {
              localStorage.setItem('i18nextLng', lng);
            }
            
            // Cache in cookies
            const date = new Date();
            date.setFullYear(date.getFullYear() + 1);
            document.cookie = `i18nextLng=${lng};path=/;expires=${date.toUTCString()};SameSite=strict;${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`;
          }
        })
        .use(initReactI18next)
        .init({
          fallbackLng: 'en',
          supportedLngs: ['en', 'fr', 'nl', 'de', 'es'],
          interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
          },
          defaultNS: 'common',
          fallbackNS: 'common',
          backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
          },
          react: {
            useSuspense: false,
          },
        });
      
      initialized = true;
    } catch (error) {
      console.error('Error initializing i18n:', error);
    }
  }
  return i18n;
};

// For server-side rendering compatibility
if (typeof window !== 'undefined') {
  initI18n();
}

export default i18n;
export { initI18n }; 