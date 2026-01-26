import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Key,
  Save,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import { Card, Button } from '../components/common';

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    company: 'YachtAI Management',
    timezone: 'UTC-5',
    language: 'en',
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    bookingUpdates: true,
    maintenanceReminders: true,
    crewAlerts: true,
    inventoryAlerts: true,
    aiInsights: true,
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Settings" subtitle="Manage your account and preferences" />

      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-ocean-50 text-ocean-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h2>

                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-ocean-400 to-ocean-600 flex items-center justify-center text-white text-2xl font-bold">
                    {profile.name.charAt(0) || 'U'}
                  </div>
                  <div>
                    <Button variant="secondary" size="sm">Change Photo</Button>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                    <select
                      value={profile.timezone}
                      onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                    >
                      <option value="UTC-5">Eastern Time (UTC-5)</option>
                      <option value="UTC-8">Pacific Time (UTC-8)</option>
                      <option value="UTC+0">UTC</option>
                      <option value="UTC+1">Central European (UTC+1)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select
                      value={profile.language}
                      onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
                    Save Changes
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>

                <div className="space-y-4">
                  {[
                    { key: 'emailAlerts', label: 'Email Alerts', description: 'Receive important alerts via email' },
                    { key: 'bookingUpdates', label: 'Booking Updates', description: 'Get notified about new and updated bookings' },
                    { key: 'maintenanceReminders', label: 'Maintenance Reminders', description: 'Reminders for scheduled maintenance tasks' },
                    { key: 'crewAlerts', label: 'Crew Alerts', description: 'Notifications about crew certifications and assignments' },
                    { key: 'inventoryAlerts', label: 'Inventory Alerts', description: 'Low stock and reorder notifications' },
                    { key: 'aiInsights', label: 'AI Insights', description: 'Receive AI-generated insights and recommendations' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[item.key as keyof typeof notifications]}
                          onChange={(e) =>
                            setNotifications({ ...notifications, [item.key]: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ocean-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ocean-500"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-6">
                  <Button onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
                    Save Preferences
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>

                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <Key className="w-6 h-6 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Change Password</p>
                        <p className="text-sm text-gray-500">Update your password regularly for security</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="password"
                        placeholder="Current password"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                      />
                      <input
                        type="password"
                        placeholder="New password"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                      />
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Shield className="w-6 h-6 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      <Button variant="secondary">Enable</Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
                    Update Security Settings
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'appearance' && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Appearance Settings</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                    <div className="grid grid-cols-3 gap-4">
                      {['light', 'dark', 'system'].map((theme) => (
                        <button
                          key={theme}
                          className={`p-4 border-2 rounded-lg text-center capitalize transition-colors ${
                            theme === 'light' ? 'border-ocean-500 bg-ocean-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Palette className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Dashboard Layout</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500">
                      <option>Compact</option>
                      <option>Comfortable</option>
                      <option>Spacious</option>
                    </select>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'integrations' && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Integrations</h2>

                <div className="space-y-4">
                  {[
                    { name: 'Google Calendar', description: 'Sync bookings with Google Calendar', connected: true },
                    { name: 'Stripe', description: 'Process payments for bookings', connected: true },
                    { name: 'Slack', description: 'Get notifications in Slack', connected: false },
                    { name: 'Marine Traffic', description: 'Real-time vessel tracking', connected: false },
                  ].map((integration) => (
                    <div key={integration.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                          <Globe className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{integration.name}</p>
                          <p className="text-sm text-gray-500">{integration.description}</p>
                        </div>
                      </div>
                      <Button variant={integration.connected ? 'secondary' : 'primary'} size="sm">
                        {integration.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
