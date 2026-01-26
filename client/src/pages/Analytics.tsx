import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Ship,
  DollarSign,
  Users,
  Wrench,
  Calendar,
  Package,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Brain,
  Zap,
  Target,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { analyticsApi } from '../api';
import Header from '../components/layout/Header';
import { Card, LoadingSpinner } from '../components/common';

const COLORS = ['#00b9f5', '#0076aa', '#065274', '#04354d', '#2ccfff', '#75dfff'];

export default function Analytics() {
  const { yachts, crew, maintenance, bookings, inventory, aiInsights, loading } = useApp();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await analyticsApi.getDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoadingAnalytics(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || loadingAnalytics) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading analytics..." />
      </div>
    );
  }

  // Generate chart data from real data
  const revenueData = [
    { month: 'Jan', revenue: 45000, bookings: 3 },
    { month: 'Feb', revenue: 52000, bookings: 4 },
    { month: 'Mar', revenue: 48000, bookings: 3 },
    { month: 'Apr', revenue: 61000, bookings: 5 },
    { month: 'May', revenue: 55000, bookings: 4 },
    { month: 'Jun', revenue: 72000, bookings: 6 },
  ];

  const fleetStatusData = [
    { name: 'Available', value: yachts.filter((y) => y.status === 'Available').length, color: '#22c55e' },
    { name: 'Chartered', value: yachts.filter((y) => y.status === 'Chartered').length, color: '#3b82f6' },
    { name: 'Maintenance', value: yachts.filter((y) => y.status === 'Maintenance').length, color: '#f59e0b' },
    { name: 'In Transit', value: yachts.filter((y) => y.status === 'In Transit').length, color: '#8b5cf6' },
  ].filter((d) => d.value > 0);

  const crewByPosition = [
    { position: 'Captain', count: crew.filter((c) => c.position === 'Captain').length },
    { position: 'First Mate', count: crew.filter((c) => c.position === 'First Mate').length },
    { position: 'Engineer', count: crew.filter((c) => c.position === 'Engineer').length },
    { position: 'Chef', count: crew.filter((c) => c.position === 'Chef').length },
    { position: 'Steward', count: crew.filter((c) => c.position === 'Steward').length },
    { position: 'Deckhand', count: crew.filter((c) => c.position === 'Deckhand').length },
  ].filter((d) => d.count > 0);

  const maintenanceByStatus = [
    { status: 'Scheduled', count: maintenance.filter((m) => m.status === 'Scheduled').length },
    { status: 'In Progress', count: maintenance.filter((m) => m.status === 'In Progress').length },
    { status: 'Completed', count: maintenance.filter((m) => m.status === 'Completed').length },
    { status: 'Overdue', count: maintenance.filter((m) => m.status === 'Overdue').length },
  ];

  const inventoryByCategory = [
    { category: 'Safety', count: inventory.filter((i) => i.category === 'Safety').length },
    { category: 'Navigation', count: inventory.filter((i) => i.category === 'Navigation').length },
    { category: 'Provisions', count: inventory.filter((i) => i.category === 'Provisions').length },
    { category: 'Maintenance', count: inventory.filter((i) => i.category === 'Maintenance').length },
    { category: 'Guest', count: inventory.filter((i) => i.category === 'Guest Amenities').length },
  ].filter((d) => d.count > 0);

  // Calculate KPIs
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const avgBookingValue = bookings.length > 0 ? totalRevenue / bookings.length : 0;
  const occupancyRate = yachts.length > 0
    ? (yachts.filter((y) => y.status === 'Chartered').length / yachts.length) * 100
    : 0;
  const maintenanceCost = maintenance.reduce((sum, m) => sum + (m.estimatedCost || 0), 0);

  // AI Predictions
  const aiPredictions = [
    {
      id: 1,
      type: 'maintenance',
      title: 'Engine Service Recommended',
      yacht: yachts[0]?.name || 'Ocean Serenity',
      prediction: 'Based on usage patterns, engine maintenance will be needed in ~30 days',
      confidence: 87,
      action: 'Schedule preventive maintenance',
      impact: 'Avoid potential $15,000 repair cost',
    },
    {
      id: 2,
      type: 'booking',
      title: 'High Demand Period Approaching',
      yacht: 'All Fleet',
      prediction: 'Historical data suggests 40% increase in booking requests next month',
      confidence: 92,
      action: 'Ensure all yachts are charter-ready',
      impact: 'Potential additional revenue: $120,000',
    },
    {
      id: 3,
      type: 'inventory',
      title: 'Safety Equipment Expiring',
      yacht: yachts[0]?.name || 'Ocean Serenity',
      prediction: '3 safety items will expire within 60 days',
      confidence: 100,
      action: 'Order replacement equipment',
      impact: 'Maintain compliance and safety',
    },
    {
      id: 4,
      type: 'crew',
      title: 'Certification Renewal Due',
      yacht: 'Multiple Crew',
      prediction: '2 crew members have certifications expiring in 45 days',
      confidence: 100,
      action: 'Schedule training/renewal',
      impact: 'Avoid operational delays',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Analytics & AI Insights" subtitle="Data-driven insights for your fleet" />

      <div className="p-6">
        {/* AI Insights Banner */}
        <Card className="mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
          <div className="relative z-10">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-white/20 rounded-xl">
                <Brain className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">AI-Powered Fleet Intelligence</h2>
                <p className="text-white/80 mb-4">
                  Our AI continuously analyzes your fleet data, usage patterns, weather conditions, and maintenance
                  history to provide actionable insights that help optimize operations and reduce costs.
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Real-time Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>Predictive Maintenance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Revenue Optimization</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +12.5% vs last period
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Fleet Utilization</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{occupancyRate.toFixed(0)}%</p>
                <p className="mt-1 text-sm text-gray-500">
                  {yachts.filter((y) => y.status === 'Chartered').length} of {yachts.length} yachts active
                </p>
              </div>
              <div className="p-3 bg-ocean-100 rounded-lg">
                <Ship className="w-6 h-6 text-ocean-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Booking Value</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">${avgBookingValue.toLocaleString()}</p>
                <p className="mt-1 text-sm text-gray-500">{bookings.length} total bookings</p>
              </div>
              <div className="p-3 bg-violet-100 rounded-lg">
                <Calendar className="w-6 h-6 text-violet-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Maintenance Costs</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">${maintenanceCost.toLocaleString()}</p>
                <p className="mt-1 text-sm text-amber-600 flex items-center gap-1">
                  {maintenance.filter((m) => m.status === 'Scheduled').length} scheduled
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <Wrench className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* AI Predictions */}
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          AI Predictions & Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {aiPredictions.map((prediction) => (
            <Card key={prediction.id} className="border-l-4 border-l-purple-500">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${
                  prediction.type === 'maintenance' ? 'bg-amber-100' :
                  prediction.type === 'booking' ? 'bg-green-100' :
                  prediction.type === 'inventory' ? 'bg-blue-100' : 'bg-purple-100'
                }`}>
                  {prediction.type === 'maintenance' && <Wrench className="w-5 h-5 text-amber-600" />}
                  {prediction.type === 'booking' && <Calendar className="w-5 h-5 text-green-600" />}
                  {prediction.type === 'inventory' && <Package className="w-5 h-5 text-blue-600" />}
                  {prediction.type === 'crew' && <Users className="w-5 h-5 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{prediction.title}</h3>
                    <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                      {prediction.confidence}% confidence
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{prediction.yacht}</p>
                  <p className="text-sm text-gray-700 mb-2">{prediction.prediction}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ocean-600 font-medium">Action: {prediction.action}</span>
                    <span className="text-green-600">{prediction.impact}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Trend */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00b9f5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00b9f5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#00b9f5"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Fleet Status */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fleetStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {fleetStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [value, name]}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Crew Distribution */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Crew by Position</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={crewByPosition} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis type="category" dataKey="position" stroke="#6b7280" width={80} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Maintenance Status */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={maintenanceByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="status" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Active Alerts */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts & Notifications</h3>
          <div className="space-y-3">
            {aiInsights.filter((i) => i.actionRequired).map((insight) => (
              <div
                key={insight.id}
                className={`flex items-center gap-4 p-3 rounded-lg ${
                  insight.type === 'alert' ? 'bg-red-50' :
                  insight.type === 'warning' ? 'bg-yellow-50' :
                  insight.type === 'opportunity' ? 'bg-green-50' : 'bg-blue-50'
                }`}
              >
                {insight.type === 'alert' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                {insight.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                {insight.type === 'opportunity' && <TrendingUp className="w-5 h-5 text-green-500" />}
                {insight.type === 'recommendation' && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{insight.title}</p>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                </div>
                {insight.suggestedAction && (
                  <span className="text-sm text-ocean-600 font-medium">{insight.suggestedAction}</span>
                )}
              </div>
            ))}
            {aiInsights.filter((i) => i.actionRequired).length === 0 && (
              <p className="text-center text-gray-500 py-4">No active alerts at this time</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
