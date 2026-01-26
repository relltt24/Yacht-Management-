import client from './client';
import { Yacht, YachtFilters } from '../types';

export const yachtApi = {
  getAll: async (filters?: YachtFilters): Promise<Yacht[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    const response = await client.get(`/yachts?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number): Promise<Yacht> => {
    const response = await client.get(`/yachts/${id}`);
    return response.data;
  },

  create: async (yacht: Omit<Yacht, 'id' | 'createdAt' | 'updatedAt'>): Promise<Yacht> => {
    const response = await client.post('/yachts', yacht);
    return response.data;
  },

  update: async (id: number, yacht: Partial<Yacht>): Promise<Yacht> => {
    const response = await client.put(`/yachts/${id}`, yacht);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await client.delete(`/yachts/${id}`);
  },
};
