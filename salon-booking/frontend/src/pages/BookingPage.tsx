import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { staffAPI, servicesAPI, bookingsAPI } from '../api/client';

interface Staff {
  id: number;
  first_name: string;
  last_name: string;
}

interface Service {
  id: number;
  name_et: string;
  name_en: string;
  duration_minutes: number;
  price: string;
}

export const BookingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);

  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    staffAPI.getAll().then((res) => setStaffList(res.data));
    servicesAPI.getAll().then((res) => setServices(res.data));
  }, []);

  useEffect(() => {
    if (selectedStaff && selectedService && selectedDate) {
      setLoading(true);
      setAvailableSlots([]);
      setSelectedTime('');
      bookingsAPI
        .getAvailability(selectedService.id, selectedStaff.id, selectedDate)
        .then((res) => setAvailableSlots(res.data.availableSlots))
        .catch(() => setAvailableSlots([]))
        .finally(() => setLoading(false));
    }
  }, [selectedStaff, selectedService, selectedDate]);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await bookingsAPI.create({
        serviceId: selectedService!.id,
        staffId: selectedStaff!.id,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        customerName,
        customerEmail,
        customerPhone,
      });
      setSuccess(true);
    } catch (err: any) {
      const msg = err.response?.data?.error || t('booking.bookingError');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            {t('booking.bookingSuccess')}
          </h2>
          <p className="text-gray-600 mb-2">{selectedStaff!.first_name} {selectedStaff!.last_name}</p>
          <p className="text-gray-600 mb-2">{selectedDate} — {selectedTime}</p>
          <button
            onClick={() => {
              setSuccess(false);
              setStep(1);
              setSelectedStaff(null);
              setSelectedService(null);
              setSelectedDate('');
              setSelectedTime('');
              setCustomerName('');
              setCustomerEmail('');
              setCustomerPhone('');
            }}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {t('booking.guestBooking')}
          </button>
        </div>
      </div>
    );
  }

  const serviceName = (s: Service) =>
    i18n.language === 'et' ? s.name_et : s.name_en;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h2 className="text-3xl font-bold mb-8 text-center">{t('header.booking')}</h2>

      {/* Progress */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              s <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Step 1: Select service */}
      {step === 1 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">{t('booking.selectService')}</h3>
          <div className="space-y-3">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedService(s);
                  setStep(2);
                }}
                className={`w-full text-left p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 ${
                  selectedService?.id === s.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="font-semibold">{serviceName(s)}</div>
                <div className="text-sm text-gray-500">
                  {s.duration_minutes} {t('booking.minutes')} — {s.price}{t('booking.eur')}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Select staff */}
      {step === 2 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">{t('booking.selectStaff')}</h3>
          <div className="space-y-3">
            {staffList.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedStaff(s);
                  setStep(3);
                }}
                className={`w-full text-left p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 ${
                  selectedStaff?.id === s.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="font-semibold">{s.first_name} {s.last_name}</div>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(1)} className="mt-4 text-blue-600 hover:underline">
            {t('common.back')}
          </button>
        </div>
      )}

      {/* Step 3: Select date & time */}
      {step === 3 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">{t('booking.selectDate')}</h3>
          <input
            type="date"
            min={today}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-6"
          />

          {selectedDate && (
            <>
              <h3 className="text-xl font-semibold mb-4">{t('booking.selectTime')}</h3>
              {loading ? (
                <p className="text-gray-500">{t('common.loading')}</p>
              ) : availableSlots.length === 0 ? (
                <p className="text-gray-500">{t('booking.selectValidTime')}</p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => {
                        setSelectedTime(slot);
                        setStep(4);
                      }}
                      className={`p-2 border rounded text-center hover:bg-blue-50 hover:border-blue-500 ${
                        selectedTime === slot ? 'bg-blue-50 border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
          <button onClick={() => setStep(2)} className="mt-4 text-blue-600 hover:underline">
            {t('common.back')}
          </button>
        </div>
      )}

      {/* Step 4: Contact details */}
      {step === 4 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">{t('booking.guestBooking')}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('booking.firstName')}</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('booking.email')}</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('booking.phone')}</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(3)} className="text-blue-600 hover:underline">
              {t('common.back')}
            </button>
            <button
              onClick={() => setStep(5)}
              disabled={!customerName || !customerEmail || !customerPhone}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {t('common.submit')}
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Confirm */}
      {step === 5 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">{t('booking.confirm')}</h3>
          <div className="bg-gray-50 p-6 rounded-lg space-y-2 mb-6">
            <p><strong>{t('booking.selectService')}:</strong> {selectedService && serviceName(selectedService)}</p>
            <p><strong>{t('booking.selectStaff')}:</strong> {selectedStaff?.first_name} {selectedStaff?.last_name}</p>
            <p><strong>{t('booking.selectDate')}:</strong> {selectedDate}</p>
            <p><strong>{t('booking.selectTime')}:</strong> {selectedTime}</p>
            <p><strong>{t('booking.firstName')}:</strong> {customerName}</p>
            <p><strong>{t('booking.email')}:</strong> {customerEmail}</p>
            <p><strong>{t('booking.phone')}:</strong> {customerPhone}</p>
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(4)} className="text-blue-600 hover:underline">
              {t('common.back')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? t('common.loading') : t('booking.confirm')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
