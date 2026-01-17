/**
 * Hotel PMS - i18n Configuration
 * Internationalization setup using i18next and react-i18next
 * Supports English and Nepali languages
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslations from './locales/en.json';
import neTranslations from './locales/ne.json';

/**
 * Supported languages configuration
 */
export const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵' },
] as const;

export type LanguageCode = typeof languages[number]['code'];

/**
 * i18n resources
 */
const resources = {
  en: {
    translation: enTranslations,
  },
  ne: {
    translation: neTranslations,
  },
};

/**
 * Initialize i18next
 */
i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize configuration
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'translation',
    debug: import.meta.env.DEV,
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    detection: {
      // Order of detection
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Keys to lookup in localStorage
      lookupLocalStorage: 'hotel-pms-language',
      // Cache the detected language
      caches: ['localStorage'],
    },
  });

/**
 * Change language function
 * @param languageCode - The language code to switch to
 */
export const changeLanguage = (languageCode: LanguageCode) => {
  return i18n.changeLanguage(languageCode);
};

/**
 * Get current language
 */
export const getCurrentLanguage = (): LanguageCode => {
  return i18n.language as LanguageCode;
};

/**
 * Get language info by code
 */
export const getLanguageByCode = (code: string) => {
  return languages.find((lang) => lang.code === code);
};

export default i18n;
