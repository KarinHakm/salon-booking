import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import et from './locales/et.json';
import en from './locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      et: { translation: et },
      en: { translation: en }
    },
    lng: localStorage.getItem('language') || 'et',
    fallbackLng: 'et',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
