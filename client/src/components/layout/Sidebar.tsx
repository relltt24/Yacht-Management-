import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Ship,
  Users,
  Wrench,
  Calendar,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Compass,
  Anchor as AnchorIcon,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Voyages', href: '/voyages', icon: Compass, badge: 'AI' },
  { name: 'Fleet', href: '/yachts', icon: Ship },
  { name: 'Crew', href: '/crew', icon: Users },
  { name: 'Bookings', href: '/bookings', icon: Calendar },
  { name: 'Dockage', href: '/dockage', icon: AnchorIcon },
  { name: 'Services', href: '/services', icon: Wrench },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

// VesselHaven VH Logo SVG Component
function VHLogo() {
  return (
    <svg
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-10 h-8"
    >
      <defs>
        <linearGradient id="vhGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3d6a96" />
          <stop offset="100%" stopColor="#4ecdc4" />
        </linearGradient>
      </defs>
      {/* V shape */}
      <path
        d="M5 10 L25 65 L40 35"
        stroke="url(#vhGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* H shape integrated */}
      <path
        d="M40 35 L55 65 L75 10"
        stroke="url(#vhGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* H crossbar */}
      <path
        d="M48 45 L68 45"
        stroke="url(#vhGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function Sidebar() {
  const { logout, user } = useAuth();

  return (
    <div className="flex flex-col h-full bg-navy-950 text-white w-64">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-navy-800/50">
        <VHLogo />
        <div>
          <h1 className="text-lg font-bold tracking-tight">
            <span className="text-white">VESSEL</span>
            <span className="text-ocean-400">HAVEN</span>
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-navy-700 to-navy-700/50 text-ocean-400 border-l-2 border-ocean-400'
                  : 'text-navy-300 hover:bg-navy-800/50 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium flex-1">{item.name}</span>
            {item.badge && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-ocean-500 to-ocean-400 text-white rounded">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* AI Concierge Quick Access */}
      <div className="px-3 py-3">
        <NavLink
          to="/voyages/plan"
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-navy-700 via-navy-600 to-ocean-700 hover:from-navy-600 hover:via-navy-500 hover:to-ocean-600 transition-all group"
        >
          <div className="p-2 bg-ocean-400/20 rounded-lg group-hover:bg-ocean-400/30 transition-colors">
            <Sparkles className="w-5 h-5 text-ocean-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">AI Concierge</p>
            <p className="text-xs text-navy-300">Plan your voyage</p>
          </div>
        </NavLink>
      </div>

      {/* User section */}
      <div className="px-3 py-4 border-t border-navy-800/50">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-navy-300 hover:bg-navy-800/50 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </NavLink>

        <div className="flex items-center gap-3 px-3 py-3 mt-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-600 to-ocean-600 flex items-center justify-center text-white font-semibold ring-2 ring-ocean-400/30">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-navy-400 truncate">{user?.email || 'user@vesselhaven.com'}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-navy-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
