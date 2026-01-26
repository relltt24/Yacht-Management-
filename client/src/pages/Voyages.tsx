import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Plus,
  Search,
  MapPin,
  Calendar,
  Users,
  Ship,
  Sparkles,
  Clock,
  ChevronRight,
  Star,
  Anchor,
  Sun,
  Wind,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/layout/Header';
import { Card, Button, StatusBadge, EmptyState, LoadingSpinner, Modal } from '../components/common';

interface Voyage {
  id: number;
  name: string;
  yachtId: number;
  yachtName: string;
  destination: string;
  location: string;
  startDate: string;
  endDate: string;
  guests: number;
  crew: number;
  status: 'Planning' | 'Upcoming' | 'In Progress' | 'Completed';
  imageUrl?: string;
  itinerary: ItineraryDay[];
}

interface ItineraryDay {
  day: number;
  date: string;
  location: string;
  activities: string[];
  weather?: { temp: number; condition: string };
}

// Sample voyages data
const sampleVoyages: Voyage[] = [
  {
    id: 1,
    name: 'Catalina Wine Mixer',
    yachtId: 1,
    yachtName: 'Azure Dreams',
    destination: 'Catalina Island',
    location: 'Two Harbors, Catalina Island',
    startDate: '2024-09-10',
    endDate: '2024-09-13',
    guests: 6,
    crew: 3,
    status: 'Upcoming',
    itinerary: [
      { day: 1, date: '2024-09-10', location: 'Newport Beach', activities: ['Departure', 'Lunch aboard', 'Arrival at Avalon'] },
      { day: 2, date: '2024-09-11', location: 'Avalon', activities: ['Snorkeling', 'Wine tasting', 'Dinner at shore'] },
      { day: 3, date: '2024-09-12', location: 'Two Harbors', activities: ['Hiking', 'BBQ on beach', 'Stargazing'] },
      { day: 4, date: '2024-09-13', location: 'Return', activities: ['Breakfast cruise', 'Return to Newport'] },
    ],
  },
  {
    id: 2,
    name: 'Mediterranean Escape',
    yachtId: 2,
    yachtName: 'Ocean Serenity',
    destination: 'French Riviera',
    location: 'Monaco',
    startDate: '2024-10-01',
    endDate: '2024-10-08',
    guests: 8,
    crew: 5,
    status: 'Planning',
    itinerary: [],
  },
];

export default function Voyages() {
  const navigate = useNavigate();
  const { yachts, loading } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [voyages] = useState<Voyage[]>(sampleVoyages);
  const [selectedVoyage, setSelectedVoyage] = useState<Voyage | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planMode, setPlanMode] = useState<'ai' | 'manual'>('ai');

  const statuses = ['All', 'Planning', 'Upcoming', 'In Progress', 'Completed'];

  const filteredVoyages = voyages.filter((voyage) => {
    const matchesSearch =
      voyage.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voyage.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || voyage.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading voyages..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Voyages" subtitle="Plan and manage your yacht trips" />

      <div className="p-6">
        {/* AI Concierge Banner */}
        <Card className="mb-6 bg-gradient-to-r from-navy-800 via-navy-700 to-ocean-700 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-ocean-400/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-navy-600/20 rounded-full -ml-24 -mb-24" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-ocean-400/20 rounded-xl">
                <Sparkles className="w-8 h-8 text-ocean-300" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1">AI-Powered Voyage Planning</h2>
                <p className="text-navy-200 max-w-md">
                  Tell us your destination and dates, and our AI will create a complete trip plan
                  including weather forecasts, marinas, and activities.
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowPlanModal(true)}
              className="bg-ocean-400 hover:bg-ocean-500 text-white"
              icon={<Compass className="w-4 h-4" />}
            >
              Plan New Voyage
            </Button>
          </div>
        </Card>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search voyages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === 'All' ? 'All Statuses' : status}
                </option>
              ))}
            </select>

            <Button onClick={() => setShowPlanModal(true)} icon={<Plus className="w-4 h-4" />}>
              New Voyage
            </Button>
          </div>
        </div>

        {/* Voyages Grid */}
        {filteredVoyages.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Compass className="w-8 h-8 text-gray-400" />}
              title="No voyages found"
              description="Start planning your next adventure with our AI Concierge"
              action={{ label: 'Plan Voyage', onClick: () => setShowPlanModal(true) }}
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredVoyages.map((voyage) => (
              <Card
                key={voyage.id}
                className="hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                padding="none"
                onClick={() => setSelectedVoyage(voyage)}
              >
                {/* Voyage Header Image */}
                <div className="h-48 bg-gradient-to-br from-ocean-400 to-navy-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Ship className="w-20 h-20 text-white/20" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <StatusBadge status={voyage.status} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-xl font-bold text-white">{voyage.name}</h3>
                    <div className="flex items-center gap-1 text-white/80 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{voyage.location}</span>
                    </div>
                  </div>
                </div>

                {/* Voyage Details */}
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {voyage.startDate} - {voyage.endDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{voyage.guests} Guests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Anchor className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{voyage.crew} Crew</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Ship className="w-4 h-4 text-ocean-500" />
                      <span className="text-sm font-medium text-gray-900">{voyage.yachtName}</span>
                    </div>
                    <Button variant="ghost" size="sm" icon={<ChevronRight className="w-4 h-4" />}>
                      View Voyage Plan
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* New Voyage Planning Modal */}
      <Modal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        title="Plan Your Voyage"
        size="lg"
      >
        <div className="space-y-6">
          {/* Mode Toggle */}
          <div className="flex rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setPlanMode('ai')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                planMode === 'ai'
                  ? 'bg-white text-ocean-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              AI Concierge
            </button>
            <button
              onClick={() => setPlanMode('manual')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                planMode === 'manual'
                  ? 'bg-white text-ocean-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Manual Plan
            </button>
          </div>

          {planMode === 'ai' ? (
            <div className="space-y-4">
              <div className="p-4 bg-ocean-50 rounded-xl border border-ocean-100">
                <h3 className="font-semibold text-ocean-800 mb-2">AI-Powered Itinerary</h3>
                <p className="text-sm text-ocean-600">
                  Provide a destination and dates, and our AI will generate a complete trip plan,
                  including weather, marinas, and activities.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Yacht</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500">
                  <option value="">Choose a yacht...</option>
                  {yachts.map((yacht) => (
                    <option key={yacht.id} value={yacht.id}>
                      {yacht.name} - {yacht.type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <input
                  type="text"
                  placeholder="e.g., Catalina Island, French Riviera..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Number of guests"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trip Style</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500">
                    <option value="relaxation">Relaxation</option>
                    <option value="adventure">Adventure</option>
                    <option value="celebration">Celebration</option>
                    <option value="family">Family</option>
                    <option value="romantic">Romantic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requests (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Any specific activities, dietary requirements, or preferences..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Create your voyage plan manually by adding each day's itinerary.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Voyage Name</label>
                <input
                  type="text"
                  placeholder="Give your voyage a name..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Yacht</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500">
                  <option value="">Choose a yacht...</option>
                  {yachts.map((yacht) => (
                    <option key={yacht.id} value={yacht.id}>
                      {yacht.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowPlanModal(false)}>
              Cancel
            </Button>
            <Button
              icon={planMode === 'ai' ? <Sparkles className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            >
              {planMode === 'ai' ? 'Generate Itinerary' : 'Create Voyage'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Voyage Detail Modal */}
      <Modal
        isOpen={!!selectedVoyage}
        onClose={() => setSelectedVoyage(null)}
        title={selectedVoyage?.name || 'Voyage Details'}
        size="xl"
      >
        {selectedVoyage && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedVoyage.location}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {selectedVoyage.startDate} - {selectedVoyage.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{selectedVoyage.guests} Guests, {selectedVoyage.crew} Crew</span>
                  </div>
                </div>
              </div>
              <StatusBadge status={selectedVoyage.status} />
            </div>

            {/* Yacht Info */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-ocean-100 rounded-lg">
                  <Ship className="w-6 h-6 text-ocean-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedVoyage.yachtName}</p>
                  <p className="text-sm text-gray-500">Motor Yacht</p>
                </div>
              </div>
            </div>

            {/* Itinerary */}
            {selectedVoyage.itinerary.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Itinerary</h3>
                <div className="space-y-4">
                  {selectedVoyage.itinerary.map((day, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-ocean-100 flex items-center justify-center text-ocean-600 font-bold">
                          {day.day}
                        </div>
                        {index < selectedVoyage.itinerary.length - 1 && (
                          <div className="w-0.5 h-full bg-ocean-100 my-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{day.location}</p>
                            <p className="text-sm text-gray-500">{day.date}</p>
                          </div>
                          {day.weather && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Sun className="w-4 h-4 text-yellow-500" />
                              <span>{day.weather.temp}°F</span>
                            </div>
                          )}
                        </div>
                        <ul className="space-y-1">
                          {day.activities.map((activity, actIdx) => (
                            <li key={actIdx} className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-ocean-400" />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => setSelectedVoyage(null)}>
                Close
              </Button>
              <Button icon={<Calendar className="w-4 h-4" />}>Edit Voyage</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
