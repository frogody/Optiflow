import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Initialize i18next for client-side
if (typeof window !== 'undefined') {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
      defaultNS: 'common',
      fallbackNS: 'common',
      // Load resources only on client side
      resources: {
        en: {
          common: require('../../public/locales/en/common.json'),
        },
        fr: {
          common: require('../../public/locales/fr/common.json'),
        },
        nl: {
          common: require('../../public/locales/nl/common.json'),
        },
        de: {
          common: require('../../public/locales/de/common.json'),
        },
        es: {
          common: require('../../public/locales/es/common.json'),
        },
      },
    });
}

export default i18n; 