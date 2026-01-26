import React from 'react';
import { Link } from 'react-router-dom';
import {
  Ship,
  Users,
  Wrench,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  DollarSign,
  Anchor,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/layout/Header';
import { Card, StatusBadge, LoadingSpinner } from '../components/common';

export default function Dashboard() {
  const { yachts, crew, maintenance, bookings, inventory, aiInsights, loading } = useApp();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading dashboard..." />
      </div>
    );
  }

  // Calculate stats
  const availableYachts = yachts.filter((y) => y.status === 'Available').length;
  const activeBookings = bookings.filter((b) => b.status === 'In Progress' || b.status === 'Confirmed').length;
  const pendingMaintenance = maintenance.filter((m) => m.status === 'Scheduled' || m.status === 'In Progress').length;
  const lowStockItems = inventory.filter((i) => i.status === 'Low Stock' || i.status === 'Out of Stock').length;

  const stats = [
    {
      name: 'Total Yachts',
      value: yachts.length,
      subtext: `${availableYachts} available`,
      icon: Ship,
      color: 'bg-ocean-500',
      href: '/yachts',
    },
    {
      name: 'Active Crew',
      value: crew.filter((c) => c.status === 'Active').length,
      subtext: `${crew.length} total`,
      icon: Users,
      color: 'bg-emerald-500',
      href: '/crew',
    },
    {
      name: 'Active Bookings',
      value: activeBookings,
      subtext: `${bookings.length} total`,
      icon: Calendar,
      color: 'bg-violet-500',
      href: '/bookings',
    },
    {
      name: 'Pending Maintenance',
      value: pendingMaintenance,
      subtext: `${maintenance.length} total`,
      icon: Wrench,
      color: 'bg-amber-500',
      href: '/maintenance',
    },
  ];

  const recentBookings = bookings.slice(0, 5);
  const upcomingMaintenance = maintenance
    .filter((m) => m.status === 'Scheduled')
    .slice(0, 5);

  const priorityInsights = aiInsights.filter((i) => i.priority === 'High' || i.actionRequired);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Dashboard"
        subtitle={`Welcome back! Here's what's happening with your fleet.`}
      />

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Link key={stat.name} to={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="mt-1 text-sm text-gray-500">{stat.subtext}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* AI Insights Banner */}
        {priorityInsights.length > 0 && (
          <Card className="mb-8 bg-gradient-to-r from-ocean-600 to-navy-700 text-white">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">AI Insights</h3>
                <div className="space-y-2">
                  {priorityInsights.slice(0, 3).map((insight) => (
                    <div key={insight.id} className="flex items-center gap-2 text-sm">
                      {insight.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-300" />}
                      {insight.type === 'alert' && <AlertTriangle className="w-4 h-4 text-red-300" />}
                      {insight.type === 'opportunity' && <TrendingUp className="w-4 h-4 text-green-300" />}
                      {insight.type === 'recommendation' && <CheckCircle2 className="w-4 h-4 text-blue-300" />}
                      <span>{insight.title}: {insight.description}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link
                to="/analytics"
                className="flex items-center gap-1 text-sm font-medium hover:underline"
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Bookings */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
              <Link to="/bookings" className="text-sm text-ocean-600 hover:text-ocean-700 font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentBookings.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No recent bookings</p>
              ) : (
                recentBookings.map((booking) => {
                  const yacht = yachts.find((y) => y.id === booking.yachtId);
                  return (
                    <div key={booking.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-violet-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-violet-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {booking.clientName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {yacht?.name || 'Unknown Yacht'} • {booking.startDate}
                        </p>
                      </div>
                      <StatusBadge status={booking.status} size="sm" />
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* Upcoming Maintenance */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Maintenance</h2>
              <Link to="/maintenance" className="text-sm text-ocean-600 hover:text-ocean-700 font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingMaintenance.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No scheduled maintenance</p>
              ) : (
                upcomingMaintenance.map((item) => {
                  const yacht = yachts.find((y) => y.id === item.yachtId);
                  return (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <Wrench className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          {yacht?.name || 'Unknown Yacht'} • {item.scheduledDate}
                        </p>
                      </div>
                      <StatusBadge status={item.priority} size="sm" />
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Fleet Status & Inventory Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fleet Status */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Fleet Status</h2>
            <div className="space-y-3">
              {yachts.map((yacht) => (
                <Link
                  key={yacht.id}
                  to={`/yachts/${yacht.id}`}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="p-2 bg-ocean-100 rounded-lg">
                    <Anchor className="w-5 h-5 text-ocean-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{yacht.name}</p>
                    <p className="text-xs text-gray-500">
                      {yacht.type} • {yacht.length} {yacht.lengthUnit}
                    </p>
                  </div>
                  <StatusBadge status={yacht.status} size="sm" />
                </Link>
              ))}
              {yachts.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No yachts in fleet</p>
              )}
            </div>
          </Card>

          {/* Quick Actions & Alerts */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/yachts/new"
                className="flex flex-col items-center gap-2 p-4 bg-ocean-50 rounded-lg hover:bg-ocean-100 transition-colors"
              >
                <Ship className="w-6 h-6 text-ocean-600" />
                <span className="text-sm font-medium text-ocean-700">Add Yacht</span>
              </Link>
              <Link
                to="/crew/new"
                className="flex flex-col items-center gap-2 p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                <Users className="w-6 h-6 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Add Crew</span>
              </Link>
              <Link
                to="/bookings/new"
                className="flex flex-col items-center gap-2 p-4 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors"
              >
                <Calendar className="w-6 h-6 text-violet-600" />
                <span className="text-sm font-medium text-violet-700">New Booking</span>
              </Link>
              <Link
                to="/maintenance/new"
                className="flex flex-col items-center gap-2 p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
              >
                <Wrench className="w-6 h-6 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">Schedule Maintenance</span>
              </Link>
            </div>

            {lowStockItems > 0 && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium text-red-700">
                    {lowStockItems} inventory items need restocking
                  </span>
                </div>
                <Link
                  to="/inventory?status=Low%20Stock"
                  className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium inline-flex items-center gap-1"
                >
                  View items
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
