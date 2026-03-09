import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">{t('landing.welcome')}</h2>
        <p className="text-lg text-gray-600 mb-8">{t('landing.description')}</p>
        <Link to="/booking" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block">
          {t('landing.bookNow')}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">Service 1</h3>
          <p className="text-gray-600">Service description coming soon...</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">Service 2</h3>
          <p className="text-gray-600">Service description coming soon...</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">Service 3</h3>
          <p className="text-gray-600">Service description coming soon...</p>
        </div>
      </div>
    </div>
  );
};
