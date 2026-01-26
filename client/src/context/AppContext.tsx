import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Yacht, Crew, Maintenance, Booking, Inventory, AIInsight } from '../types';
import { yachtApi, crewApi, maintenanceApi, bookingApi, inventoryApi, analyticsApi } from '../api';

interface AppState {
  yachts: Yacht[];
  crew: Crew[];
  maintenance: Maintenance[];
  bookings: Booking[];
  inventory: Inventory[];
  aiInsights: AIInsight[];
  loading: boolean;
  error: string | null;
}

interface AppContextType extends AppState {
  refreshYachts: () => Promise<void>;
  refreshCrew: () => Promise<void>;
  refreshMaintenance: () => Promise<void>;
  refreshBookings: () => Promise<void>;
  refreshInventory: () => Promise<void>;
  refreshAIInsights: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    yachts: [],
    crew: [],
    maintenance: [],
    bookings: [],
    inventory: [],
    aiInsights: [],
    loading: true,
    error: null,
  });

  const refreshYachts = async () => {
    try {
      const yachts = await yachtApi.getAll();
      setState((prev) => ({ ...prev, yachts }));
    } catch (err) {
      console.error('Failed to fetch yachts:', err);
    }
  };

  const refreshCrew = async () => {
    try {
      const crew = await crewApi.getAll();
      setState((prev) => ({ ...prev, crew }));
    } catch (err) {
      console.error('Failed to fetch crew:', err);
    }
  };

  const refreshMaintenance = async () => {
    try {
      const maintenance = await maintenanceApi.getAll();
      setState((prev) => ({ ...prev, maintenance }));
    } catch (err) {
      console.error('Failed to fetch maintenance:', err);
    }
  };

  const refreshBookings = async () => {
    try {
      const bookings = await bookingApi.getAll();
      setState((prev) => ({ ...prev, bookings }));
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  };

  const refreshInventory = async () => {
    try {
      const inventory = await inventoryApi.getAll();
      setState((prev) => ({ ...prev, inventory }));
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    }
  };

  const refreshAIInsights = async () => {
    try {
      const aiInsights = await analyticsApi.getAIInsights();
      setState((prev) => ({ ...prev, aiInsights }));
    } catch (err) {
      console.error('Failed to fetch AI insights:', err);
    }
  };

  const refreshAll = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await Promise.all([
        refreshYachts(),
        refreshCrew(),
        refreshMaintenance(),
        refreshBookings(),
        refreshInventory(),
        refreshAIInsights(),
      ]);
    } catch (err) {
      setState((prev) => ({ ...prev, error: 'Failed to load data' }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        refreshYachts,
        refreshCrew,
        refreshMaintenance,
        refreshBookings,
        refreshInventory,
        refreshAIInsights,
        refreshAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
