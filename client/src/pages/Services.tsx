import React, { useState } from 'react';
import {
  Wrench,
  Search,
  Plus,
  Star,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Filter,
  DollarSign,
} from 'lucide-react';
import Header from '../components/layout/Header';
import { Card, Button, StatusBadge, Modal, EmptyState } from '../components/common';

interface ServiceProvider {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  location: string;
  phone: string;
  availability: string;
  priceRange: string;
  services: string[];
  verified: boolean;
}

interface ServiceRequest {
  id: number;
  providerId: number;
  providerName: string;
  service: string;
  yachtName: string;
  requestDate: string;
  scheduledDate: string;
  status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  estimatedCost: number;
}

const serviceCategories = [
  'All',
  'Maintenance',
  'Cleaning',
  'Catering',
  'Fuel',
  'Electronics',
  'Canvas & Upholstery',
  'Diving Services',
  'Provisioning',
];

const sampleProviders: ServiceProvider[] = [
  {
    id: 1,
    name: 'Newport Marine Services',
    category: 'Maintenance',
    rating: 4.9,
    reviews: 127,
    location: 'Newport Beach, CA',
    phone: '+1 (949) 555-0123',
    availability: 'Mon-Sat, 7AM-6PM',
    priceRange: '$$$',
    services: ['Engine Service', 'Hull Cleaning', 'Bottom Painting', 'Electrical'],
    verified: true,
  },
  {
    id: 2,
    name: 'Pacific Yacht Detailing',
    category: 'Cleaning',
    rating: 4.8,
    reviews: 89,
    location: 'Marina del Rey, CA',
    phone: '+1 (310) 555-0456',
    availability: '7 days, 6AM-8PM',
    priceRange: '$$',
    services: ['Interior Detailing', 'Exterior Wash', 'Teak Restoration'],
    verified: true,
  },
  {
    id: 3,
    name: 'Gourmet Yacht Catering',
    category: 'Catering',
    rating: 5.0,
    reviews: 56,
    location: 'San Diego, CA',
    phone: '+1 (619) 555-0789',
    availability: 'By appointment',
    priceRange: '$$$$',
    services: ['Fine Dining', 'Event Catering', 'Provisioning', 'Private Chef'],
    verified: true,
  },
];

const sampleRequests: ServiceRequest[] = [
  {
    id: 1,
    providerId: 1,
    providerName: 'Newport Marine Services',
    service: 'Engine Service',
    yachtName: 'Azure Dreams',
    requestDate: '2024-09-01',
    scheduledDate: '2024-09-15',
    status: 'Confirmed',
    estimatedCost: 2500,
  },
  {
    id: 2,
    providerId: 2,
    providerName: 'Pacific Yacht Detailing',
    service: 'Full Detail',
    yachtName: 'Ocean Serenity',
    requestDate: '2024-09-05',
    scheduledDate: '2024-09-10',
    status: 'In Progress',
    estimatedCost: 850,
  },
];

export default function Services() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'providers' | 'requests'>('providers');
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const filteredProviders = sampleProviders.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.services.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || provider.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Services" subtitle="Find and manage yacht services" />

      <div className="p-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('providers')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'providers'
                ? 'bg-ocean-100 text-ocean-700'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Service Providers
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'requests'
                ? 'bg-ocean-100 text-ocean-700'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            My Requests
            <span className="ml-2 px-2 py-0.5 bg-ocean-500 text-white text-xs rounded-full">
              {sampleRequests.length}
            </span>
          </button>
        </div>

        {activeTab === 'providers' ? (
          <>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services or providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
                >
                  {serviceCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'All' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>

                <Button variant="secondary" icon={<Filter className="w-4 h-4" />}>
                  Filters
                </Button>
              </div>
            </div>

            {/* Providers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map((provider) => (
                <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                        {provider.verified && (
                          <CheckCircle2 className="w-4 h-4 text-ocean-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{provider.category}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{provider.priceRange}</span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{provider.rating}</span>
                      <span className="text-sm text-gray-500">({provider.reviews})</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{provider.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{provider.availability}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {provider.services.slice(0, 3).map((service) => (
                      <span
                        key={service}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {service}
                      </span>
                    ))}
                    {provider.services.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{provider.services.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedProvider(provider)}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedProvider(provider);
                        setShowRequestModal(true);
                      }}
                    >
                      Request Service
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          /* Service Requests */
          <div className="space-y-4">
            {sampleRequests.map((request) => (
              <Card key={request.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-ocean-100 rounded-lg">
                      <Wrench className="w-6 h-6 text-ocean-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{request.service}</h3>
                      <p className="text-sm text-gray-500">
                        {request.providerName} • {request.yachtName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${request.estimatedCost.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">{request.scheduledDate}</p>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Request Service Modal */}
      <Modal
        isOpen={showRequestModal}
        onClose={() => {
          setShowRequestModal(false);
          setSelectedProvider(null);
        }}
        title="Request Service"
        size="md"
      >
        {selectedProvider && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{selectedProvider.name}</p>
              <p className="text-sm text-gray-500">{selectedProvider.category}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Service
              </label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500">
                {selectedProvider.services.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Yacht
              </label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500">
                <option value="1">Azure Dreams</option>
                <option value="2">Ocean Serenity</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Any specific requirements..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => setShowRequestModal(false)}>
                Cancel
              </Button>
              <Button>Submit Request</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
