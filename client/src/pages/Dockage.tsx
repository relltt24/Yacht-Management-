import React, { useState } from 'react';
import {
  Anchor,
  Search,
  MapPin,
  Star,
  Phone,
  Clock,
  Wifi,
  Zap,
  Droplets,
  ShieldCheck,
  Navigation,
  Filter,
  Calendar,
  DollarSign,
} from 'lucide-react';
import Header from '../components/layout/Header';
import { Card, Button, StatusBadge, Modal, EmptyState } from '../components/common';

interface Marina {
  id: number;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  reviews: number;
  pricePerNight: number;
  maxLength: number;
  maxBeam: number;
  amenities: string[];
  slipsAvailable: number;
  totalSlips: number;
  contact: string;
  hours: string;
  images: string[];
}

interface Reservation {
  id: number;
  marinaId: number;
  marinaName: string;
  yachtName: string;
  slipNumber: string;
  checkIn: string;
  checkOut: string;
  status: 'Confirmed' | 'Pending' | 'Checked In' | 'Completed' | 'Cancelled';
  totalCost: number;
}

const sampleMarinas: Marina[] = [
  {
    id: 1,
    name: 'Newport Harbor Marina',
    location: 'Newport Beach, CA',
    coordinates: { lat: 33.6189, lng: -117.9289 },
    rating: 4.8,
    reviews: 234,
    pricePerNight: 150,
    maxLength: 200,
    maxBeam: 40,
    amenities: ['Shore Power', 'Water', 'WiFi', 'Fuel Dock', 'Security', 'Pump Out'],
    slipsAvailable: 12,
    totalSlips: 150,
    contact: '+1 (949) 555-0100',
    hours: '24/7 Access',
    images: [],
  },
  {
    id: 2,
    name: 'Marina del Rey Yacht Club',
    location: 'Marina del Rey, CA',
    coordinates: { lat: 33.9802, lng: -118.4517 },
    rating: 4.9,
    reviews: 189,
    pricePerNight: 200,
    maxLength: 180,
    maxBeam: 35,
    amenities: ['Shore Power', 'Water', 'WiFi', 'Restaurant', 'Pool', 'Security'],
    slipsAvailable: 5,
    totalSlips: 120,
    contact: '+1 (310) 555-0200',
    hours: 'Office: 8AM-6PM',
    images: [],
  },
  {
    id: 3,
    name: 'Catalina Island Harbor',
    location: 'Avalon, Catalina Island',
    coordinates: { lat: 33.3428, lng: -118.3265 },
    rating: 4.7,
    reviews: 156,
    pricePerNight: 125,
    maxLength: 150,
    maxBeam: 30,
    amenities: ['Mooring Balls', 'Water Taxi', 'Shore Access', 'Fuel'],
    slipsAvailable: 20,
    totalSlips: 80,
    contact: '+1 (310) 555-0300',
    hours: '6AM-10PM',
    images: [],
  },
];

const sampleReservations: Reservation[] = [
  {
    id: 1,
    marinaId: 1,
    marinaName: 'Newport Harbor Marina',
    yachtName: 'Azure Dreams',
    slipNumber: 'A-23',
    checkIn: '2024-09-15',
    checkOut: '2024-09-18',
    status: 'Confirmed',
    totalCost: 450,
  },
  {
    id: 2,
    marinaId: 3,
    marinaName: 'Catalina Island Harbor',
    yachtName: 'Azure Dreams',
    slipNumber: 'M-45',
    checkIn: '2024-09-20',
    checkOut: '2024-09-22',
    status: 'Pending',
    totalCost: 250,
  },
];

const amenityIcons: Record<string, React.ReactNode> = {
  'Shore Power': <Zap className="w-4 h-4" />,
  'Water': <Droplets className="w-4 h-4" />,
  'WiFi': <Wifi className="w-4 h-4" />,
  'Security': <ShieldCheck className="w-4 h-4" />,
};

export default function Dockage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'find' | 'reservations'>('find');
  const [selectedMarina, setSelectedMarina] = useState<Marina | null>(null);
  const [showBookModal, setShowBookModal] = useState(false);

  const filteredMarinas = sampleMarinas.filter((marina) =>
    marina.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    marina.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Dockage" subtitle="Find marinas and manage slip reservations" />

      <div className="p-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('find')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'find'
                ? 'bg-ocean-100 text-ocean-700'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Find Marinas
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'reservations'
                ? 'bg-ocean-100 text-ocean-700'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            My Reservations
            <span className="ml-2 px-2 py-0.5 bg-ocean-500 text-white text-xs rounded-full">
              {sampleReservations.length}
            </span>
          </button>
        </div>

        {activeTab === 'find' ? (
          <>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search marinas by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" icon={<Filter className="w-4 h-4" />}>
                  Filters
                </Button>
                <Button variant="secondary" icon={<Navigation className="w-4 h-4" />}>
                  Near Me
                </Button>
              </div>
            </div>

            {/* Marinas Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredMarinas.map((marina) => (
                <Card key={marina.id} className="hover:shadow-lg transition-shadow" padding="none">
                  {/* Marina Image */}
                  <div className="h-40 bg-gradient-to-br from-ocean-400 to-navy-600 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Anchor className="w-16 h-16 text-white/20" />
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium text-sm">{marina.rating}</span>
                        <span className="text-xs text-gray-500">({marina.reviews})</span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <h3 className="text-lg font-bold text-white">{marina.name}</h3>
                      <div className="flex items-center gap-1 text-white/80 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{marina.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Marina Details */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          ${marina.pricePerNight}
                          <span className="text-sm font-normal text-gray-500">/night</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">
                          {marina.slipsAvailable} slips available
                        </p>
                        <p className="text-xs text-gray-500">of {marina.totalSlips} total</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <span>Max {marina.maxLength}' LOA</span>
                      <span>•</span>
                      <span>Max {marina.maxBeam}' Beam</span>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {marina.amenities.slice(0, 4).map((amenity) => (
                        <span
                          key={amenity}
                          className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {amenityIcons[amenity] || <span className="w-4 h-4" />}
                          {amenity}
                        </span>
                      ))}
                      {marina.amenities.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{marina.amenities.length - 4} more
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedMarina(marina)}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedMarina(marina);
                          setShowBookModal(true);
                        }}
                      >
                        Book Slip
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          /* Reservations */
          <div className="space-y-4">
            {sampleReservations.map((reservation) => (
              <Card key={reservation.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-ocean-100 rounded-lg">
                      <Anchor className="w-6 h-6 text-ocean-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{reservation.marinaName}</h3>
                      <p className="text-sm text-gray-500">
                        Slip {reservation.slipNumber} • {reservation.yachtName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Check-in</p>
                      <p className="font-medium">{reservation.checkIn}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Check-out</p>
                      <p className="font-medium">{reservation.checkOut}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${reservation.totalCost}
                      </p>
                      <StatusBadge status={reservation.status} size="sm" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Book Slip Modal */}
      <Modal
        isOpen={showBookModal}
        onClose={() => {
          setShowBookModal(false);
          setSelectedMarina(null);
        }}
        title="Book a Slip"
        size="md"
      >
        {selectedMarina && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{selectedMarina.name}</p>
              <p className="text-sm text-gray-500">{selectedMarina.location}</p>
              <p className="text-lg font-bold text-ocean-600 mt-2">
                ${selectedMarina.pricePerNight}/night
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Yacht
              </label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500">
                <option value="1">Azure Dreams (85' Motor Yacht)</option>
                <option value="2">Ocean Serenity (65' Sailing Yacht)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Requests (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g., Need shore power, prefer end slip..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
              />
            </div>

            <div className="p-4 bg-ocean-50 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">3 nights × ${selectedMarina.pricePerNight}</span>
                <span className="font-medium">${selectedMarina.pricePerNight * 3}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Service fee</span>
                <span className="font-medium">$50</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t border-ocean-200">
                <span>Total</span>
                <span className="text-ocean-600">${selectedMarina.pricePerNight * 3 + 50}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => setShowBookModal(false)}>
                Cancel
              </Button>
              <Button icon={<Calendar className="w-4 h-4" />}>
                Request Reservation
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
