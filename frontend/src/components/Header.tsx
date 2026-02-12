import React from 'react';
import { useTranslation } from 'react-i18next';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'et' ? 'en' : 'et';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('header.title')}</h1>
        <div className="flex gap-4 items-center">
          <button
            onClick={toggleLanguage}
            className="px-3 py-2 bg-blue-700 rounded hover:bg-blue-800"
          >
            {i18n.language === 'et' ? 'EN' : 'ET'}
          </button>
        </div>
      </nav>
    </header>
  );
};
