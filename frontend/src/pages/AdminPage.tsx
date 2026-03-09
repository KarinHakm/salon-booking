import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { bookingsAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

interface Booking {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  name_et: string;
  name_en: string;
  first_name: string;
  last_name: string;
}

export const AdminPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    bookingsAPI
      .getAll()
      .then((res) => setBookings(res.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const filteredBookings = dateFilter
    ? bookings.filter((b) => b.appointment_date === dateFilter)
    : bookings;

  const serviceName = (b: Booking) =>
    i18n.language === 'et' ? b.name_et : b.name_en;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">{t('admin.dashboard')}</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          {t('header.logout')}
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">{t('booking.selectDate')}</label>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        />
        {dateFilter && (
          <button
            onClick={() => setDateFilter('')}
            className="ml-2 text-blue-600 hover:underline text-sm"
          >
            {t('admin.cancel')}
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">{t('common.loading')}</p>
      ) : filteredBookings.length === 0 ? (
        <p className="text-gray-500">{t('admin.bookings')}: 0</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3 font-semibold">{t('admin.name')}</th>
                <th className="text-left p-3 font-semibold">{t('admin.staff')}</th>
                <th className="text-left p-3 font-semibold">{t('admin.services')}</th>
                <th className="text-left p-3 font-semibold">{t('booking.selectDate')}</th>
                <th className="text-left p-3 font-semibold">{t('booking.selectTime')}</th>
                <th className="text-left p-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{b.customer_name}</td>
                  <td className="p-3">{b.first_name} {b.last_name}</td>
                  <td className="p-3">{serviceName(b)}</td>
                  <td className="p-3">{b.appointment_date}</td>
                  <td className="p-3">{b.appointment_time}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        b.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : b.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
