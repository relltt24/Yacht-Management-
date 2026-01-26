import client from './client';
import { Crew } from '../types';

export const crewApi = {
  getAll: async (filters?: { position?: string; yachtId?: number }): Promise<Crew[]> => {
    const params = new URLSearchParams();
    if (filters?.position) params.append('position', filters.position);
    if (filters?.yachtId) params.append('yachtId', filters.yachtId.toString());
    const response = await client.get(`/crew?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number): Promise<Crew> => {
    const response = await client.get(`/crew/${id}`);
    return response.data;
  },

  create: async (crew: Omit<Crew, 'id'>): Promise<Crew> => {
    const response = await client.post('/crew', crew);
    return response.data;
  },

  update: async (id: number, crew: Partial<Crew>): Promise<Crew> => {
    const response = await client.put(`/crew/${id}`, crew);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await client.delete(`/crew/${id}`);
  },

  assignToYacht: async (crewId: number, yachtId: number): Promise<Crew> => {
    const response = await client.put(`/crew/${crewId}`, { assignedYachtId: yachtId });
    return response.data;
  },
};
