import client from './client';
import { Booking, BookingFilters } from '../types';

export const bookingApi = {
  getAll: async (filters?: BookingFilters): Promise<Booking[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.yachtId) params.append('yachtId', filters.yachtId.toString());
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    const response = await client.get(`/bookings?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number): Promise<Booking> => {
    const response = await client.get(`/bookings/${id}`);
    return response.data;
  },

  create: async (booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
    const response = await client.post('/bookings', booking);
    return response.data;
  },

  update: async (id: number, booking: Partial<Booking>): Promise<Booking> => {
    const response = await client.put(`/bookings/${id}`, booking);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await client.delete(`/bookings/${id}`);
  },

  confirm: async (id: number): Promise<Booking> => {
    const response = await client.put(`/bookings/${id}`, { status: 'Confirmed' });
    return response.data;
  },

  cancel: async (id: number): Promise<Booking> => {
    const response = await client.put(`/bookings/${id}`, { status: 'Cancelled' });
    return response.data;
  },
};
