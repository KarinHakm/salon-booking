import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { isLoggedIn, user } = useAuth();

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-blue-100">
          {t('header.title')}
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/booking" className="hover:text-blue-100">
            {t('header.booking')}
          </Link>
          {isLoggedIn && user?.isAdmin && (
            <Link to="/admin" className="hover:text-blue-100">
              {t('header.admin')}
            </Link>
          )}
          {!isLoggedIn && (
            <Link to="/admin/login" className="hover:text-blue-100">
              {t('header.login')}
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};
