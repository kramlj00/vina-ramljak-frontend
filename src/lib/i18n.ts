import { initReactI18next } from 'react-i18next';

import translationEN from '@/locales/en/translation.json';
// Import translation files
import translationHR from '@/locales/hr/translation.json';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  hr: {
    translation: translationHR,
  },
  en: {
    translation: translationEN,
  },
};

i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'hr', // Default language
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
