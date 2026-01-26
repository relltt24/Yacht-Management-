import React from 'react';
import { Bell, Search, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { aiInsights } = useApp();
  const unreadInsights = aiInsights.filter((i) => i.actionRequired).length;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
            />
          </div>

          {/* AI Assistant */}
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-ocean-500 to-ocean-600 text-white rounded-lg hover:from-ocean-600 hover:to-ocean-700 transition-all shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI Assistant</span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            {unreadInsights > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadInsights}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
