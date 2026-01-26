import client from './client';
import { Inventory } from '../types';

export const inventoryApi = {
  getAll: async (filters?: { category?: string; yachtId?: number; status?: string }): Promise<Inventory[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.yachtId) params.append('yachtId', filters.yachtId.toString());
    if (filters?.status) params.append('status', filters.status);
    const response = await client.get(`/inventory?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number): Promise<Inventory> => {
    const response = await client.get(`/inventory/${id}`);
    return response.data;
  },

  create: async (item: Omit<Inventory, 'id'>): Promise<Inventory> => {
    const response = await client.post('/inventory', item);
    return response.data;
  },

  update: async (id: number, item: Partial<Inventory>): Promise<Inventory> => {
    const response = await client.put(`/inventory/${id}`, item);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await client.delete(`/inventory/${id}`);
  },

  restock: async (id: number, quantity: number): Promise<Inventory> => {
    const response = await client.put(`/inventory/${id}`, {
      quantity,
      lastRestocked: new Date().toISOString().split('T')[0]
    });
    return response.data;
  },

  getLowStock: async (): Promise<Inventory[]> => {
    const response = await client.get('/inventory?status=Low Stock');
    return response.data;
  },
};
