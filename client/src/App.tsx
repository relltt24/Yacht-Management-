import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import {
  Dashboard,
  Yachts,
  YachtForm,
  Crew,
  Maintenance,
  Bookings,
  Inventory,
  Analytics,
  Settings,
  Login,
  Voyages,
  Services,
  Dockage,
  Wallet,
  VendorCatalog,
  Bids,
  Accounting,
} from './pages';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-400"></div>
          <p className="text-navy-300 text-sm">Loading VesselHaven...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// App Routes
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppProvider>
              <Layout />
            </AppProvider>
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        {/* Voyages routes (AI Concierge) */}
        <Route path="voyages" element={<Voyages />} />
        <Route path="voyages/plan" element={<Voyages />} />
        <Route path="voyages/:id" element={<Voyages />} />

        {/* Fleet/Yacht routes */}
        <Route path="yachts" element={<Yachts />} />
        <Route path="yachts/new" element={<YachtForm />} />
        <Route path="yachts/:id" element={<YachtForm />} />
        <Route path="yachts/:id/edit" element={<YachtForm />} />

        {/* Crew routes */}
        <Route path="crew" element={<Crew />} />
        <Route path="crew/new" element={<Crew />} />
        <Route path="crew/:id" element={<Crew />} />
        <Route path="crew/:id/edit" element={<Crew />} />

        {/* Booking routes */}
        <Route path="bookings" element={<Bookings />} />
        <Route path="bookings/new" element={<Bookings />} />
        <Route path="bookings/:id" element={<Bookings />} />
        <Route path="bookings/:id/edit" element={<Bookings />} />

        {/* Dockage routes */}
        <Route path="dockage" element={<Dockage />} />
        <Route path="dockage/:id" element={<Dockage />} />

        {/* Services routes */}
        <Route path="services" element={<Services />} />
        <Route path="services/:id" element={<Services />} />
        <Route path="maintenance" element={<Services />} />
        <Route path="maintenance/new" element={<Services />} />
        <Route path="maintenance/:id" element={<Services />} />

        {/* Inventory routes */}
        <Route path="inventory" element={<Inventory />} />
        <Route path="inventory/new" element={<Inventory />} />
        <Route path="inventory/:id" element={<Inventory />} />
        <Route path="inventory/:id/edit" element={<Inventory />} />

        {/* Analytics */}
        <Route path="analytics" element={<Analytics />} />

        {/* Wallet & Payments */}
        <Route path="wallet" element={<Wallet />} />
        <Route path="wallet/transactions" element={<Wallet />} />
        <Route path="wallet/payees" element={<Wallet />} />

        {/* Vendor Catalog */}
        <Route path="vendors" element={<VendorCatalog />} />
        <Route path="vendors/:id" element={<VendorCatalog />} />

        {/* Bids */}
        <Route path="bids" element={<Bids />} />
        <Route path="bids/:id" element={<Bids />} />

        {/* Accounting */}
        <Route path="accounting" element={<Accounting />} />
        <Route path="accounting/:yachtId" element={<Accounting />} />

        {/* Settings */}
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
