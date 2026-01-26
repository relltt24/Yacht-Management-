import client from './client';
import { DashboardAnalytics, AIInsight } from '../types';

export const analyticsApi = {
  getDashboard: async (): Promise<DashboardAnalytics> => {
    const response = await client.get('/analytics/dashboard');
    return response.data;
  },

  getFleetOverview: async () => {
    const response = await client.get('/analytics/fleet-overview');
    return response.data;
  },

  getMaintenanceInsights: async () => {
    const response = await client.get('/analytics/maintenance-insights');
    return response.data;
  },

  getBookingInsights: async () => {
    const response = await client.get('/analytics/booking-insights');
    return response.data;
  },

  getCrewUtilization: async () => {
    const response = await client.get('/analytics/crew-utilization');
    return response.data;
  },

  getInventoryStatus: async () => {
    const response = await client.get('/analytics/inventory-status');
    return response.data;
  },

  getAIInsights: async (): Promise<AIInsight[]> => {
    // This would be an enhanced AI endpoint
    const [maintenance, booking, inventory] = await Promise.all([
      client.get('/analytics/maintenance-insights'),
      client.get('/analytics/booking-insights'),
      client.get('/analytics/inventory-status'),
    ]);

    const insights: AIInsight[] = [];

    // Generate insights from maintenance data
    if (maintenance.data.predictive) {
      insights.push({
        id: 'maint-1',
        type: 'warning',
        title: 'Upcoming Maintenance Required',
        description: maintenance.data.predictive.recommendation || 'Schedule routine maintenance soon',
        priority: 'Medium',
        actionRequired: true,
        suggestedAction: 'Review maintenance schedule',
        createdAt: new Date().toISOString(),
      });
    }

    // Generate insights from booking data
    if (booking.data.upcomingBookings > 0) {
      insights.push({
        id: 'book-1',
        type: 'opportunity',
        title: `${booking.data.upcomingBookings} Upcoming Bookings`,
        description: 'Ensure all yachts are prepared for upcoming charters',
        priority: 'High',
        actionRequired: true,
        suggestedAction: 'Review booking preparations',
        createdAt: new Date().toISOString(),
      });
    }

    // Generate insights from inventory data
    if (inventory.data.lowStockItems?.length > 0) {
      insights.push({
        id: 'inv-1',
        type: 'alert',
        title: 'Low Stock Alert',
        description: `${inventory.data.lowStockItems.length} items are running low`,
        priority: 'High',
        actionRequired: true,
        suggestedAction: 'Reorder supplies',
        createdAt: new Date().toISOString(),
      });
    }

    return insights;
  },
};
