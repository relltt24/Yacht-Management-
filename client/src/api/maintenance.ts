import client from './client';
import { Maintenance, MaintenanceFilters } from '../types';

export const maintenanceApi = {
  getAll: async (filters?: MaintenanceFilters): Promise<Maintenance[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.yachtId) params.append('yachtId', filters.yachtId.toString());
    if (filters?.priority) params.append('priority', filters.priority);
    const response = await client.get(`/maintenance?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number): Promise<Maintenance> => {
    const response = await client.get(`/maintenance/${id}`);
    return response.data;
  },

  create: async (maintenance: Omit<Maintenance, 'id'>): Promise<Maintenance> => {
    const response = await client.post('/maintenance', maintenance);
    return response.data;
  },

  update: async (id: number, maintenance: Partial<Maintenance>): Promise<Maintenance> => {
    const response = await client.put(`/maintenance/${id}`, maintenance);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await client.delete(`/maintenance/${id}`);
  },

  getAIPredictions: async (yachtId?: number): Promise<Maintenance['aiPrediction'][]> => {
    const params = yachtId ? `?yachtId=${yachtId}` : '';
    const response = await client.get(`/analytics/maintenance-insights${params}`);
    return response.data.predictions || [];
  },
};
