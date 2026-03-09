import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { servicesAPI } from '../api/client';

interface Service {
  id: number;
  name_et: string;
  duration_minutes: number;
  price: string;
}

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    servicesAPI.getAll().then((res) => setServices(res.data));
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">{t('landing.welcome')}</h2>
        <p className="text-lg text-gray-600 mb-8">{t('landing.description')}</p>
        <Link to="/booking" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block">
          {t('landing.bookNow')}
        </Link>
      </div>

      <h3 className="text-2xl font-bold mb-6 text-center">{t('landing.services')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((s) => (
          <div key={s.id} className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-xl font-semibold mb-2">{s.name_et}</h4>
            <p className="text-gray-500 text-sm">{s.duration_minutes} {t('booking.minutes')}</p>
            <p className="text-blue-600 font-bold mt-2">{s.price} {t('booking.eur')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
