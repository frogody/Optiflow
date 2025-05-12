import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Initialize i18next with safe client-side checks
const initI18n = () => {
  if (typeof window !== 'undefined') {
    try {
      i18n
        .use(Backend)
        .use(LanguageDetector)
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
          detection: {
            order: ['cookie', 'localStorage', 'navigator'],
            caches: ['cookie', 'localStorage'],
          },
          react: {
            useSuspense: false,
          },
        });
    } catch (error) {
      console.error('Error initializing i18n:', error);
    }
  }
};

// Initialize immediately for client-side
initI18n();

export default i18n; 