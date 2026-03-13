import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || '/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  logout: () => localStorage.removeItem('token'),
};

export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id: number) => api.get(`/services/${id}`),
  create: (data: any) => api.post('/services', data),
  update: (id: number, data: any) => api.patch(`/services/${id}`, data),
  delete: (id: number) => api.delete(`/services/${id}`),
};

export const bookingsAPI = {
  getAll: () => api.get('/bookings'),
  getById: (id: number) => api.get(`/bookings/${id}`),
  create: (data: any) => api.post('/bookings', data),
  update: (id: number, data: any) => api.patch(`/bookings/${id}`, data),
  delete: (id: number) => api.delete(`/bookings/${id}`),
  getAvailability: (serviceId: number, staffId: number, date: string) =>
    api.get('/bookings/availability', {
      params: { serviceId, staffId, date },
    }),
};

export const staffAPI = {
  getAll: () => api.get('/staff'),
  getById: (id: number) => api.get(`/staff/${id}`),
  create: (data: any) => api.post('/staff', data),
  update: (id: number, data: any) => api.patch(`/staff/${id}`, data),
  delete: (id: number) => api.delete(`/staff/${id}`),
};

export default api;
